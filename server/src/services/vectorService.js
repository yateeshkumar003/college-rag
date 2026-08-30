const pineconeIndex = require('../config/pinecone');
const env = require('../config/env');
const { generateEmbeddingsBatch } = require('./embeddingService');
const { AppError, VECTOR_SEARCH_FAILED } = require('../utils/errors');
const logger = require('../utils/logger');

// Local in-memory store simulating a vector database for offline development/testing
const mockVectorStore = new Map();

/**
 * Batch generate embeddings and index chunks into Pinecone (or local mock store)
 * @param {Array<Object>} chunkDocs - Array of MongoDB DocumentChunk records
 * @param {string} docId - Parent Document ID
 * @param {string} docTitle - Parent Document Title
 * @returns {Promise<Array<string>>} - List of Pinecone Vector IDs upserted
 */
const upsertChunks = async (chunkDocs, docId, docTitle) => {
  try {
    logger.info(`[VECTOR SERVICE] Generating embeddings and indexing ${chunkDocs.length} chunks...`);

    // 1. Extract texts and batch compute embeddings (can be real or mock depending on API key)
    const texts = chunkDocs.map((c) => c.text);
    const embeddings = await generateEmbeddingsBatch(texts);

    // 2. Format vectors for indexing
    const records = chunkDocs.map((chunk, idx) => {
      return {
        id: chunk._id.toString(), // Use MongoDB Chunk ID as vector identifier
        values: embeddings[idx],
        metadata: {
          documentId: docId.toString(),
          documentTitle: docTitle,
          page: chunk.page || 1,
          chunkIndex: chunk.chunkIndex,
          text: chunk.text
        }
      };
    });

    const namespace = env.PINECONE_NAMESPACE || 'college-docs';

    // 3. Check if we should run in mock mode
    if (!pineconeIndex || env.PINECONE_API_KEY === 'placeholder_api_key') {
      logger.info(`[VECTOR SERVICE] Running in MOCK mode. Storing ${records.length} chunks in-memory.`);
      
      if (!mockVectorStore.has(namespace)) {
        mockVectorStore.set(namespace, new Map());
      }
      
      const nsStore = mockVectorStore.get(namespace);
      records.forEach((r) => nsStore.set(r.id, r));
      
      logger.info(`[VECTOR SERVICE MOCK] Successfully indexed in-memory for namespace: ${namespace}`);
      return records.map((r) => r.id);
    }

    // 4. Otherwise upsert into real Pinecone Index
    await pineconeIndex.namespace(namespace).upsert({ records });

    logger.info(`[VECTOR SERVICE] Successfully indexed ${records.length} vectors in Pinecone namespace: ${namespace}`);

    // Return the Pinecone Vector IDs (same as MongoDB chunk IDs)
    return records.map((r) => r.id);
  } catch (error) {
    logger.error(`[VECTOR SERVICE ERROR] Upsert failed: ${error.message}`);
    throw new AppError(VECTOR_SEARCH_FAILED, `Vector database synchronization failed: ${error.message}`, 500);
  }
};

/**
 * Remove all vectors associated with a document ID
 * @param {string} docId - Document ID to delete
 */
const deleteVectorsByDocumentId = async (docId) => {
  try {
    const namespace = env.PINECONE_NAMESPACE || 'college-docs';

    // 1. Mock delete
    if (!pineconeIndex || env.PINECONE_API_KEY === 'placeholder_api_key') {
      logger.info(`[VECTOR SERVICE] Running in MOCK mode. Deleting document chunks for ID: ${docId} from local mock.`);
      
      const nsStore = mockVectorStore.get(namespace);
      if (nsStore) {
        for (const [id, record] of nsStore.entries()) {
          if (record.metadata.documentId === docId.toString()) {
            nsStore.delete(id);
          }
        }
      }
      return;
    }

    // 2. Real Pinecone delete
    logger.info(`[VECTOR SERVICE] Deleting vectors for document: ${docId} from namespace: ${namespace}`);

    await pineconeIndex.namespace(namespace).deleteMany({
      filter: {
        documentId: { $eq: docId.toString() }
      }
    });

    logger.info(`[VECTOR SERVICE] Successfully deleted Pinecone vectors for document: ${docId}`);
  } catch (error) {
    logger.error(`[VECTOR SERVICE ERROR] Delete failed for document ${docId}: ${error.message}`);
    throw new AppError(VECTOR_SEARCH_FAILED, `Vector database delete operation failed: ${error.message}`, 500);
  }
};

/**
 * Query for the top relevant matching chunks (Cosine Similarity)
 * @param {Array<number>} queryVector - Embedding of the query string
 * @param {number} topK - Number of matches to retrieve
 * @returns {Promise<Array<Object>>} - Matching vector descriptors
 */
const similaritySearch = async (queryVector, topK = 5, queryText = '') => {
  try {
    const namespace = env.PINECONE_NAMESPACE || 'college-docs';

    // 1. Mock similarity search (Local Cosine Similarity engine)
    if (!pineconeIndex || env.PINECONE_API_KEY === 'placeholder_api_key') {
      logger.info(`[VECTOR SERVICE] Running in MOCK mode. Simulating cosine search against in-memory vectors.`);
      
      const nsStore = mockVectorStore.get(namespace);
      if (!nsStore) return [];

      const matches = [];
      
      // Calculate Cosine Similarity
      const calculateCosine = (vecA, vecB) => {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
          dotProduct += vecA[i] * vecB[i];
          normA += vecA[i] * vecA[i];
          normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      };

      // Hybrid keyword overlap helper to prevent false positive matches on unrelated inputs
      const getKeywordOverlap = (qText, cText) => {
        if (!qText) return 1.0;
        const stopWords = new Set(['what', 'is', 'the', 'of', 'in', 'and', 'for', 'are', 'to', 'a', 'about', 'how', 'when', 'where', 'who', 'why']);
        const qWords = qText.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w));
        if (qWords.length === 0) return 1.0;
        
        let matches = 0;
        const cTextLower = cText.toLowerCase();
        qWords.forEach(w => {
          if (cTextLower.includes(w)) {
            matches++;
          }
        });
        return matches / qWords.length;
      };

      for (const record of nsStore.values()) {
        const overlap = getKeywordOverlap(queryText, record.metadata.text);
        
        // Simple and robust mock score matching overlap percentage
        const score = overlap;

        matches.push({
          id: record.id,
          score: score,
          metadata: record.metadata
        });
      }

      // Sort and slice top results
      matches.sort((a, b) => b.score - a.score);
      const topMatches = matches.slice(0, topK);

      return topMatches.map((match) => ({
        chunkId: match.id,
        score: match.score,
        text: match.metadata?.text || '',
        documentId: match.metadata?.documentId || '',
        documentTitle: match.metadata?.documentTitle || '',
        page: match.metadata?.page || 1,
        chunkIndex: match.metadata?.chunkIndex || 0
      }));
    }

    // 2. Real Pinecone similarity search
    const queryResponse = await pineconeIndex.namespace(namespace).query({
      vector: queryVector,
      topK: topK,
      includeMetadata: true
    });

    if (!queryResponse.matches) {
      return [];
    }

    return queryResponse.matches.map((match) => ({
      chunkId: match.id,
      score: match.score || 0,
      text: match.metadata?.text || '',
      documentId: match.metadata?.documentId || '',
      documentTitle: match.metadata?.documentTitle || '',
      page: match.metadata?.page || 1,
      chunkIndex: match.metadata?.chunkIndex || 0
    }));
  } catch (error) {
    logger.error(`[VECTOR SERVICE ERROR] Similarity search failed: ${error.message}`);
    throw new AppError(VECTOR_SEARCH_FAILED, `Vector similarity search failed: ${error.message}`, 500);
  }
};

module.exports = {
  upsertChunks,
  deleteVectorsByDocumentId,
  similaritySearch,
  // Exporting the local store for test inspections if needed
  _mockVectorStore: mockVectorStore
};

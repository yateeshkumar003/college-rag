const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const { extractPdfText } = require('../processing/pdfExtractor');
const { extractDocxText } = require('../processing/docxExtractor');
const { cleanText } = require('../processing/textCleaner');
const { chunkDocument } = require('../processing/chunker');
const env = require('../config/env');
const logger = require('../utils/logger');
const { upsertChunks } = require('./vectorService');

/**
 * Run document ingestion pipeline in background
 * @param {string} documentId - MongoDB Document ID
 */
const ingestDocument = async (documentId) => {
  try {
    // 1. Fetch document record
    const doc = await Document.findById(documentId);
    if (!doc) {
      logger.error(`[INGESTION] Document ${documentId} not found in database.`);
      return;
    }

    logger.info(`[INGESTION] Starting parsing for: ${doc.title} (${doc.originalName})`);
    
    // Update status to PROCESSING
    doc.status = 'PROCESSING';
    await doc.save();

    // 2. Read file from disk
    if (!fs.existsSync(doc.filePath)) {
      throw new Error(`Local file not found on disk at: ${doc.filePath}`);
    }
    const buffer = fs.readFileSync(doc.filePath);

    // 3. Extract text based on document type
    let extractedPages = [];
    if (doc.fileType === 'pdf') {
      extractedPages = await extractPdfText(buffer);
    } else if (doc.fileType === 'docx') {
      extractedPages = await extractDocxText(buffer);
    } else {
      throw new Error(`Unsupported file type: ${doc.fileType}`);
    }

    // 4. Clean and preprocess extracted text page by page
    const cleanedPages = extractedPages.map((pageObj) => ({
      text: cleanText(pageObj.text),
      page: pageObj.page
    })).filter(pageObj => pageObj.text.length > 0);

    if (cleanedPages.length === 0) {
      throw new Error('Extracted document content is empty or contains unreadable characters.');
    }

    // 5. Chunk the text pages using centralized configs
    const chunks = chunkDocument(cleanedPages, env.CHUNK_SIZE, env.CHUNK_OVERLAP);
    
    // Clear old chunk records if re-processing
    await DocumentChunk.deleteMany({ documentId: doc._id });

    // 6. Create chunk metadata records in MongoDB
    const chunkPromises = chunks.map((chunkObj) => {
      return DocumentChunk.create({
        documentId: doc._id,
        chunkIndex: chunkObj.chunkIndex,
        text: chunkObj.text,
        page: chunkObj.page,
        section: doc.category // Default section to category for now
      });
    });

    const chunkRecords = await Promise.all(chunkPromises);

    // 6.5 Generate embeddings and store vectors in Pinecone
    const vectorIds = await upsertChunks(chunkRecords, doc._id, doc.title);

    // Sync vector IDs back into chunk records in MongoDB
    const syncPromises = chunkRecords.map((record, index) => {
      record.pineconeVectorId = vectorIds[index];
      return record.save();
    });
    await Promise.all(syncPromises);

    // 7. Update document status to READY and set counts
    doc.status = 'READY';
    doc.chunkCount = chunks.length;
    doc.errorMessage = undefined;
    await doc.save();

    logger.info(`[INGESTION] Completed successfully for ${doc.title}. Created ${chunks.length} chunks.`);

  } catch (error) {
    logger.error(`[INGESTION ERROR] Processing failed for document ${documentId}: ${error.message}`);
    
    // Update status to FAILED and record error message
    try {
      await Document.findByIdAndUpdate(documentId, {
        status: 'FAILED',
        errorMessage: error.message
      });
    } catch (dbErr) {
      logger.error(`[DATABASE ERROR] Failed to record error status: ${dbErr.message}`);
    }
  }
};

module.exports = {
  ingestDocument
};

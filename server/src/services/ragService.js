const { generateEmbedding } = require('./embeddingService');
const { similaritySearch } = require('./vectorService');
const { generateGroundedAnswer } = require('./llmService');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Execute Retrieval-Augmented Generation (RAG) query pipeline
 * @param {string} question - Student input query
 * @returns {Promise<Object>} - Grounded answer and sources array
 */
const queryGroundedRAG = async (question) => {
  logger.info(`[RAG PIPELINE] Processing query: "${question}"`);

  // 1. Generate query embedding vector
  const queryVector = await generateEmbedding(question);

  // 2. Search Pinecone Vector Index for similarity matches
  const topK = parseInt(env.TOP_K, 10) || 5;
  const rawMatches = await similaritySearch(queryVector, topK, question);

  // Log raw search diagnostics
  logger.info(`[RAG DIAGNOSTICS] Query: "${question}"`);
  logger.info(`[RAG DIAGNOSTICS] Chunks retrieved from Vector Store: ${rawMatches.length}`);
  rawMatches.forEach((m, i) => {
    logger.info(`[RAG DIAGNOSTICS] Match ${i + 1}: Score = ${m.score.toFixed(4)} | Title = "${m.documentTitle}" | Page = ${m.page}`);
  });

  // 3. Filter retrieved chunks by minimum relevance score
  const threshold = parseFloat(env.MIN_RELEVANCE_SCORE) || 0.65;
  const filteredMatches = rawMatches.filter((match) => match.score >= threshold);
  
  logger.info(`[RAG DIAGNOSTICS] Chunks passing threshold (${threshold}): ${filteredMatches.length}`);

  // Standard grounding refusal string
  const refusalMessage = "I couldn't find this information in the college documents available to me. Please check with the concerned department or upload the relevant document.";

  // 4. Return refusal early if no relevant documents passed threshold
  if (filteredMatches.length === 0) {
    logger.warn('[RAG PIPELINE] No chunks passed threshold. Returning refusal message.');
    return {
      answer: refusalMessage,
      grounded: false,
      sources: []
    };
  }

  // 5. Build context block
  // Join the text elements of all matching chunks separated by double spacing
  const context = filteredMatches.map((m) => `[Source: ${m.documentTitle}, Page: ${m.page}]\n${m.text}`).join('\n\n');

  // 6. Generate answer using grounded prompt constraints
  const answer = await generateGroundedAnswer(question, context);

  // 7. Determine grounding state
  // If the answer is the refusal string or states lack of information, mark as ungrounded
  const isRefusal = 
    answer.toLowerCase().includes("couldn't find") ||
    answer.toLowerCase().includes("not available in the college") ||
    answer === refusalMessage;

  const grounded = !isRefusal;

  // 8. Map citation references
  const sources = filteredMatches.map((m) => ({
    documentId: m.documentId,
    documentTitle: m.documentTitle,
    page: m.page,
    chunkId: m.chunkId,
    score: parseFloat(m.score.toFixed(4)),
    excerpt: m.text.substring(0, 150) + (m.text.length > 150 ? '...' : '')
  }));

  logger.info(`[RAG PIPELINE] Completed. Grounded status: ${grounded}. Sources cited: ${sources.length}`);

  return {
    answer,
    grounded,
    sources
  };
};

module.exports = {
  queryGroundedRAG
};

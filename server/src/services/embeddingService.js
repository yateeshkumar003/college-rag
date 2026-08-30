const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const { AppError, EMBEDDING_FAILED } = require('../utils/errors');
const logger = require('../utils/logger');

let genAI = null;

if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
} else {
  logger.warn('[EMBEDDINGS] Missing GEMINI_API_KEY. Embedding operations will fail.');
}

/**
 * Generate 768-dimension vector embedding for input text using text-embedding-004
 * @param {string} text - Cleaned text segment
 * @returns {Promise<Array<number>>} - Mathematical vector representing text semantics
 */
const generateEmbedding = async (text) => {
  try {
    const isRealKey = env.GEMINI_API_KEY && (env.GEMINI_API_KEY.startsWith('AIzaSy') || env.GEMINI_API_KEY.startsWith('AQ.'));

    if (!genAI || !isRealKey) {
      logger.debug(`[EMBEDDINGS] Running in MOCK mode for text: "${text.substring(0, 30)}..."`);
      // Return a deterministic mock vector of 768 dimensions in range [-1, 1]
      const vector = new Array(768).fill(0);
      for (let i = 0; i < 768; i++) {
        const charCode = text.charCodeAt(i % text.length) || 0;
        vector[i] = Math.sin(charCode + i); // Value between -1 and 1
      }
      return vector;
    }

    // Default to the optimized Google embeddings model
    const model = genAI.getGenerativeModel(
      { model: 'gemini-embedding-001' },
      { apiVersion: 'v1' }
    );
    
    const result = await model.embedContent({
      content: {
        parts: [{ text }]
      },
      outputDimensionality: 768
    });
    if (!result || !result.embedding || !result.embedding.values) {
      throw new Error('Invalid response structure received from Gemini API');
    }

    return result.embedding.values;
  } catch (error) {
    logger.error(`[EMBEDDING ERROR] Failed: ${error.message}`);
    throw new AppError(EMBEDDING_FAILED, `Embedding generation failed: ${error.message}`, 500);
  }
};

/**
 * Generate vector embeddings for a batch of strings concurrently
 * @param {Array<string>} texts - Chunks text content
 * @returns {Promise<Array<Array<number>>>}
 */
const generateEmbeddingsBatch = async (texts) => {
  return await Promise.all(texts.map((txt) => generateEmbedding(txt)));
};

module.exports = {
  generateEmbedding,
  generateEmbeddingsBatch
};

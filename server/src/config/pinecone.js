const { Pinecone } = require('@pinecone-database/pinecone');
const env = require('./env');
const logger = require('../utils/logger');

let pineconeIndex = null;

try {
  if (!env.PINECONE_API_KEY || !env.PINECONE_INDEX) {
    logger.warn('[PINECONE] Missing environment keys (PINECONE_API_KEY or PINECONE_INDEX). Vector operations will fail.');
  } else {
    const pc = new Pinecone({
      apiKey: env.PINECONE_API_KEY
    });
    
    pineconeIndex = pc.index(env.PINECONE_INDEX);
    logger.info(`[PINECONE] Initialized Pinecone connection for index: ${env.PINECONE_INDEX}`);
  }
} catch (error) {
  logger.error(`[PINECONE ERROR] Failed to connect: ${error.message}`);
}

module.exports = pineconeIndex;

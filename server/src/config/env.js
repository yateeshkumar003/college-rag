const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];

// Log warnings for missing API keys (needed in later phases)
const warningEnv = ['GEMINI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX'];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[ERROR] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

warningEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[WARNING] Missing environment variable: ${key}. This will be required in later RAG/vector phases.`);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  
  // Gemini & Pinecone config (to be used in Phase 3/4)
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: (!process.env.GEMINI_MODEL || ['gemini-1.5-flash', 'gemini-2.5-flash'].includes(process.env.GEMINI_MODEL)) ? 'gemini-3.6-flash' : process.env.GEMINI_MODEL,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  PINECONE_INDEX: process.env.PINECONE_INDEX,
  PINECONE_NAMESPACE: process.env.PINECONE_NAMESPACE || 'college-docs',
  
  // RAG hyperparameters (centralized as requested)
  TOP_K: parseInt(process.env.TOP_K || '5', 10),
  MIN_RELEVANCE_SCORE: parseFloat(process.env.MIN_RELEVANCE_SCORE || '0.65'),
  CHUNK_SIZE: parseInt(process.env.CHUNK_SIZE || '900', 10),
  CHUNK_OVERLAP: parseInt(process.env.CHUNK_OVERLAP || '120', 10)
};

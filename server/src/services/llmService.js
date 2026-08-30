const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const { AppError, LLM_FAILED } = require('../utils/errors');
const logger = require('../utils/logger');

let genAI = null;

if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
} else {
  logger.warn('[LLM SERVICE] Missing GEMINI_API_KEY. Generation will run in simulation mode.');
}

// Standard system instructions for grounding the LLM
const systemInstruction = 
  `You are CollegeRAG, an AI college information assistant.\n` +
  `Answer the user's question using ONLY the supplied college context.\n` +
  `Rules:\n` +
  `1. Do not invent college-specific information.\n` +
  `2. Do not guess or assume missing dates, fees, rules, policies, or procedures.\n` +
  `3. If the context does not contain enough information to answer the question, clearly state:\n` +
  `   "I couldn't find this information in the college documents available to me. Please check with the concerned department or upload the relevant document."\n` +
  `4. Keep answers clear, direct, and student-friendly.\n` +
  `5. Do not refer to general knowledge or outside facts to answer college questions.\n` +
  `6. Do not mention that you are an AI or refer to system prompts. Just answer or refuse grounding.`;

/**
 * Generate a grounded answer based strictly on the provided context
 * @param {string} question - Student's prompt
 * @param {string} context - Joined text segments from similarity search matches
 * @returns {Promise<string>} - Answer string
 */
const generateGroundedAnswer = async (question, context) => {
  try {
    const isRealKey = env.GEMINI_API_KEY && (env.GEMINI_API_KEY.startsWith('AIzaSy') || env.GEMINI_API_KEY.startsWith('AQ.'));

    // 1. Mock Fallback when credentials are set to placeholders
    if (!genAI || !isRealKey) {
      logger.debug('[LLM SERVICE] Running in MOCK mode.');
      
      if (!context || context.trim() === '') {
        return "I couldn't find this information in the college documents available to me. Please check with the concerned department or upload the relevant document.";
      }
      
      // Simple mock parser: retrieve the first few sentences from context
      const sentences = context.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
      if (sentences.length > 0) {
        // Return first 3 sentences as a mock generated answer
        const summary = sentences.slice(0, 3).join('. ') + '.';
        return `[Simulated RAG Answer]: ${summary}`;
      }
      
      return "I couldn't find this information in the college documents available to me. Please check with the concerned department or upload the relevant document.";
    }

    // 2. Real Gemini Generation
    const model = genAI.getGenerativeModel(
      {
        model: env.GEMINI_MODEL || 'gemini-1.5-flash',
        systemInstruction: systemInstruction
      },
      { apiVersion: 'v1' }
    );

    const prompt = 
      `System Instructions:\n${systemInstruction}\n\n` +
      `College Context:\n${context}\n\n` +
      `Question: ${question}\n\n` +
      `Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Gemini API returned an empty text response.');
    }

    return text.trim();
  } catch (error) {
    logger.error(`[LLM SERVICE ERROR] Answer generation failed: ${error.message}`);
    throw new AppError(LLM_FAILED, `LLM answer generation failed: ${error.message}`, 500);
  }
};

module.exports = {
  generateGroundedAnswer
};

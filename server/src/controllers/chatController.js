const conversationService = require('../services/conversationService');
const { queryGroundedRAG } = require('../services/ragService');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { AppError } = require('../utils/errors');

/**
 * Handle student query messages, invoke RAG pipeline, and persist records
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    let { conversationId } = req.body;

    if (!message || message.trim() === '') {
      return next(new AppError('MESSAGE_REQUIRED', 'Please provide message content', 400));
    }

    const userId = req.user._id;

    // 1. Create conversation thread if not specified
    if (!conversationId) {
      // Use the first 30 characters of the question as the default title
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      const newConv = await conversationService.createConversation(userId, title);
      conversationId = newConv._id;
    } else {
      // Check conversation existence and ownership
      const existingConv = await Conversation.findById(conversationId);
      if (!existingConv) {
        return next(new AppError('CONVERSATION_NOT_FOUND', 'Conversation thread not found', 404));
      }
      if (existingConv.userId.toString() !== userId.toString()) {
        return next(new AppError('FORBIDDEN', 'Access denied to this conversation thread', 403));
      }
    }

    // 2. Save user message to database
    await Message.create({
      conversationId,
      role: 'user',
      content: message.trim()
    });

    // 3. Process similarity retrieval and prompt Gemini LLM
    const ragResult = await queryGroundedRAG(message.trim());

    // 4. Save assistant reply to database
    const assistantMessage = await Message.create({
      conversationId,
      role: 'assistant',
      content: ragResult.answer,
      grounded: ragResult.grounded,
      sources: ragResult.sources
    });

    // Trigger update on conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });

    res.status(200).json({
      success: true,
      conversationId,
      answer: ragResult.answer,
      grounded: ragResult.grounded,
      sources: ragResult.sources,
      messageId: assistantMessage._id
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Fetch all conversations for the logged in student
 */
const getConversations = async (req, res, next) => {
  try {
    const conversations = await conversationService.getUserConversations(req.user._id);
    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch all messages in a specific conversation
 */
const getMessages = async (req, res, next) => {
  try {
    const messages = await conversationService.getConversationMessages(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Explicitly create a new conversation thread
 */
const createNewConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conv = await conversationService.createConversation(req.user._id, title);
    res.status(201).json({
      success: true,
      data: conv
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete conversation history
 */
const deleteConversation = async (req, res, next) => {
  try {
    await conversationService.deleteConversation(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: 'Conversation history deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getConversations,
  getMessages,
  createNewConversation,
  deleteConversation
};

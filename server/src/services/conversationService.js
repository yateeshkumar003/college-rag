const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { AppError, CONVERSATION_NOT_FOUND } = require('../utils/errors');

/**
 * Create a new conversation thread
 */
const createConversation = async (userId, title) => {
  return await Conversation.create({
    userId,
    title: title || 'New Conversation'
  });
};

/**
 * Fetch all conversations for a specific student
 */
const getUserConversations = async (userId) => {
  return await Conversation.find({ userId }).sort({ updatedAt: -1 });
};

/**
 * Get messages inside a conversation thread, validating ownership
 */
const getConversationMessages = async (conversationId, userId) => {
  const conv = await Conversation.findById(conversationId);
  if (!conv) {
    throw new AppError(CONVERSATION_NOT_FOUND, 'Conversation thread not found', 404);
  }

  // Security constraint: students can only access their own conversations
  if (conv.userId.toString() !== userId.toString()) {
    throw new AppError('FORBIDDEN', 'Access denied to this conversation thread', 403);
  }

  return await Message.find({ conversationId }).sort({ createdAt: 1 });
};

/**
 * Delete a conversation and cascade delete all its messages
 */
const deleteConversation = async (conversationId, userId) => {
  const conv = await Conversation.findById(conversationId);
  if (!conv) {
    throw new AppError(CONVERSATION_NOT_FOUND, 'Conversation thread not found', 404);
  }

  if (conv.userId.toString() !== userId.toString()) {
    throw new AppError('FORBIDDEN', 'Access denied to delete this conversation thread', 403);
  }

  // Cascade delete all message records
  await Message.deleteMany({ conversationId });
  
  // Delete conversation model
  await Conversation.findByIdAndDelete(conversationId);

  return { success: true };
};

module.exports = {
  createConversation,
  getUserConversations,
  getConversationMessages,
  deleteConversation
};

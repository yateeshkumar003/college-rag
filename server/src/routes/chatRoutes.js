const express = require('express');
const chatController = require('../controllers/chatController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// All chat routes require authentication (both student and admin are allowed to chat)
router.use(protect);

// Send message & generate RAG response (POST /api/chat)
router.post('/', chatController.sendMessage);

// Get listings of user conversations (GET /api/chat/conversations)
router.get('/conversations', chatController.getConversations);

// Create new blank conversation thread (POST /api/chat/conversations)
router.post('/conversations', chatController.createNewConversation);

// Get all messages in a specific conversation (GET /api/chat/conversations/:id)
router.get('/conversations/:id', chatController.getMessages);

// Delete specific conversation (DELETE /api/chat/conversations/:id)
router.delete('/conversations/:id', chatController.deleteConversation);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getHistory,
  deleteMessage,
  deleteAllMessagesByUserId,
  deleteAllMessagesByUserName,
} = require('../controllers/chatController');

// POST /api/chat - Send a message and get AI response
router.post('/', sendMessage);

// GET /api/chat/history - Fetch conversation history
router.get('/history', getHistory);

// DELETE /api/chat/history - Delete all messages for a user by name (?name=...)
router.delete('/history', deleteAllMessagesByUserName);

// DELETE /api/chat/history/user/:id - Delete all messages for a user by user ID
router.delete('/history/user/:id', deleteAllMessagesByUserId);

// DELETE /api/chat/history/:id - Delete a specific message
router.delete('/history/:id', deleteMessage);

module.exports = router;

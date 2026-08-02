const User = require('../models/User');
const Message = require('../models/Message');
const { generateAIResponse } = require('../services/aiService');

/**
 * POST /api/chat
 * Send a message and get an AI response
 */
const sendMessage = async (req, res) => {
  try {
    const { name, message } = req.body;

    // Validate request body
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name and message are required',
      });
    }

    if (typeof name !== 'string' || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Name and message must be strings',
      });
    }

    if (name.trim().length === 0 || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Name and message cannot be empty',
      });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        error: 'Name cannot exceed 50 characters',
      });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot exceed 2000 characters',
      });
    }

    // Find or create user
    let user = await User.findOne({ name: name.trim() });
    if (!user) {
      user = await User.create({ name: name.trim() });
    }

    // Save user message
    const userMessage = await Message.create({
      user: user._id,
      role: 'user',
      content: message.trim(),
    });

    // Fetch recent history for context
    const history = await Message.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Generate AI response
    let aiResponse;
    try {
      aiResponse = await generateAIResponse(user.name, message.trim(), history);
    } catch (aiError) {
      // Save a failed marker message so history reflects the error
      await Message.create({
        user: user._id,
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
      });
      return res.status(502).json({
        success: false,
        error: 'AI service is currently unavailable. Please try again later.',
      });
    }

    // Save AI response
    const assistantMessage = await Message.create({
      user: user._id,
      role: 'assistant',
      content: aiResponse,
    });

    return res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        userMessage: {
          id: userMessage._id,
          role: 'user',
          content: userMessage.content,
          createdAt: userMessage.createdAt,
        },
        assistantMessage: {
          id: assistantMessage._id,
          role: 'assistant',
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * GET /api/chat/history
 * Fetch conversation history, optionally filtered by user name
 */
const getHistory = async (req, res) => {
  try {
    const { name } = req.query;

    let query = {};

    if (name) {
      const user = await User.findOne({ name: name.trim() });
      if (!user) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }
      query = { user: user._id };
    }

    const messages = await Message.find(query)
      .populate('user', 'name')
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map((msg) => ({
      id: msg._id,
      role: msg.role,
      content: msg.content,
      userName: msg.user ? msg.user.name : null,
      userId: msg.user ? msg.user._id : null,
      createdAt: msg.createdAt,
    }));

    return res.status(200).json({
      success: true,
      data: formattedMessages,
    });
  } catch (error) {
    console.error('Error in getHistory:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};



/**
 * DELETE /api/chat/history/user/:id
 * Delete all messages for a specific user by user ID
 */
const deleteAllMessagesByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Validate that the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const result = await Message.deleteMany({ user: user._id });

    return res.status(200).json({
      success: true,
      message: `All chat messages for user "${user.name}" deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error in deleteAllMessagesByUserId:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * DELETE /api/chat/history?name=...
 * Delete all messages for a user by name
 */
const deleteAllMessagesByUserName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name query parameter is required',
      });
    }

    const user = await User.findOne({ name: name.trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const result = await Message.deleteMany({ user: user._id });

    return res.status(200).json({
      success: true,
      message: `All chat messages for user "${user.name}" deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error in deleteAllMessagesByUserName:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

module.exports = {
  sendMessage,
  getHistory,
  deleteMessage,
  deleteAllMessagesByUserId,
  deleteAllMessagesByUserName,
};

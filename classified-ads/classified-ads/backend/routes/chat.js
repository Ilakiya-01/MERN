const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    // Get all unique users the current user has chatted with
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ timestamp: -1 });

    // If no messages, return empty array
    if (!messages || messages.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach((message) => {
      // Check if message has valid sender and receiver
      if (!message.sender || !message.receiver) {
        return;
      }

      const otherUserId = message.sender._id.toString() === req.user._id.toString()
        ? message.receiver._id.toString()
        : message.sender._id.toString();

      const otherUserName = message.sender._id.toString() === req.user._id.toString()
        ? message.receiver.name
        : message.sender.name;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: message,
          unreadCount: 0,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('Error in /conversations:', error);
    console.error('req.user:', req.user);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get messages between two users
// @route   GET /api/chat/:userId
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Send message (fallback for HTTP, real-time via Socket.io)
// @route   POST /api/chat/send
// @access  Private
router.post('/send', protect, async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const receiverId = new mongoose.Types.ObjectId(receiver);

    // Create room identifier (sorted user IDs)
    const room = [req.user._id.toString(), receiver].sort().join('-');

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      room,
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;

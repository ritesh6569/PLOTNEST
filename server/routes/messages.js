const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get all messages for a deal
router.get('/:dealId', async (req, res) => {
  try {
    const messages = await Message.find({ deal: req.params.dealId }).populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  try {
    const { deal, sender, text } = req.body;
    const message = new Message({ deal, sender, text });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// Create a new deal
router.post('/', async (req, res) => {
  try {
    const deal = new Deal(req.body);
    await deal.save();
    res.status(201).json(deal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all deals (optionally filter by user)
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find().populate('plot buyer seller dealer');
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update deal status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(deal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 
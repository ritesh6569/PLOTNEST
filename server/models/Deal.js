const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  plot: { type: mongoose.Schema.Types.ObjectId, ref: 'Plot', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dealer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Inquiry', 'Dealer Assigned', 'Site Visit', 'Negotiation', 'Finalized'],
    default: 'Inquiry'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deal', dealSchema); 
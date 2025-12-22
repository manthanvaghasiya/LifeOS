const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a text'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number']
  },
  type: {
    type: String, // 'income', 'expense', 'transfer'
    required: true
  },
  category: {
    type: String,
    required: true
  },
  // --- NEW FIELD: INVESTMENT DETAILS ---
  investmentType: {
    type: String, // e.g., 'SIP', 'IPO', 'Gold', 'Stocks', 'FD', 'Liquid Fund'
    default: null
  },
  paymentMode: {
    type: String, // 'Cash', 'Bank', 'Investment'
    default: 'Bank'
  },
  // --- FIX: Add transferTo so we know the destination ---
  transferTo: {
    type: String, // 'Cash', 'Bank', 'Investment'
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
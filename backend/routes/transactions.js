const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// 1. GET ALL
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ... existing imports

// ADD TRANSACTION (Updated)
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, type, category, paymentMode, date, investmentType } = req.body; // <--- Extract investmentType

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      paymentMode,
      investmentType: investmentType || null, // <--- Save it
      date: date || Date.now()
    });

    return res.status(201).json(transaction);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages });
    } else {
      return res.status(500).json({ message: 'Server Error' });
    }
  }
});

// UPDATE TRANSACTION (Updated)
router.put('/:id', protect, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ message: 'User not authorized' });

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(transaction);
  } catch (err) {
    return res.status(500).json({ message: 'Server Error' });
  }
});


// 4. DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Not found' });
    if (transaction.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await transaction.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
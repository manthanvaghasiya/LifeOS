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

// ADD TRANSACTION (With multi-click duplicate protection)
router.post('/', protect, async (req, res) => {
  try {
    const { title, amount, type, category, paymentMode, bankAccountName, date, investmentType, transferTo, transferToAccountName } = req.body;

    const trimmedTitle = typeof title === 'string' ? title.trim() : '';
    const numericAmount = Number(amount);

    // Anti-duplicate protection: check if an identical transaction was created in the last 3 seconds
    const threeSecondsAgo = new Date(Date.now() - 3000);
    const existing = await Transaction.findOne({
      user: req.user.id,
      title: trimmedTitle,
      amount: numericAmount,
      type,
      category,
      createdAt: { $gte: threeSecondsAgo }
    });

    if (existing) {
      // Idempotent response: return existing record instead of inserting a duplicate
      return res.status(200).json(existing);
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title: trimmedTitle,
      amount: numericAmount,
      type,
      category,
      paymentMode,
      bankAccountName: bankAccountName || null,
      investmentType: investmentType || null,
      transferTo: transferTo || null,
      transferToAccountName: transferToAccountName || null,
      date: date || Date.now(),
      createdAt: new Date()
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

    // Whitelist updatable fields so the request body can't overwrite `user`, `_id`, etc.
    const allowed = ['title', 'amount', 'type', 'category', 'paymentMode', 'bankAccountName', 'date', 'investmentType', 'transferTo', 'transferToAccountName'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
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
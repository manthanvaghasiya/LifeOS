const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// 1. GET ALL
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction
      .find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. ADD TRANSACTION
router.post('/', protect, async (req, res) => {
  try {
    console.log('👉 ADD REQUEST RECEIVED:', req.body);

    const { title, amount, type, category, date, paymentMode } = req.body;

    if (!['Cash', 'Bank'].includes(paymentMode)) {
      return res.status(400).json({ message: 'paymentMode must be Cash or Bank' });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      paymentMode             // ✅ exactly what frontend sends
    });

    console.log('✅ SAVED TRANSACTION:', transaction);
    res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error adding transaction' });
  }
});

// 3. UPDATE TRANSACTION
router.put('/:id', protect, async (req, res) => {
  try {
    console.log('👉 UPDATE REQUEST RECEIVED:', req.body);

    const existing = await Transaction.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Not found' });
    if (existing.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!['Cash', 'Bank'].includes(req.body.paymentMode)) {
      return res.status(400).json({ message: 'paymentMode must be Cash or Bank' });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        amount: req.body.amount,
        type: req.body.type,
        category: req.body.category,
        date: req.body.date,
        paymentMode: req.body.paymentMode   // ✅ no default
      },
      { new: true }
    );

    console.log('✅ UPDATED TRANSACTION:', updated);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// 4. DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Not found' });
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

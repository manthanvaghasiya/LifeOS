const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Habit = require('../models/Habit');
const Goal = require('../models/Goal');
const Note = require('../models/Note');
const Task = require('../models/Task');
const Health = require('../models/Health');
const Asset = require('../models/Asset');
const { protect } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// 1. GET USER PROFILE
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) { res.status(500).json({ message: 'Server Error' }); }
});

// 2. UPDATE PROFILE
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: req.headers.authorization.split(' ')[1] // Keep same token
    });
  } catch (err) { res.status(500).json({ message: 'Update failed' }); }
});

// 3. DELETE ACCOUNT (and all data owned by this user)
router.delete('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove every record belonging to this user, then the account itself.
    await Promise.all([
      Transaction.deleteMany({ user: userId }),
      Habit.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Note.deleteMany({ user: userId }),
      Task.deleteMany({ user: userId }),
      Health.deleteMany({ user: userId }),
      Asset.deleteMany({ user: userId }),
    ]);

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account and all associated data permanently deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

// ... existing imports and routes

// 4. GAIN XP (The Level Up Logic)
router.put('/xp', protect, async (req, res) => {
  try {
    const { xp } = req.body; // e.g., { xp: 20 }
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    user.currentXP += xp;

    // CHECK FOR LEVEL UP
    let leveledUp = false;
    if (user.currentXP >= user.requiredXP) {
      user.level += 1;
      user.currentXP -= user.requiredXP; // Carry over extra XP
      user.requiredXP = user.level * 100; // Harder to reach next level
      leveledUp = true;
    }

    await user.save();

    res.json({
      level: user.level,
      currentXP: user.currentXP,
      requiredXP: user.requiredXP,
      leveledUp // Tell frontend to show fireworks
    });
  } catch (err) {
    res.status(500).json({ message: 'XP Error' });
  }
});

// 5. GET CUSTOM CATEGORIES
router.get('/categories', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('customCategories');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.customCategories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// 6. ADD CUSTOM CATEGORY
router.put('/categories', protect, async (req, res) => {
  try {
    const { type, name } = req.body; // type: 'expense' | 'income' | 'investmentTypes' | 'bankAccounts'

    if (!type || !name) {
      return res.status(400).json({ message: 'Type and name are required' });
    }

    if (!['expense', 'income', 'investmentTypes', 'bankAccounts'].includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const trimmed = name.trim();
    const catArray = user.customCategories[type];

    // Prevent duplicates
    if (!catArray.includes(trimmed)) {
      catArray.push(trimmed);
      await user.save();
    }

    res.json(user.customCategories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add category' });
  }
});

// 7. REMOVE CUSTOM CATEGORY
router.delete('/categories', protect, async (req, res) => {
  try {
    const { type, name } = req.query;

    if (!type || !name) {
      return res.status(400).json({ message: 'Type and name are required' });
    }

    if (!['expense', 'income', 'investmentTypes', 'bankAccounts'].includes(type)) {
      return res.status(400).json({ message: 'Invalid category type' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const catArray = user.customCategories[type];
    const index = catArray.indexOf(name);
    if (index !== -1) {
      catArray.splice(index, 1);
      await user.save();
    }

    res.json(user.customCategories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove category' });
  }
});

module.exports = router;
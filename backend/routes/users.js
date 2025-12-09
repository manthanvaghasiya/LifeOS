const express = require('express');
const router = express.Router();
const User = require('../models/User');
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

// 3. DELETE ACCOUNT
router.delete('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Fixed: findById(req.user.id)
    // Actually, use req.user.id directly
    await User.findByIdAndDelete(req.user.id);
    // Optional: Delete all their data (Habits, Goals, etc.) here too
    res.json({ message: 'User removed' });
  } catch (err) { res.status(500).json({ message: 'Delete failed' }); }
});

module.exports = router;
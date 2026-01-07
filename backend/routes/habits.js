const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit');
const { protect } = require('../middleware/authMiddleware');

// ✨ HELPER: Calculate Streak Logic
const calculateStreak = (completedDates) => {
  if (!completedDates || completedDates.length === 0) return 0;

  // 1. Sort dates descending (Newest first)
  const sorted = [...new Set(completedDates)].sort((a, b) => new Date(b) - new Date(a));
  
  // 2. Get Today & Yesterday Strings (Local Time)
  // We use a simple ISO split to ensure consistency with the frontend "YYYY-MM-DD" format
  const getISODate = (d) => d.toISOString().split('T')[0];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = getISODate(today);
  const yestStr = getISODate(yesterday);

  // 3. Check if the streak is alive (Must have done it Today OR Yesterday)
  // If the last completion was before yesterday, streak is broken.
  if (sorted[0] !== todayStr && sorted[0] !== yestStr) return 0;

  // 4. Count Consecutive Days
  let streak = 0;
  // Start checking from the most recent completion (either today or yesterday)
  let currentCheckDate = new Date(sorted[0]); 

  for (let i = 0; i < sorted.length; i++) {
    const dateToCheck = getISODate(currentCheckDate);
    
    if (sorted[i] === dateToCheck) {
      streak++;
      // Move check to previous day
      currentCheckDate.setDate(currentCheckDate.getDate() - 1);
    } else {
      // Gap detected, stop counting
      break;
    }
  }
  return streak;
};

// 1. GET ALL (Now includes 'streak')
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // ✨ Transform results to include calculated streak
    const habitsWithStreak = habits.map(h => ({
      ...h._doc,
      streak: calculateStreak(h.completedDates)
    }));

    res.json(habitsWithStreak);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ... existing ADD NEW code ...
router.post('/', protect, async (req, res) => {
  try {
    const habit = await Habit.create({
      user: req.user.id,
      title: req.body.title,
      target: req.body.target || 21,
      completedDates: []
    });
    // New habit has 0 streak
    res.status(200).json({ ...habit._doc, streak: 0 });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ... existing EDIT code ...
router.put('/:id', protect, async (req, res) => {
  try {
    // ... existing validation ...
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ msg: 'Not found' });
    if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id, 
      { title: req.body.title, target: req.body.target },
      { new: true }
    );
    
    // Return with streak
    res.json({ ...updatedHabit._doc, streak: calculateStreak(updatedHabit.completedDates) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. TOGGLE DATE (Recalculate Streak immediately)
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ msg: 'Not found' });
    if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    const date = req.body.date;
    if (habit.completedDates.includes(date)) {
      habit.completedDates = habit.completedDates.filter(d => d !== date);
    } else {
      habit.completedDates.push(date);
    }
    await habit.save();
    
    // ✨ Return the updated streak so the UI updates instantly
    res.json({ ...habit._doc, streak: calculateStreak(habit.completedDates) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ... existing DELETE code ...
router.delete('/:id', protect, async (req, res) => {
    // ... existing delete logic ...
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Not found' });
        if (habit.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    
        await habit.deleteOne();
        res.json({ msg: 'Removed' });
      } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
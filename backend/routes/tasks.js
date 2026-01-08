const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// 1. GET ALL TASKS (Sorted: Pending > Urgent > High Priority)
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .populate('linkedGoal', 'title')
      // Sort Order:
      // 1. Incomplete first (isCompleted: 1)
      // 2. Urgent first (isUrgent: -1)
      // 3. Priority (Alphabetical: High, Low, Medium - Frontend usually handles precise 'High' > 'Medium' sort)
      .sort({ isCompleted: 1, isUrgent: -1, priority: 1, dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. ADD NEW TASK (With Urgency)
router.post('/', protect, async (req, res) => {
  try {
    // ✨ Accept isUrgent from body
    const { title, priority, dueDate, linkedGoal, isUrgent } = req.body;

    const task = await Task.create({
      user: req.user.id,
      title,
      priority: priority || 'Medium',
      isUrgent: isUrgent || false, // ✨ Save it
      dueDate: dueDate || Date.now(),
      linkedGoal: linkedGoal || null
    });

    const populatedTask = await Task.findById(task._id).populate('linkedGoal', 'title');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task' });
  }
});

// 3. UPDATE TASK DETAILS (New Route for Editing)
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    // Update fields if they exist in the request
    const { title, priority, isUrgent, dueDate, linkedGoal } = req.body;
    
    if (title) task.title = title;
    if (priority) task.priority = priority;
    if (isUrgent !== undefined) task.isUrgent = isUrgent;
    if (dueDate) task.dueDate = dueDate;
    if (linkedGoal !== undefined) task.linkedGoal = linkedGoal;

    await task.save();
    
    // Repopulate goal info before returning
    const updatedTask = await Task.findById(task._id).populate('linkedGoal', 'title');
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. TOGGLE COMPLETE & AWARD XP
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task.isCompleted = !task.isCompleted;
    await task.save();

    // XP Logic
    if (task.isCompleted) {
        const user = await User.findById(req.user.id);
        if (user) {
            // Bonus XP if Urgent!
            const xpAmount = task.isUrgent ? 20 : 10;
            user.currentXP += xpAmount;

            if (user.currentXP >= user.requiredXP) {
                user.level += 1;
                user.currentXP -= user.requiredXP;
                user.requiredXP = user.level * 100;
            }
            await user.save();
        }
    }

    const updatedTask = await Task.findById(task._id).populate('linkedGoal', 'title');
    res.json(updatedTask);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 5. DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await task.deleteOne();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
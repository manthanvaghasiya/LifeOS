const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// 1. GET ALL TASKS (With Goal Name)
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .populate('linkedGoal', 'title') // <--- Magic: Get Goal Title automatically
      .sort({ isCompleted: 1, priority: 1, dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. ADD NEW TASK (With Link)
router.post('/', protect, async (req, res) => {
  try {
    const { title, priority, dueDate, linkedGoal } = req.body; // <--- Accept linkedGoal

    const task = await Task.create({
      user: req.user.id,
      title,
      priority: priority || 'Medium',
      dueDate: dueDate || Date.now(),
      linkedGoal: linkedGoal || null // <--- Save it
    });

    // Return the task with the populated goal info immediately
    const populatedTask = await Task.findById(task._id).populate('linkedGoal', 'title');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(400).json({ message: 'Error creating task' });
  }
});

// ... (Toggle and Delete routes remain the same)
// 3. TOGGLE COMPLETE
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. DELETE
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
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/authMiddleware');

// GET ALL TASKS
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ isCompleted: 1, priority: 1, dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD TASK
router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({
      user: req.user.id,
      title: req.body.title,
      priority: req.body.priority || 'Medium',
      dueDate: req.body.dueDate
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// TOGGLE COMPLETE
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE TASK
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await task.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
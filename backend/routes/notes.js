const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { protect } = require('../middleware/authMiddleware');

// 1. GET ALL NOTES
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ isPinned: -1, createdAt: -1 });
    res.json(notes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 2. ADD NOTE
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, color, isPinned } = req.body;
    const note = await Note.create({
      user: req.user.id,
      title,
      content,
      color: color || 'bg-white',
      isPinned: isPinned || false
    });
    res.status(201).json(note);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// 3. UPDATE NOTE
router.put('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// 4. DELETE NOTE
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ msg: 'Note not found' });
    if (note.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await note.deleteOne();
    res.json({ msg: 'Note removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
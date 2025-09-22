//notecontroller.js
const Note = require('../models/Note');
const { validationResult } = require('express-validator');

// Create a new note
exports.createNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, tags } = req.body;
  try {
    const note = new Note({
      user: req.user.id,
      title,
      content,
      tags: tags || []
    });
    await note.save();
    return res.status(201).json(note);
  } catch (err) {
    console.error('createNote error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get all notes (with optional tag(s) filtering)
exports.getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    let filter = { user: userId };

    if (req.query.tag) {
      // single tag
      filter.tags = req.query.tag;
    } else if (req.query.tags) {
      // multiple tags separated by comma
      const tagsArray = req.query.tags.split(',').map(t => t.trim());
      filter.tags = { $all: tagsArray };
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 });
    return res.status(200).json(notes);
  } catch (err) {
    console.error('getAllNotes error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get single note by id
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    return res.status(200).json(note);
  } catch (err) {
    console.error('getNoteById error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid note id' });
    }
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, tags } = req.body;

  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;

    await note.save();
    return res.status(200).json(note);
  } catch (err) {
    console.error('updateNote error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid note id' });
    }
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    return res.status(200).json({ msg: 'Note deleted' });
  } catch (err) {
    console.error('deleteNote error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Invalid note id' });
    }
    return res.status(500).json({ msg: 'Server error' });
  }
};

//noteRoutes.js
const express = require('express');
const { body, query } = require('express-validator');
const{ createNote, getAllNotes, getNoteById, updateNote, deleteNote } = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// Create
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('tags.*').optional().isString().withMessage('Each tag must be a string')
  ],
  createNote
);

// Read all / with tag filtering
router.get(
  '/',
  [
    query('tag').optional().isString().withMessage('tag must be string'),
    query('tags').optional().isString().withMessage('tags must be comma-separated string')
  ],
  getAllNotes
);

// Read by id
router.get('/:id', getNoteById);

// Update
router.put(
  '/:id',
  [
    body('title').optional().isString(),
    body('content').optional().isString(),
    body('tags').optional().isArray(),
    body('tags.*').optional().isString()
  ],
  updateNote
);

// Delete
router.delete('/:id', deleteNote);

module.exports = router;
const express = require('express');
const noteController = require('../notes-api/controllers/noteController');
const authMiddleware = require('../notes-api/middleware/authMiddleware');

const router = express.Router();

// Protect routes
router.use(authMiddleware);

// Example note routes
router.post('/', noteController.createNote);
router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;

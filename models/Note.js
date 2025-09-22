
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, { timestamps: true });

// Create index on tags for faster filtering
noteSchema.index({ tags: 1 });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
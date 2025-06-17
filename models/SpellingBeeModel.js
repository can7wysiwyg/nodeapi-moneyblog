const mongoose = require('mongoose');

const SpellingBeeSchema = new mongoose.Schema({
  letters: {
    type: [String],
    validate: [arr => arr.length === 7, 'Exactly 7 letters are required'],
    required: true
  },
  centerLetter: {
    type: String,
    required: true
  },
  validWords: [
    {
      word: { type: String, required: true },
      hint: { type: String, required: true }
    }
  ],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    required: true
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SpellingBee', SpellingBeeSchema);

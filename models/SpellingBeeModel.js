const mongoose = require('mongoose');

const SpellingBeeSchema = new mongoose.Schema({
  letters: {
    type: [String],
    required: true
  },
  centerLetter: {
    type: String,
    required: true
  },
  validWords: {
    type: [
      {
        word: { type: String, required: true },
        hint: { type: String, required: true }
      }
    ],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'difficult'],
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


const WeekSpellingBeeSchema = new mongoose.Schema({
  weekName: {
    type: String,
    required: true
  },
  spellings: {
    type: [SpellingBeeSchema],
    validate: [
      {
        validator: function (arr) {
          const difficulties = new Set(arr.map(s => s.difficulty));
          return ['easy', 'medium', 'difficult'].every(level => difficulties.has(level));
        },
        message: 'At least one spelling bee is required for each difficulty level: easy, medium, and difficult.'
      }
    ]
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('SpellingBee', SpellingBeeSchema)

module.exports = mongoose.model('WeekSpellingBee', WeekSpellingBeeSchema);
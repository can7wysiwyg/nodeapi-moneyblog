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

// const WeekSpellingBeeSchema = new mongoose.Schema({
//   weekName: {
//     type: String,
//     required: true
//   },
//   spellings: {
//     type: [SpellingBeeSchema],
//     validate: [
//       {
//         validator: function(arr) {
//           return arr.length === 21;
//         },
//         message: 'Exactly 21 spelling bees are required (7 easy, 7 medium, 7 hard)'
//       },
//       {
//         validator: function(arr) {
//           const easyCount = arr.filter(s => s.difficulty === 'easy').length;
//           const mediumCount = arr.filter(s => s.difficulty === 'medium').length;
//           const hardCount = arr.filter(s => s.difficulty === 'hard').length;
//           return easyCount === 7 && mediumCount === 7 && hardCount === 7;
//         },
//         message: 'Must have exactly 7 spelling bees for each difficulty level'
//       }
//     ]
//   }
// }, {
//   timestamps: true
// });



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
          return ['easy', 'medium', 'hard'].every(level => difficulties.has(level));
        },
        message: 'At least one spelling bee is required for each difficulty level: easy, medium, and hard.'
      }
    ]
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('WeekSpellingBee', WeekSpellingBeeSchema);
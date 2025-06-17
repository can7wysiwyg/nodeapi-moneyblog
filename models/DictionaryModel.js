const mongoose = require('mongoose');



const DictionarySchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Dictionary', DictionarySchema)
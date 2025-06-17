const AdminSpellingBee = require('express').Router();
const WeekSpellingBee = require('../models/SpellingBeeModel');
const Dictionary = require('../models/DictionaryModel');


function isValidWord(word, letters, centerLetter) {
  const letterSet = new Set(letters);
  if (!word.includes(centerLetter)) return false;
  return [...word].every(char => letterSet.has(char));
}

AdminSpellingBee.post('/admin/create-full-spellingbee-week', async (req, res) => {
  try {
    const { weekName, spellings } = req.body;

    if (!weekName || !Array.isArray(spellings) || spellings.length !== 21) {
      return res.status(400).json({
        msg: "You must provide exactly 21 spelling challenges: 7 for each difficulty (easy, medium, hard)."
      });
    }

    const easyCount = spellings.filter(s => s.difficulty === 'easy').length;
    const mediumCount = spellings.filter(s => s.difficulty === 'medium').length;
    const hardCount = spellings.filter(s => s.difficulty === 'hard').length;

    if (easyCount !== 7 || mediumCount !== 7 || hardCount !== 7) {
      return res.status(400).json({
        msg: "Each difficulty level (easy, medium, hard) must have exactly 7 spelling challenges.",
        counts: { easy: easyCount, medium: mediumCount, hard: hardCount }
      });
    }

    const dictionaryData = await Dictionary.find();
    // console.log(dictionaryData)
    
    const wordList = dictionaryData?.map(w => w.word.toLowerCase());


    const formattedSpellings = [];

    for (const spelling of spellings) {
      const { letters, centerLetter, difficulty, createdBy = "admin" } = spelling;

      const validWords = wordList
        .filter(word => isValidWord(word, letters, centerLetter))
        .map(word => ({
          word,
          hint: "No hint yet"
        }));

     
      formattedSpellings.push({
        letters,
        centerLetter,
        difficulty,
        validWords,
        createdBy
      });
    }

    const newWeek = new WeekSpellingBee({
      weekName,
      spellings: formattedSpellings
    });

    await newWeek.save();

    res.json({ msg: "Spelling bee week created successfully", week: newWeek });

  } catch (error) {
    console.error("Error creating full week:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});


module.exports = AdminSpellingBee;

const AdminSpellingBee = require('express').Router()
const SpellingBee = require('../models/SpellingBeeModel')

function isValidWord(word, letters, centerLetter) {
  const letterSet = new Set(letters);
  if (!word.includes(centerLetter)) return false;
  return [...word].every(char => letterSet.has(char));
}

AdminSpellingBee.post('/admin/create-spellingbee', async (req, res) => {
  try {
    const { letters, centerLetter, difficulty, createdBy = "admin" } = req.body;

    if (!letters || letters.length !== 7 || !centerLetter || !difficulty) {
      return res.status(400).json({ msg: "Invalid input. Please provide 7 letters, a centerLetter, and a difficulty." });
    }

    const wordsByDifficulty = dictionary.filter(w => w.difficulty === difficulty);

    const validWords = wordsByDifficulty
      .filter(wordObj => isValidWord(wordObj.word.toLowerCase(), letters, centerLetter))
      .map(wordObj => ({
        word: wordObj.word.toLowerCase(),
        hint: wordObj.hint
      }));

    const puzzle = new SpellingBee({
      letters,
      centerLetter,
      difficulty,
      validWords,
      createdBy
    });

    await puzzle.save();

    res.json({ msg: "Spelling Bee created successfully", puzzle });

  } catch (error) {
    console.log("Error creating spelling bee:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

module.exports = AdminSpellingBee
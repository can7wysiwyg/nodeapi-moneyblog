const AdminSpellingBee = require('express').Router();
const WeekSpellingBee = require('../models/SpellingBeeModel');
const SpellingBee = require('../models/SpellingBeeModel')
const commonWords = require('./misc/commonWords')
const verify = require('../middleware/verify')



// 
AdminSpellingBee.get('/admin/spelling-game-enums', verify, async(req, res) => {

try {

  const gameEnums = await SpellingBee.schema.path('difficulty').options.enums

  res.json({gameEnums})


} catch(error) {
  res.json({msg: "Server Error", error: error.message})
}

})

// 

// Helper function to generate possible words from letters
function generatePossibleWords(letters, centerLetter, minLength = 4, maxLength = 8) {
  const possibleWords = new Set();
  const letterSet = new Set(letters);
  
 
  // Filter words that can be made with the given letters and contain center letter
  for (const word of commonWords) {
    if (word.length >= minLength && word.length <= maxLength) {
      if (isValidWordWithLetters(word, letters, centerLetter)) {
        possibleWords.add(word);
      }
    }
  }

  return Array.from(possibleWords);
}

function isValidWordWithLetters(word, letters, centerLetter) {
  // Must contain center letter
  if (!word.includes(centerLetter)) return false;
  
  // Create a frequency map of available letters
  const availableLetters = {};
  letters.forEach(letter => {
    availableLetters[letter] = (availableLetters[letter] || 0) + 1;
  });
  
  // Create a frequency map of letters needed in the word
  const neededLetters = {};
  [...word].forEach(letter => {
    neededLetters[letter] = (neededLetters[letter] || 0) + 1;
  });
  
  // Check if we have enough of each letter
  for (const [letter, count] of Object.entries(neededLetters)) {
    if (!availableLetters[letter] || availableLetters[letter] < count) {
      return false;
    }
  }
  
  return true;
}

async function validateWordWithAPI(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    if (!response.ok) {
      return null; // Word not found
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const entry = data[0];
      
      // Extract a simple definition for hint
      let hint = "No hint available";
      if (entry.meanings && entry.meanings.length > 0) {
        const firstMeaning = entry.meanings[0];
        if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
          hint = firstMeaning.definitions[0].definition;
          // Truncate long definitions
          if (hint.length > 100) {
            hint = hint.substring(0, 100) + "...";
          }
        }
      }
      
      return {
        word,
        hint,
        partOfSpeech: entry.meanings[0]?.partOfSpeech || "unknown",
        phonetic: entry.phonetic || "",
        valid: true
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error validating word "${word}":`, error.message);
    return null;
  }
}

AdminSpellingBee.post('/admin/create-full-spellingbee-week', async (req, res) => {
  try {
    const { weekName, spellings } = req.body;

    

    

    if (!weekName || !Array.isArray(spellings)) {
      return res.status(400).json({
        msg: "Cannot be empty"
      });
    }
 

    const easyCount = spellings.filter(s => s.difficulty === 'easy').length;

     
    const mediumCount = spellings.filter(s => s.difficulty === 'medium').length;
    const hardCount = spellings.filter(s => s.difficulty === 'difficult').length;

    
if (easyCount === 0) {
  return res.status(400).json({
    msg: "You must provide **at least one** spelling challenge for each difficulty level: easy",
    counts: { easy: easyCount, medium: mediumCount, hard: hardCount }
  });
}



if (easyCount === 0 || mediumCount === 0 || hardCount === 0) {
  return res.status(400).json({
    msg: "You must provide **at least one** spelling challenge for each difficulty level: hard.",
    counts: {  hard: hardCount }
  });
}


if (mediumCount === 0) {
  return res.status(400).json({
    msg: "You must provide **at least one** spelling challenge for each difficulty level:  medium",
    counts: {medium: mediumCount }
  });
}



    const formattedSpellings = [];
    let totalWordsFound = 0;
    let totalAPIRequests = 0;

    
    for (let i = 0; i < spellings.length; i++) {
      const spelling = spellings[i];
      const { letters, centerLetter, difficulty, createdBy = "admin" } = spelling;

     
      // Validate that centerLetter is in letters array
      if (!letters.includes(centerLetter)) {
        return res.status(400).json({
          msg: `Center letter "${centerLetter}" must be included in the letters array`,
          spelling: { letters, centerLetter, difficulty }
        });
      }

      // Generate possible words from the letters
      const possibleWords = generatePossibleWords(letters, centerLetter);
      
  
      const validWords = [];
      const batchSize = 5;
      
      for (let j = 0; j < possibleWords.length && validWords.length < 15; j += batchSize) {
        const batch = possibleWords.slice(j, j + batchSize);
        const promises = batch.map(word => validateWordWithAPI(word));
        
        const results = await Promise.all(promises);
        totalAPIRequests += batch.length;
        
        for (const result of results) {
          if (result && result.valid) {
            validWords.push({
              word: result.word,
              hint: result.hint
            });
            totalWordsFound++;
          }
        }
        
        // Small delay between batches to be respectful to the API
        if (j + batchSize < possibleWords.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

     
      if (validWords.length === 0) {
        console.warn(`Warning: No valid words found for ${difficulty} puzzle with letters [${letters.join(', ')}] and center letter "${centerLetter}"`);
      }

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

    
    res.json({ 
      msg: "Spelling bee week created successfully with API validation", 
      week: newWeek,
      stats: {
        totalPuzzles: formattedSpellings.length,
        totalWordsFound,
        totalAPIRequests,
        averageWordsPerPuzzle: Math.round(totalWordsFound / formattedSpellings.length),
        puzzleBreakdown: formattedSpellings.map(s => ({
          difficulty: s.difficulty,
          wordCount: s.validWords.length,
          letters: s.letters.join(''),
          centerLetter: s.centerLetter
        }))
      }
    });

  } catch (error) {
    console.error("Error creating full week:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});



module.exports = AdminSpellingBee;

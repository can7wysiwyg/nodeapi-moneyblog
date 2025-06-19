const PublicSpellingBee = require('express').Router()
const WeekSpellingBee = require('../models/SpellingBeeModel')

PublicSpellingBee.get('/public/all-spelling-bee-games', async(req, res) => {

    try {

        const games = await WeekSpellingBee.find().sort({_id: -1})

        if(games.length === 0) {
            return res.json({msg: "No games found"})
        }


        res.json({games})
        
    } catch (error) {
        console.log(error.message)
        res.json({msg: "Server Error", error: error.message})
    }


})


function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


PublicSpellingBee.get('/public/spelling-bee-game/:id', async(req, res) => {

    try {
        const {id} = req.params

        if(!id) {
            return res.json({msg: "Your Fault"})
        }

        const latestWeek = await WeekSpellingBee.findById(id)

        if(!latestWeek) {
            return res.json({msg: "Game not found!"})
        }

    const easySpells = latestWeek.spellings.filter(sp => sp.difficulty === 'easy');
    const mediumSpells = latestWeek.spellings.filter(sp => sp.difficulty === 'medium');
    const hardSpells = latestWeek.spellings.filter(sp => sp.difficulty === 'hard');


    
    
    const gameSet = {
      easy: getRandomFromArray(easySpells),
      medium: getRandomFromArray(mediumSpells),
      hard: getRandomFromArray(hardSpells)
    };

        res.json({
      week: latestWeek.weekName,
      game: {
        easy: {
          letters: gameSet.easy.letters,
          centerLetter: gameSet.easy.centerLetter,
          difficulty: gameSet.easy.difficulty
        },
        medium: {
          letters: gameSet.medium.letters,
          centerLetter: gameSet.medium.centerLetter,
          difficulty: gameSet.medium.difficulty
        },
        hard: {
          letters: gameSet.hard.letters,
          centerLetter: gameSet.hard.centerLetter,
          difficulty: gameSet.hard.difficulty
        }
      }
    });        
    } catch (error) {
        console.log(error.message)
        res.json({msg: "Server Error", error: error.message})
    }


})



PublicSpellingBee.get('/public/play-spelling-bee-game', async(req, res) => {
    try {
        const { word, middleWord } = req.query;
        console.log(middleWord)

        // Validate required parameters
        if (!middleWord) {
            return res.json({
                success: false,
                msg: "Missing middleWord parameter"
            });
        }

        if (!word) {
            return res.json({
                success: false,
                msg: "Missing word parameter"
            });
        }

        // Convert to lowercase for consistent checking
        const wordLower = word.toLowerCase().trim();
        const middleWordLower = middleWord.toLowerCase().trim();

        // Basic validation rules for spelling bee
        if (wordLower.length < 4) {
            return res.json({
                success: false,
                msg: "Word must be at least 4 letters long",
                word: wordLower
            });
        }

        // Check if word contains the middle letter
        if (!wordLower.includes(middleWordLower)) {
            return res.json({
                success: false,
                msg: `Word must contain the center letter '${middleWordLower}'`,
                word: wordLower
            });
        }

        // Fetch word definition from dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordLower}`);
        
        let wordExists = false;
        let wordData = null;

        if (response.ok) {
            const data = await response.json();
            
            // Check if we got valid definition data
            if (Array.isArray(data) && data.length > 0) {
                wordExists = true;
                wordData = data;
            }
        } else {
            // Handle the case where word doesn't exist
            const errorData = await response.json();
            if (errorData.title === "No Definitions Found") {
                wordExists = false;
            }
        }

        if (!wordExists) {
            return res.json({
                success: false,
                msg: "Word not found in dictionary",
                word: wordLower
            });
        }

        // Calculate points (basic scoring system)
        let points = 0;
        if (wordLower.length === 4) {
            points = 1;
        } else {
            points = wordLower.length;
        }

        // Check if it's a pangram (contains all available letters)
        // You'll need to pass available letters as another parameter for full implementation
        const uniqueLetters = new Set(wordLower);
        const isPangram = false; // Set to true if word uses all available letters

        if (isPangram) {
            points += 7; // Bonus points for pangram
        }

        // Success response
        return res.json({
            success: true,
            msg: "Valid word!",
            word: wordLower,
            points: points,
            isPangram: isPangram,
            definitions: wordData.map(entry => ({
                partOfSpeech: entry.meanings?.[0]?.partOfSpeech || 'unknown',
                definition: entry.meanings?.[0]?.definitions?.[0]?.definition || 'No definition available'
            }))
        });

    } catch (error) {
        console.log('Spelling Bee API Error:', error.message);
        return res.json({
            success: false,
            msg: "Server Error",
            error: error.message
        });
    }
});

// Helper function to check if word is a pangram
function isPangramWord(word, availableLetters) {
    const wordLetters = new Set(word.toLowerCase());
    const requiredLetters = new Set(availableLetters.toLowerCase());
    
    // Check if word contains all available letters
    for (let letter of requiredLetters) {
        if (!wordLetters.has(letter)) {
            return false;
        }
    }
    return true;
}



// PublicSpellingBee.get('/public/play-spelling-bee-game-enhanced', async(req, res) => {
//     try {
//         const { word, middleWord, availableLetters } = req.query;

//         // Validate required parameters
//         if (!middleWord || !word || !availableLetters) {
//             return res.json({
//                 success: false,
//                 msg: "Missing required parameters: word, middleWord, and availableLetters"
//             });
//         }

//         const wordLower = word.toLowerCase().trim();
//         const middleWordLower = middleWord.toLowerCase().trim();
//         const availableLettersLower = availableLetters.toLowerCase();

//         // Validate word length
//         if (wordLower.length < 4) {
//             return res.json({
//                 success: false,
//                 msg: "Word must be at least 4 letters long",
//                 word: wordLower
//             });
//         }

//         // Check if word contains center letter
//         if (!wordLower.includes(middleWordLower)) {
//             return res.json({
//                 success: false,
//                 msg: `Word must contain the center letter '${middleWordLower}'`,
//                 word: wordLower
//             });
//         }

//         // Check if word only uses available letters
//         for (let letter of wordLower) {
//             if (!availableLettersLower.includes(letter)) {
//                 return res.json({
//                     success: false,
//                     msg: `Word contains invalid letter '${letter}'. Only use: ${availableLetters}`,
//                     word: wordLower
//                 });
//             }
//         }

//         // Check dictionary
//         const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordLower}`);
        
//         if (!response.ok) {
//             return res.json({
//                 success: false,
//                 msg: "Word not found in dictionary",
//                 word: wordLower
//             });
//         }

//         const data = await response.json();
        
//         if (!Array.isArray(data) || data.length === 0) {
//             return res.json({
//                 success: false,
//                 msg: "Word not found in dictionary",
//                 word: wordLower
//             });
//         }

//         // Calculate points
//         let points = wordLower.length === 4 ? 1 : wordLower.length;
        
//         // Check for pangram
//         const isPangram = isPangramWord(wordLower, availableLettersLower);
//         if (isPangram) {
//             points += 7;
//         }

//         return res.json({
//             success: true,
//             msg: isPangram ? "Pangram! Excellent!" : "Valid word!",
//             word: wordLower,
//             points: points,
//             isPangram: isPangram,
//             wordLength: wordLower.length,
//             definitions: data.slice(0, 3).map(entry => ({
//                 partOfSpeech: entry.meanings?.[0]?.partOfSpeech || 'unknown',
//                 definition: entry.meanings?.[0]?.definitions?.[0]?.definition || 'No definition available'
//             }))
//         });

//     } catch (error) {
//         console.log('Spelling Bee Enhanced API Error:', error.message);
//         return res.json({
//             success: false,
//             msg: "Server Error",
//             error: error.message
//         });
//     }
// });


module.exports = PublicSpellingBee
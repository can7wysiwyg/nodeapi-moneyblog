const AdminDictionary = require('express').Router();
const Dictionary = require('../models/DictionaryModel')

AdminDictionary.post('/admin/create-dictionary', async (req, res) => {
  try {
    const { words } = req.body;

    if (!words || !Array.isArray(words) || words.length === 0) {
      return res.status(400).json({ msg: "No words provided" });
    }

    
    const formattedWords = words.map(w => ({ word: w }));

        const newDictionary = new Dictionary({ words: formattedWords });
    await newDictionary.save();

    res.status(201).json({ msg: "Dictionary created successfully", dictionary: newDictionary });

  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});


AdminDictionary.put('/admin/update-word', async (req, res) => {
  try {
    const { wordId, newWord } = req.body;

    if (!wordId || !newWord) {
      return res.status(400).json({ msg: "wordId and newWord are required" });
    }

    const updated = await Dictionary.findOneAndUpdate(
      { "words._id": wordId },
      {
        $set: { "words.$.word": newWord }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Word not found" });
    }

    res.json({ msg: "Word updated successfully", dictionary: updated });

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});


AdminDictionary.delete('/admin/delete-word', async (req, res) => {
  try {
    const { wordId } = req.body;

    if (!wordId) {
      return res.status(400).json({ msg: "wordId is required" });
    }

    const updated = await Dictionary.findOneAndUpdate(
      {},
      { $pull: { words: { _id: wordId } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Word not found or already deleted" });
    }

    res.json({ msg: "Word deleted successfully", dictionary: updated });

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});




module.exports = AdminDictionary
const mongoose = require('mongoose');



const DictionarySchema = new mongoose.Schema({

    words: [
        {
            word: {type: String},
            
        }
    ]

}, {
    timestamps: true
})


module.exports = mongoose.model('Dictionary', DictionarySchema)
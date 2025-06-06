const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({

    category: {
        type: String,
        required: true,
        unique: true
    },

    subCategory: [{
        name: { type: String},
    }]


}, {
    timestamps: true
})

module.exports = mongoose.model('Category', CategorySchema)
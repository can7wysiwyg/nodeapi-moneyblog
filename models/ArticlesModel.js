const mongoose = require('mongoose')

const ArticleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    catId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subCatId: {
        type: String,
        required: true
    },
    articleKeywords: {
        type: Array,
        default: []
    },
    articleClicks: {
        type: Number,
        default: 0
    },
    seasonalArticle: {
        type: String,
        enum: ['regular', 'campaign period'],
        default: 'regular'

    },
    mainArticle: {
        type: Boolean,
        default: false

    }


}, {
    timestamps: true
})


module.exports = mongoose.model('Article', ArticleSchema)
const PublicArticles = require('express').Router()
const Article = require('../models/ArticlesModel')
const mongoose = require('mongoose');
const Category = require('../models/CategoryModel')


PublicArticles.get('/public/article-single/:id', async(req, res) => {
    try {
        const {id} = req.params

        if(!id) {
            return res.json({msg: "Id is missing"})
        }

        const article = await Article.findById(id).populate('catId', 'category')

        if(!article) {
            return res.json({msg: "Article Not Found"})
        }

        
        await Article.findByIdAndUpdate(id, { $inc: { articleClicks: 1 } })

        
        const relatedPipeline = [
            { 
                $match: { 
                    _id: { $ne: new mongoose.Types.ObjectId(id) }, 
                    $or: [
                        
                        { 
                            catId: article.catId._id, 
                            subCatId: article.subCatId,
                            articleKeywords: { $in: article.articleKeywords }
                        },
                        
                        { 
                            catId: article.catId._id,
                            articleKeywords: { $in: article.articleKeywords }
                        }
                    ]
                }
            },
            { 
                $addFields: { 
                    keywordMatches: { $size: { $setIntersection: ["$articleKeywords", article.articleKeywords] } },
                    score: { 
                        $add: [
                            "$articleClicks", 
                            { $multiply: ["$keywordMatches", 8] }, 
                        
                            { $cond: [{ $eq: ["$subCatId", article.subCatId] }, 10, 0] }
                        ]
                    }
                }
            },
            { $sort: { score: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "categories",
                    localField: "catId",
                    foreignField: "_id",
                    as: "catId"
                }
            },
            { $unwind: "$catId" }
        ];

        const relatedArticles = await Article.aggregate(relatedPipeline);

        res.json({
            success: true,
            article: article,
            relatedArticles: relatedArticles,
            relatedCount: relatedArticles.length
        })

    } catch (error) {
        console.error(`Error fetching article: ${error.message}`);
        res.status(500).json({ msg: "Server Error" });
    }
})


PublicArticles.get('/public/show-articles', async(req, res) => {

    try {
        

        const articles = await Article.find().sort({_id: -1})

        if(articles.length === 0) {
                
            return res.json({msg: "There are no articles at the moment!"})

        }

        res.json({articles})

    } catch (error) {
        console.error(`Error fetching articles: ${error.message}`);
        res.status(500).json({ msg: "Server Error" });
        
    }


})


PublicArticles.get('/public/articles-by-clicked', async(req, res) => {
    try {
        const {catId, subCatId, keyword} = req.query

        const keywords = Array.isArray(keyword) ? keyword : [keyword];

        if(!catId) {
            return res.json({msg: "Category cannot be empty"})
        }

        if(keyword.length === 0) {
            return res.json({msg: "Suggestion only works with keywords"})
        }

        let pipeline;

        if(subCatId) {
        
            pipeline = [
                { 
                    $match: { 
                        catId: mongoose.Types.ObjectId(catId), 
                        subCatId: subCatId,
                        articleKeywords: { $in: keywords }
                    }
                },
                { 
                    $addFields: { 
                        keywordMatches: { $size: { $setIntersection: ["$articleKeywords", keywords] } },
                        score: { 
                            $add: [
                                "$articleClicks", 
                                { $multiply: ["$keywordMatches", 5] }
                            ]
                        }
                    }
                },
                { $sort: { score: -1 } },
                {
                    $lookup: {
                        from: "categories",
                        localField: "catId",
                        foreignField: "_id",
                        as: "catId"
                    }
                },
                { $unwind: "$catId" }
            ];
        } else {
            
            pipeline = [
                { 
                    $match: { 
                        catId: mongoose.Types.ObjectId(catId),
                        articleKeywords: { $in: keywords }
                    }
                },
                { 
                    $addFields: { 
                        keywordMatches: { $size: { $setIntersection: ["$articleKeywords", keywords] } },
                        score: { 
                            $add: [
                                "$articleClicks", 
                                { $multiply: ["$keywordMatches", 5] } 
                            ]
                        }
                    }
                },
                { $sort: { score: -1 } },
                {
                    $lookup: {
                        from: "categories",
                        localField: "catId",
                        foreignField: "_id",
                        as: "catId"
                    }
                },
                { $unwind: "$catId" }
            ];
        }

        const allArticles = await Article.aggregate(pipeline);

        
        res.json({
            count: allArticles.length,
            articles: allArticles});
        
    } catch (error) {
        console.error(`Error fetching articles by clicked: ${error.message}`);
        res.status(500).json({ msg: "Server Error" });
    }
})

module.exports = PublicArticles
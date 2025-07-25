const PublicArticles = require('express').Router()
const Article = require('../models/ArticlesModel')
const mongoose = require('mongoose');
const Category = require('../models/CategoryModel')


PublicArticles.get('/public/special-single/:id', async(req, res) => {

    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, msg: "Id is missing" });
        }
        const article = await Article.findById(id).populate('catId', 'category');
        if (!article) {
            return res.status(404).json({ success: false, msg: "Article Not Found" });
        }

        res.json({article})
    
        
    } catch (error) {
        console.log('sErVER ErRoR ', error.message)

        res.json({msg: 'sErVER ErRoR ', error:  error.message})
    }

})



PublicArticles.get('/public/article-single/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, msg: "Id is missing" });
        }
        const article = await Article.findById(id).populate('catId', 'category');
        if (!article) {
            return res.status(404).json({ success: false, msg: "Article Not Found" });
        }
    
        await Article.findByIdAndUpdate(id, { $inc: { articleClicks: 1 } });
        
    
        const shuffleArray = (array) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };
        
    
        const relatedPipeline = [
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(id) },
                    articleKeywords: { $in: article.articleKeywords }
                }
            },
            {
                $addFields: {
                    keywordMatches: {
                        $size: {
                            $setIntersection: ["$articleKeywords", article.articleKeywords]
                        }
                    },
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
            { $limit: 12 }, 
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
        
        let relatedCandidates = await Article.aggregate(relatedPipeline);
        
    
        let relatedArticles = [];
        if (relatedCandidates.length > 0) {
        
            const topCandidates = relatedCandidates.slice(0, Math.min(8, relatedCandidates.length));
            const shuffledTop = shuffleArray(topCandidates);
            relatedArticles = shuffledTop.slice(0, 4);
        }
        
        
        const excludedIds = new Set([id]);
        relatedArticles.forEach(article => excludedIds.add(article._id.toString()));
        
        
        const baseCatMatch = {
            _id: { $nin: Array.from(excludedIds).map(id => new mongoose.Types.ObjectId(id)) },
            catId: article.catId._id
        };
        
        
        const [mostClickedCandidates, leastClickedCandidates, randomCandidates] = await Promise.all([
            Article.find(baseCatMatch)
                .sort({ articleClicks: -1 })
                .limit(8) 
                .select("title photo articleClicks catId createdAt")
                .populate("catId", "category"),
            Article.find(baseCatMatch)
                .sort({ articleClicks: 1 })
                .limit(8) 
                .select("title photo articleClicks catId createdAt")
                .populate("catId", "category"),
            Article.find(baseCatMatch)
                .limit(12) 
                .select("title photo articleClicks catId createdAt")
                .populate("catId", "category")
        ]);
        
        
        let categoryArticles = [];
        const usedCategoryIds = new Set();
        
        
        const strategies = shuffleArray([
            { source: mostClickedCandidates, name: 'popular', weight: 0.4 },
            { source: leastClickedCandidates, name: 'hidden-gems', weight: 0.3 },
            { source: shuffleArray(randomCandidates), name: 'random', weight: 0.3 }
        ]);
        
    
        const totalNeeded = 4;
        let articlesAdded = 0;
        
        for (const strategy of strategies) {
            const maxFromStrategy = Math.ceil(totalNeeded * strategy.weight);
            const shuffledSource = shuffleArray(strategy.source);
            
            for (const article of shuffledSource) {
                if (articlesAdded >= totalNeeded) break;
                
                if (!usedCategoryIds.has(article._id.toString())) {
                    categoryArticles.push({
                        ...article.toObject(),
                        _strategy: strategy.name 
                    });
                    usedCategoryIds.add(article._id.toString());
                    articlesAdded++;
                }
                
                if (articlesAdded >= maxFromStrategy) break;
            }
        }
        
    
        if (categoryArticles.length < 4) {
            const allRemaining = shuffleArray([
                ...mostClickedCandidates,
                ...leastClickedCandidates,
                ...randomCandidates
            ]);
            
            for (const article of allRemaining) {
                if (categoryArticles.length >= 4) break;
                
                if (!usedCategoryIds.has(article._id.toString())) {
                    categoryArticles.push({
                        ...article.toObject(),
                        _strategy: 'fallback'
                    });
                    usedCategoryIds.add(article._id.toString());
                }
            }
        }
        

        categoryArticles = shuffleArray(categoryArticles);
        
    
        categoryArticles = categoryArticles.map(article => {
            const { _strategy, ...cleanArticle } = article;
            return cleanArticle;
        });
        
        res.json({
            success: true,
            article,
            relatedArticles,
            categoryArticles
        });
    } catch (error) {
        console.error(`Error fetching article: ${error.message}`);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
});



// Fisher-Yates shuffle 
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}




PublicArticles.get('/public/show-articles', async(req, res) => {
    try {
        const articles = await Article.find().sort({_id: -1});
        
        if(articles.length === 0) {
            return res.json({msg: "There are no articles at the moment!"});
        }
        
        // Apply Fisher-Yates shuffle to articles
        const shuffledArticles = shuffleArray(articles);
        
        res.json({articles: shuffledArticles});
    } catch (error) {
        console.error(`Error fetching articles: ${error.message}`);
        res.status(500).json({ msg: "Server Error" });
    }
});



// PublicArticles.get('/public/articles-by-clicked', async(req, res) => {
//     try {
//         const {catId, subCatId, keyword} = req.query;
        
        
//         const keywords = Array.isArray(keyword) ? keyword : [keyword];
        
//         if(!catId) {
//             return res.json({msg: "Category cannot be empty"});
//         }
        
//         if(keyword?.length === 0) {
//             return res.json({msg: "Suggestion only works with keywords"});
//         }
        
//         let pipeline;
        
//         if(subCatId) {
//             pipeline = [
//                 {
//                     $match: {
//                         catId: new mongoose.Types.ObjectId(catId),
//                         subCatId: subCatId,
//                         articleKeywords: { $in: keywords }
//                     }
//                 },
//                 {
//                     $addFields: {
//                         keywordMatches: { $size: { $setIntersection: ["$articleKeywords", keywords] } },
//                         score: {
//                             $add: [
//                                 "$articleClicks",
//                                 { $multiply: ["$keywordMatches", 5] }
//                             ]
//                         }
//                     }
//                 },
//                 { $sort: { score: -1 } },
//                 {
//                     $lookup: {
//                         from: "categories",
//                         localField: "catId",
//                         foreignField: "_id",
//                         as: "catId"
//                     }
//                 },
//                 { $unwind: "$catId" }
//             ];
//         } else {
//             pipeline = [
//                 {
//                     $match: {
//                         catId: mongoose.Types.ObjectId(catId),
//                         articleKeywords: { $in: keywords }
//                     }
//                 },
//                 {
//                     $addFields: {
//                         keywordMatches: { $size: { $setIntersection: ["$articleKeywords", keywords] } },
//                         score: {
//                             $add: [
//                                 "$articleClicks",
//                                 { $multiply: ["$keywordMatches", 5] }
//                             ]
//                         }
//                     }
//                 },
//                 { $sort: { score: -1 } },
//                 {
//                     $lookup: {
//                         from: "categories",
//                         localField: "catId",
//                         foreignField: "_id",
//                         as: "catId"
//                     }
//                 },
//                 { $unwind: "$catId" }
//             ];
//         }
        
//         const allArticles = await Article.aggregate(pipeline);
        
//         // Apply Fisher-Yates shuffle to the results
//         const shuffledArticles = shuffleArray(allArticles);
        
//         res.json({
//             count: shuffledArticles.length,
//             articles: shuffledArticles
//         });
        
//     } catch (error) {
//         console.error(`Error fetching articles by clicked: ${error.message}`);
//         res.status(500).json({ msg: "Server Error" });
//     }
// });



// categorical articles



PublicArticles.get('/public/articles-by-category/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { shuffle = 'true' } = req.query; // Optional shuffle parameter
        
        if (!id) {
            return res.status(400).json({ msg: "Category ID is missing" });
        }

    
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        
        const articles = await Article.find({ catId: id });
        
        if (articles.length === 0) {
            return res.json({ 
                msg: "There are no articles in this category at the moment!",
                category: category.category,
                subcategories: []
            });
        }

        
        const subcategoryGroups = {};
        
        
        category.subCategory.forEach(subCat => {
            subcategoryGroups[subCat.name] = [];
        });

        
        
        articles.forEach(article => {
            const articleSubCatId = article.subCatId.toString(); 
            
        
            const matchingSubCat = category.subCategory.find(subCat => 
                subCat._id.toString() === articleSubCatId
            );
            
            if (matchingSubCat) {
                subcategoryGroups[matchingSubCat.name].push(article);
            } else {
                
                if (!subcategoryGroups['Unmatched']) {
                    subcategoryGroups['Unmatched'] = [];
                }
                subcategoryGroups['Unmatched'].push(article);
            }
        });

        
        if (shuffle === 'true') {
            Object.keys(subcategoryGroups).forEach(subCatName => {
                subcategoryGroups[subCatName] = shuffleArray(subcategoryGroups[subCatName]);
            });
        }

        
        const subcategories = Object.keys(subcategoryGroups).map(subCatName => ({
            name: subCatName,
            articles: subcategoryGroups[subCatName],
            totalArticles: subcategoryGroups[subCatName].length
        }));

        res.json({
            success: true,
            category: category.category,
            totalArticles: articles.length,
            subcategories: subcategories
        });

    } catch (error) {
        console.log(`Error fetching articles by category: ${error.message}`);
        res.status(500).json({ msg: "Server Error" });
    }
});



PublicArticles.get('/public/trending-news', async(req, res) => {


    try {

        const catIds = await Article.distinct('catId')

        const facetStage = {};
catIds.forEach(catId => {
  facetStage[catId.toString()] = [
    { $match: { catId: catId} },
    { $sort: { articleClicks: 1 } },
    { $limit: 3 },
    { $project: { title: 1, articleClicks: 1, catId: 1 } }
  ];
});


        const result = await Article.aggregate([
  { $match: { articleClicks: { $gte: 0 } } },
  { $facet: facetStage },
  {
    $project: {
      allArticles: {
        $reduce: {
          input: { $objectToArray: "$$ROOT" },
          initialValue: [],
          in: { $concatArrays: ["$$value", "$$this.v"] }
        }
      }
    }
  },
  { $unwind: "$allArticles" },
  { $replaceRoot: { newRoot: "$allArticles" } }
]);

const trendingArticles = shuffleArray(result);


        res.json({trendingArticles})

        
    } catch (error) {

        console.log(`there was a problem ${error.message}`)

        res.json({msg: "Server Error", error: error.message})
        
    }


})



PublicArticles.get('/public/latest-articles', async(req, res) => {
try {

    const latestArticles = await Article.find().sort({_id: -1}).limit(10).select('_id title')

    if(latestArticles.length === 0) {
        return res.json({msg: "There are no latest articles at the moment"})
    }

    res.json({latestArticles})
    
} catch (error) {
    console.log("Error fetching latest articles:", error.message)

    res.json({msg: "Server Error", error: error.message})
}


})

module.exports = PublicArticles
const AdminArticles = require('express').Router()
const Article = require('../models/ArticlesModel')
const verify = require('../middleware/verify')

const cloudinary = require('cloudinary').v2
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });



AdminArticles.post('/admin/create-article', verify, async(req, res) => {

    try {
         
        const {title, content, catId, subCatId} = req.body

        if(!title || !content || !catId || !subCatId) {
            return res.json({msg: "Field cannot be empty!"})
        }

        if(!req.files || !req.files.photo) {
            return res.json({msg: "Photo cannot be empty"})
        }
        
        const photoResult  = await cloudinary.uploader.upload(req.files.photo.tempFilePath)


        await Article.create({
            title,
            content,
            catId,
            subCatId,
            photo: photoResult.secure_url

        })

        fs.unlinkSync(req.files.photo.tempFilePath)

        res.json({messg: "Successfully created new article"})


        
    } catch (error) {
        console.error(`Error creating articles: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });
    }

})


AdminArticles.put('/admin/update-article/:id', async(req, res) => {

try {
    const {id} = req.params

    if(!id) {
        return res.json({msg: "Identification needs to be provided"})
    }


    const ifExists = await Article.findById(id)


    if(!ifExists) {
        return res.json({msg: "Article Does Not Exists"})
    }

       await Article.findByIdAndUpdate(id, req.body, {new: true})

       res.json({msg: "Article updated successfully!"})
    
} catch (error) {
    console.error(`Error updating article: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });
    
}

})


AdminArticles.delete('/admin/erase_article/:id', async(req, res) => {

    try {

        const {id} = req.params

    if(!id) {
        return res.json({msg: "Identification needs to be provided"})
    }


    const ifExists = await Article.findById(id)


    if(!ifExists) {
        return res.json({msg: "Article Does Not Exists"})
    }

       await Article.findByIdAndDelete(id)

       res.json({msg: "Article deleted successfully!"})
    
        
    } catch (error) {
        console.error(`Error deleting article: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });
    
        
    }
})

// 


AdminArticles.get('/admin/last-added-article', verify, async(req, res) => {

    try {

        const article = await Article.find().sort({_id: -1}).limit(1)

        res.json({article})
        
    } catch (error) {
         console.error(`Error getting article: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });
    
    }

})


module.exports = AdminArticles
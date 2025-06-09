const PublicCategories = require('express').Router()
const Category = require('../models/CategoryModel')

PublicCategories.get('/public/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort({ category: 1 });

        if (!categories || categories.length === 0) {
            return res.json({ msg: "No categories found" });
        }

        res.json(categories);
    } catch (error) {
        console.error(`Error fetching categories: ${error.message}`);
        res.status(500).json({ msg: "Server Error" });
    }
});


PublicCategories.get('/public/category/:id', async (req, res) => {
    try {

        const {id} = req.params

        if(!id) {
            return res.json({msg: "Category ID needs to be provided"})
        }

        const category = await Category.findById(id)

        if(!category) {
            return
             res.json({msg: "Category does not exist"})
        }


        res.json({category})

    } catch (error) {
        console.error(`Error fetching categories: ${error.message}`);
        res.status(500).json({ msg: "Server Error" });
    }
});



module.exports = PublicCategories
const AdminCategory = require('express').Router()
const Category = require('../models/CategoryModel')
const verify = require('../middleware/verify')


AdminCategory.post('/admin/create_category', verify, async(req, res) => {

    try {

        const {category} = req.body

        const CATEGORY = category.toUpperCase()
        const ifCatExists = await Category.findOne({category: CATEGORY})

        if(ifCatExists) {
            
            return res.json({msg: "This category already exists!"})

        } 

             await Category.create({
                category: CATEGORY
             })

             res.json({msg: "Successfully created a new category!"})
        
    } catch (error) {
        console.log(`Encountered this problem: ${error.message} : while creating a category`)
        res.json({msg: "Server Error"})
    }

})


AdminCategory.put('/admin/create_subcategory/:id', verify, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
      return res.status(400).json({ msg: "Id cannot be missing" });
    }

    if (!name) {
      return res.status(400).json({ msg: "Subcategory name is required" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ msg: "This category does not exist" });
    }

    
    const exists = category.subCategory.some(
      (sub) => sub.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ msg: "Subcategory already exists" });
    }


    category.subCategory.push({ name });

    await category.save();

    res.json({ msg: "Successfully created sub-category", category });
  } catch (error) {
    console.error(`Error creating sub-category: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });
  }
});


AdminCategory.delete('/admin/erase_category/:id', async(req, res) => {

    try {

        const {id} = req.params

        if (!id) {
      return res.status(400).json({ msg: "Id cannot be missing" });
    }

    const catFound = await Category.findById(id)

    if(!catFound) {
        return res.json({msg: "This category does not exist"})
    }

       await Category.findByIdAndDelete(id)

       res.json({msg: "Successfully deleted category"})

        
    } catch (error) {
        console.error(`Error deleting category: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });

    }


})

AdminCategory.delete('/admin/erase_subcategory/:catId/:subCatId', async (req, res) => {
  try {
    const { catId, subCatId } = req.params;

    if (!catId) {
      return res.json({ msg: "category id cannot be missing" });
    }

    if (!subCatId) {
      return res.json({ msg: "sub-category id cannot be missing" });
    }

    const catFound = await Category.findById(catId);
    if (!catFound) {
      return res.json({ msg: "This category does not exist" });
    }

    const exists = catFound.subCategory.some(
      (sub) => sub._id.toString() === subCatId
    );

    if (!exists) {
      return res.json({ msg: "This sub category does not exist" });
    }

    
    catFound.subCategory = catFound.subCategory.filter(
      (sub) => sub._id.toString() !== subCatId
    );

    await catFound.save();

    res.json({ msg: "Deleted successfully!" });
  } catch (error) {
    console.error(`Error deleting sub-category: ${error.message}`);
    res.status(500).json({ msg: "Server Error" });
  }
});


module.exports = AdminCategory
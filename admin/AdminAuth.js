const AdminAuth = require('express').Router()
const Admin = require('../models/AdminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


AdminAuth.post('/admin/create-account', async(req, res) => {

try {

    const {adminMail, adminKey} = req.body

    if(!adminMail || !adminKey) {

        return res.json({msg: "A field is empty"})

    }

    const adminExists = await Admin.find()

    if(adminExists.length === 1) {
        return res.json({msg: "Cannot create another admin account"})
    }
           const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(adminKey, salt)

      await Admin.create({
        adminMail,
        adminKey: hashedPassword
      })

      res.json({msg: "Successfully Created Account"})
    
} catch (error) {
    console.log("there was a problem", error.message)
    res.json({msg: "Server Error", error: error.message})
}

})


AdminAuth.get('/admin/check-session', async(req, res) => {

    try {

        const getUser = await Admin.find().limit(1)

        const userSession = getUser[0].adminSession

        res.json({userSession})
        
    } catch (error) {
        console.log("Server Error", error.message)
        res.json({msg: "Server Error", error: error.message })
    }

})


module.exports = AdminAuth
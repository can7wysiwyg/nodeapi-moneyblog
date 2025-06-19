const AdminAuth = require('express').Router()
const Admin = require('../models/AdminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verify = require('../middleware/verify')


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


AdminAuth.post('/admin/user-login', async(req, res) => {

    try {

        const {adminMail, adminKey} = req.body

    if(!adminMail || !adminKey) {

        return res.json({msg: "A field is empty"})

    }

    const exists = await Admin.findOne({adminMail: adminMail})

    if(!exists) {
        return res.json({msg: "This user does not exists"})
    }

    
    const passwordMatch = await bcrypt.compare(adminKey, exists.adminKey)

    if(passwordMatch) {

        let refreshtoken = createRefreshToken({id: exists._id})
        res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, admin) =>{
        if(err) return res.json({msg: "Please Login or Register"})
    
        const admintoken = createAccessToken({id: admin.id})

         Admin.updateOne({_id: exists._id}, {
            adminToken: admintoken
         })


         res.json({message: "Success"})



})


    } else {
      res.json({ msg: "check your password again" });
    } 







        
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



AdminAuth.get('/admin/find-admin', verify, async(req, res) => {

    try {
        const admin = await Admin.findById(req.admin).select('-password')
      if(!admin) return res.status(400).json({msg: "Admin Does Not Does Exist."})
    
      res.json({user})


        
    } catch (error) {
        console.log("Server Error", error.message)
        res.json({msg: "Server Error", error: error.message })
    }


})



const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN, {expiresIn: '30d'})
  }
  const createRefreshToken = (admin) =>{
    return jwt.sign(admin, process.env.REFRESH_TOKEN, {expiresIn: '30d'})
  }



module.exports = AdminAuth
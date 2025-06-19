const jwt = require('jsonwebtoken')
const Admin = require('../models/AdminModel')

const verify = async (req, res, next) => {
  let admintoken

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
    
      admintoken = req.headers.authorization.split(' ')[1]

    
      const decoded = jwt.verify(admintoken, process.env.ACCESS_TOKEN)

      
      req.admin = await Admin.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      console.log('Not authorized')
    }
  }

  if (!admintoken) {
    
    console.log('Not authorized, no token')
  }
}

module.exports = verify 




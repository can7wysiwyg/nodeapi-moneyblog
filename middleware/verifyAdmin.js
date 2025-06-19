const Admin = require('../models/AdminModel')

const verifyAdmin = async(req, res, next) => {
    try {

        const admin = await Admin.findOne({
            _id: req.user.id
        })
    
    
        
    
        if(admin.adminSession !== false ) return res.json({msg: "you are not the admin"})
    
        next()
    
        
    } catch (error) {

        res.json({msg: `there was a problem: ${error.message}`})
        
    }

    

}

module.exports = verifyAdmin
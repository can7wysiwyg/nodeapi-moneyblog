const TestRoute = require('express').Router()
const testmid = require('./testmid')


TestRoute.get('/test', testmid, async(req, res) => {
try {
       console.log(req.admin)
    res.json({msg: "test route", admin: req.admin})
} catch (error) {

    res.json({msg: "Server Error", error: error.message})
    
}


})




module.exports = TestRoute
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
        
      jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, admin) =>{
        if(err) return res.json({msg: "Please Login or Register"})
    
        const admintoken = createAccessToken({id: admin.id})

        const key = bcrypt.hashSync(admin.id, 10)
      
         
         Admin.updateOne({_id: exists._id}, {
            adminToken: admintoken,
            refreshToken: refreshtoken

         }).then(() => {
    res.json({key: key});
  })



})


    } else {
      res.json({ msg: "check your password again" });
    } 







        
    } catch (error) {
     console.log("there was a problem", error.message)
     res.json({msg: "Server Error", error: error.message})
        
    }


})




// AdminAuth.get('/admin/check-session/', async (req, res) => {
//   try {
//     const { key } = req.query;

//     const getUser = await Admin.find().limit(1);
//     if (!getUser || getUser.length === 0) {
//       return res.json({ msg: "Admin not found" });
//     }

//     const admindId = getUser[0]._id.toString();
//     const admintoken = getUser[0].adminToken;

//     const checkKey = bcrypt.compareSync(admindId, key);

//     if (!checkKey || !admintoken) {
//       return res.json({ msg: "Please Login" });
//     }

//     const idFromToken = jwt.verify(admintoken, process.env.ACCESS_TOKEN);
//     const myId = idFromToken.id;

//     if (checkKey && myId === admindId) {
//       const response = await fetch(`${process.env.API_URL}/admin/find-admin`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${admintoken}`,
//         },
//       });

//       if (!response.ok) {
//         return res.json({ msg: "Server Error" });
//       }

//       const data = await response.json();
//       return res.json({ data });
//     }

    
//     return res.json({ msg: "Invalid session" });

//   } catch (error) {
//     console.log("Server Error check session", error.message);
//     res.json({ msg: "Server Error find-session", error: error.message });
//   }
// });


AdminAuth.get('/admin/check-session', async (req, res) => {
  try {
    const { key } = req.query;

    const getUser = await Admin.find().limit(1);
    if (!getUser || getUser.length === 0) {
      return res.json({ msg: "Admin not found" });
    }

    const user = getUser[0];
    const admindId = user._id.toString();
    const admintoken = user.adminToken;
    const refreshtoken = user.refreshToken;

    const checkKey = bcrypt.compareSync(admindId, key);
    if (!checkKey || !admintoken) {
      return res.json({ msg: "Please Login" });
    }

    let validToken = admintoken;

    try {
      const decoded = jwt.verify(admintoken, process.env.ACCESS_TOKEN);
      if (decoded.id !== admindId) {
        return res.json({ msg: "Invalid token ID" });
      }
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        
        try {
          const decodedRefresh = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN);
          if (decodedRefresh.id !== admindId) {
            return res.json({ msg: "Invalid refresh token" });
          }

          
          validToken = jwt.sign({ id: admindId }, process.env.ACCESS_TOKEN, { expiresIn: '15m' });

        
          await Admin.updateOne({ _id: admindId }, { adminToken: validToken });
        } catch (refreshError) {
          return res.json({ msg: "login again." });
        }
      } else {
        return res.json({ msg: "Invalid token" });
      }
    }

    
    const response = await fetch(`${process.env.API_URL}/admin/find-admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${validToken}`,
      },
    });

    if (!response.ok) {
      return res.json({ msg: "Server Error" });
    }

    const data = await response.json();
    return res.json({ data });

  } catch (error) {
    console.log("Server Error check session", error.message);
    return res.json({ msg: "Server Error find-session", error: error.message });
  }
});




AdminAuth.get('/admin/find-admin', verify, async(req, res) => {

    try {
        const admin = await Admin.findById(req.admin).select('-adminKey')
      if(!admin) return res.status(400).json({msg: "Admin Does Not Does Exist."})
    
      res.json({admin})


        
    } catch (error) {
        console.log("Server Error find user", error.message)
        res.json({msg: "Server Error find user", error: error.message })
    }


})


AdminAuth.put('/admin/logout-admin', verify, async(req, res) => {

    try {

         console.log(req.admin.id)
        const admin = await Admin.findById({_id: req.admin.id})

        if(!admin) {
            return res.json({msg: "This admin does not exists!"})
        }

        await Admin.updateOne({_id: req.admin.id}, {
            adminToken: ""
        })


        res.json({msg: "Successfully Logged Out!"})
        
    } catch (error) {

        console.log("Server Error while trying to logout admin", error.message)
        res.json({msg: "Server Error", error: error.message })
    }
        
    


})






const createAccessToken = (admin) =>{
    return jwt.sign(admin, process.env.ACCESS_TOKEN, {expiresIn: '15m'})
  }
  const createRefreshToken = (admin) =>{
    return jwt.sign(admin, process.env.REFRESH_TOKEN, {expiresIn: '30d'})
  }



module.exports = AdminAuth



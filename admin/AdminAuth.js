// const AdminAuth = require('express').Router()
// const Admin = require('../models/AdminModel')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const verify = require('../middleware/verify')


// AdminAuth.post('/admin/create-account', async(req, res) => {

// try {

//     const {adminMail, adminKey} = req.body

//     if(!adminMail || !adminKey) {

//         return res.json({msg: "A field is empty"})

//     }

//     const adminExists = await Admin.find()

//     if(adminExists.length === 1) {
//         return res.json({msg: "Cannot create another admin account"})
//     }
//            const salt = await bcrypt.genSalt(10);

//       const hashedPassword = await bcrypt.hash(adminKey, salt)

//       await Admin.create({
//         adminMail,
//         adminKey: hashedPassword
//       })

//       res.json({msg: "Successfully Created Account"})
    
// } catch (error) {
//     console.log("there was a problem", error.message)
//     res.json({msg: "Server Error", error: error.message})
// }

// })


// // AdminAuth.post('/admin/user-login', async(req, res) => {

// //     try {

// //         const {adminMail, adminKey} = req.body

// //     if(!adminMail || !adminKey) {

// //         return res.json({msg: "A field is empty"})

// //     }

// //     const exists = await Admin.findOne({adminMail: adminMail})

// //     if(!exists) {
// //         return res.json({msg: "This user does not exists"})
// //     }


    

    
// //     const passwordMatch = await bcrypt.compare(adminKey, exists.adminKey)

// //     if(passwordMatch) {

// //         let refreshtoken = createRefreshToken({id: exists._id})
// //         res.cookie('refreshtoken', refreshtoken, { expire: new Date() + 9999 });

// //       jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, admin) =>{
// //         if(err) return res.json({msg: "Please Login or Register"})
    
// //         const admintoken = createAccessToken({id: admin.id})

// //         const key = bcrypt.hashSync(admin.id, 10)
// //         console.log(key)
         
// //          Admin.updateOne({_id: exists._id}, {
// //             adminToken: admintoken
// //          }).then(() => {
// //     res.json({key: key});
// //   })



// // })


// //     } else {
// //       res.json({ msg: "check your password again" });
// //     } 







        
// //     } catch (error) {
// //      console.log("there was a problem", error.message)
// //      res.json({msg: "Server Error", error: error.message})
        
// //     }


// // })


// AdminAuth.post('/admin/user-login', async(req, res) => {

//     try {

//         const {adminMail, adminKey} = req.body

//     if(!adminMail || !adminKey) {

//         return res.json({msg: "A field is empty"})

//     }

//     const exists = await Admin.findOne({adminMail: adminMail})

//     if(!exists) {
//         return res.json({msg: "This user does not exists"})
//     }

    
//     const passwordMatch = await bcrypt.compare(adminKey, exists.adminKey)

//     if(passwordMatch) {

//         let refreshtoken = createRefreshToken({id: exists._id})
//         let accesstoken = createAccessToken({id: exists._id})
        
//         res.cookie('refreshtoken', refreshtoken, { 
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'strict',
//             maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
//         });

//         const key = bcrypt.hashSync(exists._id.toString(), 10)
         
//         await Admin.updateOne({_id: exists._id}, {
//             adminToken: accesstoken,
//             refreshToken: refreshtoken
//         })

//         res.json({
//             key: key,
//             accessToken: accesstoken,
//             msg: "Login successful"
//         });

//     } else {
//       res.json({ msg: "check your password again" });
//     } 

//     } catch (error) {
//      console.log("there was a problem", error.message)
//      res.json({msg: "Server Error", error: error.message})
//     }

// })


// // NEW: Token refresh endpoint
// AdminAuth.post('/admin/refresh-token', async(req, res) => {
//     try {
//         const refreshToken = req.cookies.refreshtoken;
        
//         if (!refreshToken) {
//             return res.json({ msg: "No refresh token provided" });
//         }

//         // Verify the refresh token
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
//             if (err) {
//                 return res.json({ msg: "Invalid refresh token. Please login again." });
//             }

//             // Find admin and check if refresh token matches
//             const admin = await Admin.findById(decoded.id);
//             if (!admin || admin.refreshToken !== refreshToken) {
//                 return res.json({ msg: "Invalid refresh token. Please login again." });
//             }

//             // Generate new access token
//             const newAccessToken = createAccessToken({ id: admin._id });
            
//             // Update admin with new access token
//             await Admin.updateOne({ _id: admin._id }, {
//                 adminToken: newAccessToken
//             });

//             res.json({
//                 accessToken: newAccessToken,
//                 msg: "Token refreshed successfully"
//             });
//         });

//     } catch (error) {
//         console.log("Error refreshing token:", error.message);
//         res.json({ msg: "Server Error", error: error.message });
//     }
// });





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



// AdminAuth.get('/admin/find-admin', verify, async(req, res) => {

//     try {
//         const admin = await Admin.findById(req.admin).select('-adminKey')
//       if(!admin) return res.status(400).json({msg: "Admin Does Not Does Exist."})
    
//       res.json({admin})


        
//     } catch (error) {
//         console.log("Server Error find user", error.message)
//         res.json({msg: "Server Error find user", error: error.message })
//     }


// })


// // AdminAuth.put('/admin/logout-admin', verify, async(req, res) => {

// //     try {

// //          console.log(req.admin.id)
// //         const admin = await Admin.findById({_id: req.admin.id})

// //         if(!admin) {
// //             return res.json({msg: "This admin does not exists!"})
// //         }

// //         await Admin.updateOne({_id: req.admin.id}, {
// //             adminToken: ""
// //         })


// //         res.json({msg: "Successfully Logged Out!"})
        
// //     } catch (error) {

// //         console.log("Server Error while trying to logout admin", error.message)
// //         res.json({msg: "Server Error", error: error.message })
// //     }
        
    


// // })


// AdminAuth.put('/admin/logout-admin', verify, async(req, res) => {

//     try {

//          console.log(req.admin.id)
//         const admin = await Admin.findById({_id: req.admin.id})

//         if(!admin) {
//             return res.json({msg: "This admin does not exists!"})
//         }

//         await Admin.updateOne({_id: req.admin.id}, {
//             adminToken: "",
//             refreshToken: ""
//         })

//         // Clear the refresh token cookie
//         res.clearCookie('refreshtoken');

//         res.json({msg: "Successfully Logged Out!"})
        
//     } catch (error) {

//         console.log("Server Error while trying to logout admin", error.message)
//         res.json({msg: "Server Error", error: error.message })
//     }
        
    


// })




// const createAccessToken = (admin) =>{
//     return jwt.sign(admin, process.env.ACCESS_TOKEN, {expiresIn: '30d'})
//   }
//   const createRefreshToken = (admin) =>{
//     return jwt.sign(admin, process.env.REFRESH_TOKEN, {expiresIn: '30d'})
//   }



// module.exports = AdminAuth


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
        let accesstoken = createAccessToken({id: exists._id})
        
        res.cookie('refreshtoken', refreshtoken, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        const key = bcrypt.hashSync(exists._id.toString(), 10)
         
        await Admin.updateOne({_id: exists._id}, {
            adminToken: accesstoken,
            refreshToken: refreshtoken
        })

        res.json({key: key}); // Only send encrypted ID to frontend

    } else {
      res.json({ msg: "check your password again" });
    } 

    } catch (error) {
     console.log("there was a problem", error.message)
     res.json({msg: "Server Error", error: error.message})
    }

})


// Function to automatically refresh token when expired
async function refreshTokenIfNeeded(adminId) {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin || !admin.refreshToken) {
            return null;
        }

        // Check if current access token is expired
        try {
            jwt.verify(admin.adminToken, process.env.ACCESS_TOKEN);
            return admin.adminToken; // Token is still valid
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Access token expired, check refresh token
                try {
                    const decoded = jwt.verify(admin.refreshToken, process.env.REFRESH_TOKEN);
                    
                    // Generate new access token
                    const newAccessToken = createAccessToken({id: decoded.id});
                    
                    // Update admin with new access token
                    await Admin.updateOne({_id: adminId}, {
                        adminToken: newAccessToken
                    });
                    
                    return newAccessToken;
                } catch (refreshError) {
                    // Refresh token also expired
                    await Admin.updateOne({_id: adminId}, {
                        adminToken: "",
                        refreshToken: ""
                    });
                    return null;
                }
            }
            return null;
        }
    } catch (error) {
        console.log("Error in refreshTokenIfNeeded:", error.message);
        return null;
    }
}


AdminAuth.get('/admin/check-session/', async (req, res) => {
  try {
    const { key } = req.query;

    const getUser = await Admin.find().limit(1);
    if (!getUser || getUser.length === 0) {
      return res.json({ msg: "Admin not found" });
    }

    const admindId = getUser[0]._id.toString();
    const checkKey = bcrypt.compareSync(admindId, key);

    if (!checkKey) {
      return res.json({ msg: "Please Login" });
    }

    // Automatically refresh token if needed
    const validToken = await refreshTokenIfNeeded(admindId);
    
    if (!validToken) {
      return res.json({ msg: "Session expired. Please login again." });
    }

    // Use the valid (possibly refreshed) token
    try {
        const idFromToken = jwt.verify(validToken, process.env.ACCESS_TOKEN);
        const myId = idFromToken.id;

        if (checkKey && myId === admindId) {
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
        }

        return res.json({ msg: "Invalid session" });

    } catch (tokenError) {
        return res.json({ msg: "Invalid token" });
    }

  } catch (error) {
    console.log("Server Error check session", error.message);
    res.json({ msg: "Server Error find-session", error: error.message });
  }
});


// Updated verify middleware to handle automatic token refresh
const verifyWithRefresh = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.json({ msg: "No token, access denied" });
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            req.admin = decoded;
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Try to refresh the token
                const validToken = await refreshTokenIfNeeded(req.admin?.id);
                
                if (!validToken) {
                    return res.json({ msg: "Session expired. Please login again." });
                }
                
                const decoded = jwt.verify(validToken, process.env.ACCESS_TOKEN);
                req.admin = decoded;
                next();
            } else {
                return res.json({ msg: "Token is not valid" });
            }
        }
    } catch (error) {
        console.log("Error in verifyWithRefresh:", error.message);
        res.json({ msg: "Server Error", error: error.message });
    }
};


AdminAuth.get('/admin/find-admin', async(req, res) => {

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            return res.json({ msg: "No token, access denied" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Try to refresh the token automatically
                const validToken = await refreshTokenIfNeeded(decoded?.id);
                
                if (!validToken) {
                    return res.json({ msg: "Session expired. Please login again." });
                }
                
                decoded = jwt.verify(validToken, process.env.ACCESS_TOKEN);
            } else {
                return res.json({ msg: "Token is not valid" });
            }
        }

        const admin = await Admin.findById(decoded.id).select('-adminKey')
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
            adminToken: "",
            refreshToken: ""
        })

        
        res.clearCookie('refreshtoken');

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
    return jwt.sign(admin, process.env.REFRESH_TOKEN, {expiresIn: '15m'})
  }



module.exports = AdminAuth
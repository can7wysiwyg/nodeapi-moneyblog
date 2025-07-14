// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const Admin = require('./models/AdminModel');

// const testmid = async (req, res, next) => {
//   try {
//     const { key } = req.query;

//     if (!key) {
//       return res.status(400).json({ msg: "Key is required" });
//     }

//     const user = await Admin.find().limit(1);
//     if (!user || user.length === 0) {
//       return res.status(404).json({ msg: "Admin not found" });
//     }

//     const getAdmin = user[0];
//     const admindId = getAdmin._id.toString();
//     const admintoken = getAdmin.adminToken;

//     const decryptedId = bcrypt.compareSync(admindId, key);
//     if (!decryptedId || !admintoken) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

//     const decoded = jwt.verify(admintoken, process.env.ACCESS_TOKEN);
//     if (!decoded || decoded.id !== admindId) {
//       return res.status(401).json({ msg: "Invalid token or mismatched ID" });
//     }

    
//     req.admin = await Admin.findById(decoded.id).select('-adminKey -refreshToken -adminToken');
//     next();

//   } catch (error) {
//     console.log("Middleware error:", error.message);
//     return res.status(500).json({ msg: "Middleware server error", error: error.message });
//   }
// };

// module.exports = testmid;


// const jwt = require('jsonwebtoken');
// const Admin = require('./models/AdminModel');

// const testmid = async (req, res, next) => {
//   try {
//     if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     const user = await Admin.findOne(); 
//     if (!user) {
//       return res.status(404).json({ msg: "Admin not found" });
//     }
//    const key = req.headers.authorization.split(' ')[1]

//     const admindId = user._id.toString();
//     const admintoken = user.adminToken;

    
//     const isValidKey = admindId === key


    
//     if (!isValidKey || !admintoken) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

   
//     const decoded = jwt.verify(admintoken, process.env.ACCESS_TOKEN);
//     if (decoded.id !== admindId) {
//       return res.status(401).json({ msg: "Token ID mismatch" });
//     }

    
//     req.admin = await Admin.findById(decoded.id).select('-adminKey -refreshToken -adminToken');

//     next();
//   }

//   } catch (error) {
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ msg: "Access token expired" });
//     }

//     console.error("Middleware error:", error.message);
//     return res.status(500).json({ msg: "Middleware server error", error: error.message });
//   }
// };

// module.exports = testmid;



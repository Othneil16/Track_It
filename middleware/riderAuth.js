const userModel = require("../models/userModel")
const riderModel = require("../models/riderMod")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()
const revokedRiderTokenModel = require('../models/revokedRiderTokenMod')

// const revokedToken = require('../models/revokedTokenModel')


// exports.authenticate = async (req,res,next)=>{
//     try{

//         const hasAuthorization = req.headers.authorization

//         if(!hasAuthorization){
//             return res.status(400).json({
//                 error:"Authorization token not found"
//             })
//         }

//         const token = hasAuthorization.split(" ")[1]

//         if(!token){
//             return res.status(400).json({
//                 error: "Authorization not found"
//             })
//         }

//         const decodeToken = jwt.verify(token, process.env.secret)

        

//         const user = await userModel.findById(decodeToken.userId)

//         if(!user){
//             return res.status(404).json({
//                 error: "Authorization failed: user not found" 
//             })
//         }
        
//         // const checkToken = user.blackListToken.includes(token);

//         // if(checkToken){
//         //     return res.status(400).json({
//         //         error: "user signed Out"
//         //     })
//         // }
//         req.user = decodeToken;
//         next()

//     }catch(error){

//         if(error instanceof jwt.JsonWebTokenError){
//             return res.json({
//                 message: "session Timeout"
//             })
//         }

//         res.status(500).json({
//             error:error.message
//         })
//     }
// }


exports.companyauthenticate = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers.authorization;

        if (!hasAuthorization) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const riderToken = hasAuthorization.split(' ')[1];

        if (!riderToken) {
            return res.status(401).json({
                message: 'Action requires sign-in. Please log in to continue.'
            });
        }

        const isTokenRevoked = await revokedRiderTokenModel.exists({ riderToken });

        if (isTokenRevoked) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in again."
            });
        }

        const decodedRiderToken = jwt.verify(riderToken, process.env.jsonSecret);

        const rider = await riderModel.findById(decodedRiderToken.riderId);

        if (!rider) {
            return res.status(404).json({
                message: 'Authentication Failed: rider not found'
            });
        }

        req.rider = decodedRiderToken;

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Oops! Access denied. Your session has expired. Please sign in again."
            });
        }
        res.status(500).json({
            Error: error.message
        });
    }
};

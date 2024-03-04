// const userModel = require("../models/userModel") 
// require("dotenv")
// const bcrypt = require('bcrypt')
// const {userValidate} = require('../utilities/userValidator')
// const nodemailer = require("nodemailer");
// const { userDynamicMail } = require('../helpers/userMailHtml');
// const jwt = require('jsonwebtoken')


// // create a nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: process.env.SERVICE,
//     auth: {
//       user: process.env.SENDER_EMAIL,
//       pass: process.env.GMAIL_PASSWORD,
//       secure: false
//     }   
//   });


//   exports.createUser = async (req, res) => {
//     try {
//         const { userFirstName, userLastName, userPhoneNumber, userEmail, userPassword, confirmUserPassword } = req.body;

//         // Validate user input
//         await userValidate.validateAsync(req.body);

//         // Check if passwords match
//         if (confirmUserPassword !== userPassword) {
//             return res.status(400).json({
//                 message: 'Passwords do not match'
//             });
//         }

//         // Hash the user's password
//         const salt = bcrypt.genSaltSync(10);
//         const hashedPassword = bcrypt.hashSync(userPassword, salt);

//         // Create user instance
//         const user = new userModel({
//             firstName: userFirstName.toUpperCase(),
//             lastName: userLastName.toUpperCase(),
//             phoneNumber: userPhoneNumber,
//             email: userEmail.toLowerCase(),
//             password: hashedPassword,
//         });

//         // Save the user to the database
//         await user.save();

//         // Generate user token
//         const userToken = jwt.sign({
//             userPhoneNumber: user.phoneNumber,
//             userEmail: user.email,
//             userPackages: user.packages
//         }, process.env.jsonSecret, { expiresIn: '1d' });

//         // Send verification email to the user
//         const subject = 'Kindly verify your user account';
//         const link = `${req.protocol}://${req.get('host')}/user/verify-email/${userToken}`;
//         const userName = `${userFirstName.charAt(0).toUpperCase()}${userFirstName.slice(1)}. ${userLastName.charAt(0).toUpperCase()}`;
//         const html = userDynamicMail(userName, link);
//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: userEmail,
//             subject,
//             html
//         };
//         await transporter.sendMail(mailOptions);

//         // Return success message and user data
//         return res.status(201).json({
//             message: `Congratulations ${userName}! You have successfully created a TRACK_IT account. Kindly check your email ${userEmail}to verify your account in order to enjoy our tracking services.`,
//             user,
//             // userToken
//         });
//     } catch (err) {
//         return res.status(500).json({
//             error: err.message
//         });
//     }
// }


// exports.userSignIn = async (req, res) => {
    
//     const {identifier, password } = req.body;    
//     try {
//         // Check if the identifier is an email or accountNumber 
//         const isEmail = /\S+@\S+\.\S+/.test(identifier);
//         const isPhoneNumber = /^\d{11}$/.test(identifier);
        
        
       

//         if (!isEmail && !isPhoneNumber) {
//             return res.status(400).json({
//                 message: 'Invalid identifier. Please use a valid email or phone number.'
//             });
//         }
        
//         // Find user by email or accountNumber
//         const user = await userModel.findOne({
//             $or: [
//                 { email: isEmail ? identifier.toLowerCase() : '' },
//                 { phoneNumber: isPhoneNumber ? identifier : '' }
//             ]
//         });
//         //    checking the user in the dataBase
//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found'
//             });
//         }
//            // comparing the user's password to that coming from the req.body 
//         const comparePassword = bcrypt.compareSync(password, user.password);

//         if (!comparePassword) {
//             return res.status(400).json({
//                 message: 'Invalid password. Please type-in a correct password.'
//             });
//         }
//             //   push the user's details to the jwt token
//         const userToken = jwt.sign({
//             userId: user._id,
//             email: user.email,
//             phoneNumber: user.phoneNumber,
//             packages:user.packages
//             }
//             , process.env.jsonSecret, { expiresIn: '1d' });
             

//             // return the success message and the user's data
//         return res.status(200).json({
//             message: `Welcome ${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(1)}.${user.lastName.slice(0, 1).toUpperCase()}, Feel free to carry out fast and reliable tracking operations of your packages with our application`,
//              userToken,
//             data:user

//         });

//     } catch (err) {
//         return res.status(500).json({
//             error: err.message
//         });
//     }
// }




// // exports.signOut = async (req, res) => {
// //     try{
// //         const {userId, token} = req.user 
// //         const user = await userModel.findById(userId);

// //     if(!user){
// //             return res.status(404).json({
// //                 message: 'This user not found'
// //             })
// //         }
    
// //         if (!user.token || user.token !== token) {
// //             return res.status(400).json({
// //                 message: 'User does not have a valid token'
// //             });
// //         }

// //        // Revoke token by setting its expiration to a past date
// //        const decodedToken = jwt.verify(user.token, process.env.secret);
// //        decodedToken.exp = 1;

// //    return res.status(200).json({
// //         message: 'You have signed out successfully'
// //     })
        
        
// //     }catch(err){
// //         return res.status(500).json({
// //             message: err.message
// //         })
// //     }
// // }


// exports.signOut = async (req, res) => {
//     try {
//       const authorizationHeader = req.headers.authorization;
  
//       if (!authorizationHeader) {
//         return res.status(401).json({
//           message: 'Missing token'
//         });
//       }
  
//       const token = authorizationHeader.split(' ')[1];
  
//       // Create a new revoked token entry and save it to the database
//       const revokedToken = new RevokedToken({
//         token: token
//       });
  
//       await revokedToken.save();
  
//       res.status(200).json({
//         message: 'User logged out successfully'
//       });
//     } catch (error) {
//       res.status(500).json({
//         Error: error.message
//       });
//     }
//   };

//   exports.verifyUserEmail = async (req, res) => {
//     try {
//         const { userToken } = req.params;

//         // Verify the token
//         const { userEmail } = jwt.verify(userToken, process.env.jsonSecret);

//         // Find the user by email
//         const user = await userModel.findOne({ email: userEmail });

//         // Check if user has already been verified
//         if (user.isVerified) {
//             return res.status(400).json({
//                 message: "User already verified"
//             });
//         }

//         // Update the user verification status
//         user.isVerified = true;

//         // Save the changes
//         await user.save();

//         res.status(200).json({
//             message: "User verified successfully",
//             data: user
//         });
//     } catch (error) {
//         // Handle token verification errors
//         res.status(400).json({
//             message: error.message
//         });
//     }
// }



// exports.getOneUserPackage = async (req, res) => {
//     try {
//         const { packageId } = req.user;

//         // Retrieve the package from the database
//         const package = await packageModel.findById(packageId).populate('user');

//         if (!package) {
//             return res.status(404).json({
//                 message: 'Package not found'
//             });
//         }

//         return res.status(200).json({
//             package
//         });
//     } catch (error) {
//         return res.status(500).json({
//             error: error.message
//         });
//     }
// };
const riderModel = require('../models/riderMod');
const companyModel = require("../models/companyMod")
const bcrypt = require("bcrypt") 
const jwt = require("jsonwebtoken")
const {riderValidate} = require('../utilities/riderValidator')
const nodemailer = require("nodemailer");
const { riderDynamicMail } = require('../helpers/riderMailHtml');
const cloudinary = require("../imagesutils/cloudinary")


// create a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
      secure: false
    }   
  });
  
 
// Function to generate unique ID
const generateUniqueId = (length)=> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
 

  exports.createRider = async (req, res) => {
    try {
        const { companyId } = req.company;

        // Retrieve company from the database
        const company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: 'Company not found'
            });
        }

        // Check if company is verified
        if (!company.isVerified) {
            return res.status(400).json({
                error: "Company not verified"
            });
        }
       

        const { riderFirstName, riderLastName, riderEmail, riderPhoneNumber, riderPassword, riderAddress, confirmRiderPassword} = req.body;
        
        
        const file = req.files.riderprofileImage.tempFilePath
        const result = await cloudinary.uploader.upload(file)

        // Validate rider data
        await riderValidate.validateAsync(req.body);

        // Check if passwords match
        if (confirmRiderPassword !== riderPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        // Hash rider password
        const saltedRound = bcrypt.genSaltSync(10);
        const hashedRiderPassword = bcrypt.hashSync(riderPassword, saltedRound);
        
            // Generate unique rider ID
        let uniqueId;
        let isUniqueId = false;
        while (!isUniqueId) {
            uniqueId = generateUniqueId(6);

            const existingRider = await riderModel.findOne({ riderId: uniqueId });
            if (!existingRider) {
                isUniqueId = true;
            }
        }


        // Create rider instance
        const rider = new riderModel({
            riderFirstName: riderFirstName.toUpperCase(),
            riderLastName: riderLastName.toUpperCase(),
            riderPhoneNumber,
            riderAddress,
            riderEmail: riderEmail.toLowerCase(),
            riderPassword: hashedRiderPassword,
            profileImage:result.secure_url,
            riderId: uniqueId
        });

        // Generate rider token
        const riderToken = jwt.sign({
            riderId: rider._id,
            riderEmail: rider.riderEmail,
            riderPhoneNumber,
            riderFirstName,
            riderLocation: rider.riderLocation,
        }, process.env.jsonSecret, { expiresIn: "50m" });

        // Sending a verification email to the rider
        const subject = 'Kindly verify your rider account';
        const link = `${req.protocol}://${req.get('host')}/company/rider/verify-email/${riderToken}`;
        const editedRiderName = rider.riderFirstName.toUpperCase() + "." + rider.riderLastName.toUpperCase().slice(0, 1);
        const html = riderDynamicMail(link, editedRiderName);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: riderEmail,
            subject,
            html
        };

        // Send verification email
        await transporter.sendMail(mailOptions);

        // Save rider
         await rider.save();

        // Update company's rider array
        company.companyRiders.push(rider._id);
        await company.save();

        return res.status(201).json({
            message: `Congratulations!!! Rider account is successfully created. Kindly check your email: ${rider.riderEmail} to verify your account on our platform.`,
            rider
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}


exports.riderSignIn = async (req, res) => {
    const { identifier, riderPassword } = req.body;
    try {
        // Check if the identifier is an email, phone number, or rider ID
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        // const isPhoneNumber = /^\d{11}$/.test(identifier);
        const isRiderId = /^[a-zA-Z0-9]{6}$/.test(identifier);

        if (!isEmail && !isRiderId) {
            return res.status(400).json({
                message: 'Invalid identifier. Please use a valid rider email or rider ID.'
            });
        }

        let rider;

        // Find rider by email, phone number, or rider ID
        if (isEmail) {
            rider = await riderModel.findOne({ riderEmail: isEmail.toLowerCase() });
        } else if (isRiderId) {
            rider = await riderModel.findOne({ riderId: isRiderId });
        }

        
        if (!rider) {
            return res.status(404).json({
                message: 'Rider not found'
            });
        }

        // Compare passwords
        const comparePassword = bcrypt.compareSync(riderPassword, rider.riderPassword);

        if (!comparePassword) {
            return res.status(400).json({
                message: 'Invalid password. Please type-in a correct password.'
            });
        }

        
        const riderToken = jwt.sign({
            riderId: riderId,
            riderEmail: rider.riderEmail,
            riderPhoneNumber: rider.riderPhoneNumber,
            riderAssignedPackaged:rider.riderAssignedpackages
        }, process.env.jsonSecret, { expiresIn: '1d' });

        // Return success message and rider data
        return res.status(200).json({
            message: `Welcome ${rider.riderFirstName}, Feel free to carry out fast and reliable operations with our application`,
            riderToken,
            rider
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}



// verify email
exports.verifyRiderEmail = async (req, res) => {
    try {
      const { riderToken } = req.params;
  
      // verify the token
      const { riderEmail } = jwt.verify(riderToken, process.env.jsonSecret);
  
      const rider = await riderModel.findOne({ riderEmail });
  
      // Check if user has already been verified
      if (rider.isVerified) {
        return res.status(400).json({
          error: "rider already verified"
        });
      }
  
      // update the user verification
      rider.isVerified = true;
  
      // save the changes
      await rider.save();
  
      // update the user's verification status
      const updatedRider = await riderModel.findOneAndUpdate({ riderEmail }, rider);
  
      res.status(200).json({
        message: "rider verified successfully",
        data: updatedRider,
      })
      // res.status( 200 ).redirect( `${ process.env.BASE_URL }/login` );
  
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
  

exports.getAllRiders = async (req, res) => {
    try {
        const riders = await riderModel.find();

      
        if (!riders || riders.length === 0) {
            return res.status(404).json({
                 message: 'No riders found' 
         });
        }

        return res.status(200).json({ riders });
    } catch (error) {
        console.error('Error fetching riders:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};




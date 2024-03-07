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
    const characters = '0123456789';
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
        if (company.isVerified !== true) {
            return res.status(400).json({
                error: "Company not verified"
            });
        }   
       
    
        const { riderFirstName, riderLastName, riderEmail, riderPhoneNumber, riderPassword, riderAddress, confirmRiderPassword} = req.body;
       


      
        // if (!req.file || req.file.profileImage) {
        //     return res.status(400).json({ error: 'No file uploaded' });
        // }

        //const file = req.file
        // const result = await cloudinary.uploader.upload(req.file.tempFilePath, {
        //     folder: 'rider-profiles',
        //     resource_type: 'auto'
        // });
        
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
            riderphoneNumber:riderPhoneNumber,
            riderAddress,
            riderEmail: riderEmail.toLowerCase(),
            riderPassword: hashedRiderPassword,
            riderId: uniqueId
        });

        // Generate rider token
        const riderToken = jwt.sign({
            riderId: rider._id,
            riderEmail: rider.riderEmail,
            riderPhoneNumber,
            riderFirstName,
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
        // Check if the identifier is an email or rider ID
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        const isRiderId = /^[a-zA-Z0-9]{6}$/.test(identifier);

        if (!isEmail && !isRiderId) {
            return res.status(400).json({
                message: 'Invalid identifier. Please use a valid rider email or rider ID.'
            });
        }

        let rider;

        // Find rider by email or rider ID
        if (isEmail) {
            rider = await riderModel.findOne({ riderEmail: identifier.toLowerCase() });
        } else if (isRiderId) {
            rider = await riderModel.findOne({ riderId: identifier });
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
                message: 'Invalid password. Please enter the correct password.'
            });
        }

        // Sign JWT token
        const riderToken = jwt.sign({
            riderId: rider._id,
            riderEmail: rider.riderEmail,
            riderPhoneNumber: rider.riderphoneNumber,
            riderAssignedPackages: rider.riderAssignedpackages // Assuming you have this field defined
        }, process.env.jsonSecret, { expiresIn: '1d' });

        // Return success message and rider data
        return res.status(200).json({
            message: `Welcome ${rider.riderFirstName}, feel free to carry out fast and reliable operations with our application`,
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
        res.redirect(`https://the-track-it.vercel.app/riderlogin`)
      }
  
      // update the user verification
      rider.isVerified = true;
  
      // save the changes
      await rider.save();
  
      // update the user's verification status
      const updatedRider = await riderModel.findOneAndUpdate({ riderEmail }, rider);
     
    // if(company.isVerified === true){
    //  return res.status(200).send(generateLoginCss, `<script>setTimeout(()=>{window.location.href = 'https://the-track.it.vercel.app/login' ;}, 2000); </script>`);
    // }
        res.redirect( `https://the-track-it.vercel.app/riderlogin` );
     
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


const NodeGeocoder = require('node-geocoder');
const http = require("http")
const ipLocation = require("iplocation")


const geoCoderOption ={
    provider:"openstreetmap"
  }
  const geocoder = NodeGeocoder(geoCoderOption);

function getSystemIpAddress() {
    return new Promise((resolve, reject) => {
        // Make an HTTP request to a service that echoes back the client's IP address
        const request = http.get('http://ipinfo.io/ip', (response) => {
            let ipAddress = '';

            // Concatenate chunks of data to get the complete response
            response.on('data', (chunk) => {
                ipAddress += chunk;
            });

            // Once the response is complete, resolve the promise with the IP address
            response.on('end', () => {
                resolve(ipAddress.trim());
            });
        });

        // Handle errors
        request.on('error', (error) => {
            reject(error);
        });
    });
}

exports.getRiderLocation = async (req, res) => {
  try {
    const {riderId} = req.rider
    const rider = await riderModel.findById(riderId)

    if (!rider) {
        return res.status(400).json({
          error: "rider not found"
        });
      }
      if (rider.isVerified !== true) {
        return res.status(400).json({
          error: "oops!! can't perform action, rider not verified"
        });
      }

    const ipAddress = await getSystemIpAddress();
      
    //    console.log(ipAddress);
      const location = await ipLocation(ipAddress);
        // console.log("Geocoding result:", location);

    const geocodeResult = await geocoder.reverse({lat:location.latitude, lon:location.longitude},(error, result)=>{
      if(error){
       res.status(400).json({
         message:`Can't reverse the data`
       })
      }else{
       return result
      }
    })

    const riderAddress =  geocodeResult[0].formattedAddress
    rider.riderLocation = riderAddress
    console.log(riderAddress);

    for (const package of rider.riderPackages) {
        package.location = riderAddress;
        await package.save();
    }
 
     
    // Save the location to the database
    await rider.save();

    // Respond with a success message
    res.status(200).json({
         message: 'rider location updated successfully',
        riderAddress,

         });
  } catch (err) {
    // Handle errors and respond with an error message
    res.status(500).json({ message: err.message });
    console.error('Geocoding error:', err.message);
  }
};
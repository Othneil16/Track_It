const cloudinary = require('cloudinary').v2;
const dotenv = require("dotenv")
          
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.cloudApi_key, 
  api_secret: process.env.cloudApi_secret
});


module.exports = cloudinary; 
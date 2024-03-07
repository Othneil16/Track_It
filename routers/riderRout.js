
const { verifyRiderEmail, riderSignIn, createRider, getRiderLocation,} = require("../controllers/riderCont")
const { companyauthenticate } = require("../middleware/companyAuth")
const multer = require('../imagesutils/multer');
const { riderauthenticate } = require("../middleware/riderAuth");
// const upload = require("../imagesutils/fileUpload");

const riderRouter = require("express").Router()

// riderRouter.post('/company/rider/create', multer.single('profileImage'),companyauthenticate, createRider)

riderRouter.post('/company/rider/signUp', companyauthenticate, createRider)

riderRouter.post("/company/rider/SignIn", riderSignIn)

riderRouter.get( "/company/rider/verify-email/:riderToken",verifyRiderEmail)
  
riderRouter.get('/rider/getlocation',riderauthenticate, getRiderLocation);


module.exports = riderRouter

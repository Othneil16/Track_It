
const { verifyRiderEmail, riderSignIn, createRider,} = require("../controllers/riderCont")
const { companyauthenticate } = require("../middleware/companyAuth")
const multer = require('../imagesutils/multer');
// const upload = require("../imagesutils/fileUpload");

const riderRouter = require("express").Router()

// riderRouter.post('/company/rider/create', multer.single('profileImage'),companyauthenticate, createRider)

riderRouter.post('/company/rider/signUp', companyauthenticate, createRider)

riderRouter.post("/company/rider/SignIn", riderSignIn)



riderRouter.get( "/company/rider/verify-email/:riderToken",verifyRiderEmail)
  

module.exports = riderRouter

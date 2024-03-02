
const { verifyRiderEmail, createRider, riderSignIn } = require("../controllers/riderCont")
const { companyauthenticate } = require("../middleware/companyAuth")
const upload = require('../imagesutils/multer');

const riderRouter = require("express").Router()

riderRouter.post("/company/rider/SignUp",companyauthenticate, upload.single('profileImage'), createRider)

riderRouter.post("/company/rider/SignIn", riderSignIn)



riderRouter.get( "/company/rider/verify-email/:riderToken",verifyRiderEmail)
  

module.exports = riderRouter

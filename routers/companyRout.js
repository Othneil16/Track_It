const { createCompany, companySignIn, companyVerifyEmail, getACompanyRiders } = require("../controllers/companyCont")
const { companyauthenticate } = require("../middleware/companyAuth")

const companyRouter = require("express").Router()

companyRouter.post("/company/SignUp", createCompany)
companyRouter.post("/company/SignIn", companySignIn)

companyRouter.get( "/company/verify-email/:companyToken", companyVerifyEmail)

companyRouter.get( "/company/allriders", companyauthenticate, getACompanyRiders)


module.exports = companyRouter

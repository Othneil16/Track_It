const { createCompany, companySignIn, companyVerifyEmail, getACompanyRiders, getCompanyPendingPackages, getCompanyPackages, getCompany, assignPackageToRider, assignToRider} = require("../controllers/companyCont")
const { companyauthenticate } = require("../middleware/companyAuth")

const companyRouter = require("express").Router()

companyRouter.post("/company/SignUp", createCompany)
companyRouter.post("/company/SignIn", companySignIn)

companyRouter.get( "/company/verify-email/:companyToken", companyVerifyEmail)

companyRouter.get( "/company/allriders", companyauthenticate, getACompanyRiders)

companyRouter.get("/company/allpendingpackages",companyauthenticate, getCompanyPendingPackages)

companyRouter.get("/company/allpackages",companyauthenticate, getCompanyPackages)

companyRouter.get("/company", companyauthenticate, getCompany), 


// companyRouter.put("/company/assigntorider/:riderId/:packageId", companyauthenticate, assignToRider), 


companyRouter.put("/company/assigntorider/:riderMid/:packageMid", companyauthenticate, assignToRider), 

module.exports = companyRouter

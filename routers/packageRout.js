const { createNewPackage, createPackage, packageDestination } = require("../controllers/packageCont");
const { companyauthenticate } = require("../middleware/companyAuth");

const packageRouter = require("express").Router()

packageRouter.post("/user/createpackage", companyauthenticate, createPackage)

packageRouter.post("/company/createpackage", companyauthenticate, createNewPackage)
  
packageRouter.put("/company/updatepackagedestination/:packageId", companyauthenticate, packageDestination)
module.exports = packageRouter

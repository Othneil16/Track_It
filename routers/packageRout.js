const { createNewPackage, createPackage } = require("../controllers/packageCont");
const { companyauthenticate } = require("../middleware/companyAuth");

const packageRouter = require("express").Router()

packageRouter.post("/user/createpackage", companyauthenticate, createPackage)

packageRouter.post("/company/createpackage", companyauthenticate, createNewPackage)
  

module.exports = packageRouter

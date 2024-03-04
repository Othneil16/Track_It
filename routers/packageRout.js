const { createNewPackage } = require("../controllers/packageCont");
const { companyauthenticate } = require("../middleware/companyAuth");

const packageRouter = require("express").Router()

packageRouter.post("/user/createpackage", companyauthenticate, createNewPackage)

  

module.exports = packageRouter



const { userAuthenticate } = require("../middleware/userAuth");
const { createNewPackage } = require("../controllers/packageCont");

const packageRouter = require("express").Router()

packageRouter.post("/user/createpackage/:companyId", userAuthenticate, createNewPackage)

  

module.exports = packageRouter

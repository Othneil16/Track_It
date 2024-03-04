

const { userAuthenticate } = require("../middleware/userAuth");
const { createNewPackage } = require("../controllers/packageCont");

const packageRouter = require("express").Router()

packageRouter.post("/user/createpackage/", userAuthenticate, createNewPackage)

  

module.exports = packageRouter

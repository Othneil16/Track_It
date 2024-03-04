const express = require('express');
const fileUpload = require('express-fileupload');

const upload = express.Router();

upload.use(fileUpload());

module.exports = upload;

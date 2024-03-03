const mongoose = require('mongoose');

const revokedCompanyTokenSchema = new mongoose.Schema({
  token: String,
  revokedAt: { 
    type: Date, 
    default: Date.now
 }
});

const revokedCompanyTokenModel = mongoose.model('RevokedCompanyToken', revokedCompanyTokenSchema);

module.exports = revokedCompanyTokenModel;
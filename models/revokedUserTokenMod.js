const mongoose = require('mongoose');

const revokedUserTokenSchema = new mongoose.Schema({
  token: String,
  revokedAt: { 
    type: Date, 
    default: Date.now
 }
});

const revokedUserTokenModel = mongoose.model('RevokedUserToken', revokedUserTokenSchema);

module.exports = revokedUserTokenModel;
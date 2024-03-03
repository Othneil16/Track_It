const mongoose = require('mongoose');

const revokedRiderTokenSchema = new mongoose.Schema({
  token: String,
  revokedAt: { 
    type: Date, 
    default: Date.now
 }
});

const revokedRiderTokenModel = mongoose.model('RevokedRiderToken', revokedRiderTokenSchema);

module.exports = revokedRiderTokenModel;
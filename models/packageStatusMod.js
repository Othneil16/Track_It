const mongoose = require('mongoose')

const packageStatusSchema = new mongoose.Schema({
    statusDesc:{
        type:String,
        require: true
    },
    packages:[{
      type: mongoose.SchemaTypes.ObjectId,
        ref:"packages"
    }],
    
    
},{timestamp:true})

const packageStatusModel = mongoose.model("packageStatus", packageStatusSchema)

module.exports = packageStatusModel
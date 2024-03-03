const mongoose = require('mongoose')
const packageSchema= new mongoose.Schema({
    packageName:{
        type:String,
        require:true,
        unique:true
    },
    packageWeight:{
        type: String,
        require:true
    },
    departure:{
        type: String,
        require:true,
        unique:true
    },
    destination:{
        type: String,
        require:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    },
    packageId:{
        type: String,
        require:true,
        unique:true
    },
    delivered:{
        type:Boolean,
        default:false
    },
    status:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "packageStatus", 
    },
    
},{timestamp:true})

const packageModel = mongoose.model("packages", packageSchema)
module.exports = packageModel
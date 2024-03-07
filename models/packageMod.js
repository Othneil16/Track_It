const mongoose = require('mongoose')
const packageSchema= new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'assigned','delivered'],
        default: 'pending'
    },
    packageName:{
        type:String,
        require:true,
        unique:true
    },
    packageWeight:{
        type: Number,
        require:true
    },
    departure:{
        type: String,
        require:true,
    },
    destination:{
        type: String,
    },
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User", 
    // },
    packageId:{
        type: String,
        require:true,
        unique:true
    },
    delivered:{
        type:Boolean,
        default:false
    },
    location:{
        type:String
    }
    
},{timestamp:true})

const packageModel = mongoose.model("packages", packageSchema)
module.exports = packageModel
const mongoose = require('mongoose')
const companySchema = new mongoose.Schema({
    companyName:{
        type: String,
        require:true
    },
    companyEmail:{
        type: String,
        require:true,
        unique:true
    },
    companyPhoneNumber:{
        type: String,
        require:true
    },
    companyPassword:{
        type: String,
        require:true
    },
    companyAddress:{
        type: String,
        require:true
    }, 
    isVerified:{
        type:Boolean,
        default:false
    },
    companyRiders:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"riders",
    }],
    companyPackages:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"packages",
    }],
    companyUsers:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"User",
    }],
    pendingPackages:[{
        
    }]
},{timestamp:true})

const companyModel = mongoose.model("Company", companySchema)
module.exports = companyModel
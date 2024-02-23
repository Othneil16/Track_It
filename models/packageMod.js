const mongoose = require('mongoose')
const packageSchema= new mongoose.Schema({
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
    
},{timestamp:true})

const companyModel = mongoose.model("packages", packageSchema)
module.exports = companyModel
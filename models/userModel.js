const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require:true
    },
    lastName:{
        type: String,
        require:true
    }, 
    profileImage:{
         type: String,
         require:true
     }, 
    phoneNumber:{
        type: String,
        require:true,
        unique:true
    },
    email:{
        type: String,
        require:true,
        unique:true
    },
    password:{
        type: String,
        require:true
    },
    userId:{
        type: String,
        required:true
    },
    packages:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"packages",
    }],
    
},{timestamp:true})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel
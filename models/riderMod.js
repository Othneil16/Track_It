const mongoose = require('mongoose')
const riderSchema = new mongoose.Schema({
    riderFirstName:{
        type: String,
        require:true
    },
    riderlastName:{
        type: String,
        require:true
    }, 
    riderprofileImage:{
         type: String,
         require:true
     }, 
    riderphoneNumber:{
        type: String,
        require:true,
        unique:true
    },
    riderAddress:{
        type: String,
        require:true,
    },
    riderEmail:{
        type: String,
        require:true,
        unique:true
    },
    riderPassword:{
        type: String,
        require:true
    },
    riderId:{
        type: Default,
        require:true
    },
    riderpackages:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"packages",
    }],
    riderLocation:{
        type: String,
        require:true
    }
    
},{timestamp:true})

const riderModel = mongoose.model("riders", riderSchema)
module.exports = riderModel
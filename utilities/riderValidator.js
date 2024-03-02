const joi = require("joi")

const riderValidate = joi.object({
    riderFirstName:joi.string()
    .min(3)
    .max(15),
    
    riderLastName:joi.string()
    .min(3)
    .max(15),

    riderEmail:joi.string()
    .email({
        minDomainSegments:2, 
        tlds:{allow: ['com','net','ng']}
    }),
    
    
    riderAddress:joi.string()
    .min(3)
    .max(55),

    riderPhoneNumber:joi.string()
    .pattern(new RegExp('^[0-9]'))
    .min(11)
    .max(11),

    riderPassword:joi.string()
    .pattern(new RegExp('^[0-9]')).min(6).max(6),

    confirmRiderPassword:joi.string()
    .pattern(new RegExp('^[0-9]')).min(6).max(6),


  
})

module.exports= {riderValidate}
const joi = require("joi")

const userValidate = joi.object({
    packageWeight:joi.string()
    .min(3)
    .max(15),
    
    userlastName:joi.string()
    .min(3)
    .max(15),

    userEmail:joi.string()
    .email({
        minDomainSegments:2, 
        tlds:{allow: ['com','net','ng']}
    }),
  
    userPhoneNumber:joi.string()
    .pattern(new RegExp('^[0-9]'))
    .min(11)
    .max(11),

    userPassword:joi.string()
    .pattern(new RegExp('^[0-9]')).min(6).max(6),

    confirmUserPassword:joi.string()
    .pattern(new RegExp('^[0-9]')).min(6).max(6),


  
})

module.exports= {userValidate}
const joi = require("joi")
const companyValidate = joi.object({
    companyName:joi.string()
    .min(3)
    .max(15),

    companyEmail:joi.string()
    .email({
        minDomainSegments:2, 
        tlds:{allow: ['com','net','ng']}
    }),
  
    companyPhoneNumber:joi.string()
    .pattern(new RegExp('^[0-9]'))
    .min(11)
    .max(11),

    companyAddress:joi.string()
    .min(3)
    .max(55),

    companyPassword: joi.string().pattern(
    new RegExp('^(?=.*[A-Za-z]{9})(?=.*[0-9]{2})(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{12,}$')
    ).message('Password must contain at least 9 alphabets, 2 numbers, and 1 special character').required(),

    confirmCompanyPassword: joi.string().pattern(
    new RegExp('^(?=.*[A-Za-z]{9})(?=.*[0-9]{2})(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{12,}$')
     ).message('Password must contain at least 9 alphabets, 2 numbers, and 1 special character').required(),

  
})

module.exports= {companyValidate}
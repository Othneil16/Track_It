const companyModel = require('../models/companyMod');
const bcrypt = require("bcrypt") 
const jwt = require("jsonwebtoken")
const {companyValidate} = require('../utilities/companyValidator')
const nodemailer = require("nodemailer");
const { companydynamicMail } = require('../helpers/companyMailHtml');


// create a nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
      secure: false
    }   
  });
  

exports.createCompany = async(req, res)=>{
try {
    const {companyName, companyEmail, companyPhoneNumber, companyPassword, companyAddress, confirmCompanyPassword} = req.body

    await companyValidate.validateAsync(req.body,(err,data)=>{
        if (err) {
            return res.json("Validation Failed", err.message)
        } else {
            return  res.json(data) 
        }
    }
    )
    if (confirmCompanyPassword !== companyPassword) {
        return res.status(404).json({
        message:`incorrect Password, pls type-in a correct password that match`
        })
     }  
    
     
     const saltedRound  = bcrypt.genSaltSync(10)
     const hashedCompanyPassword = bcrypt.hashSync(companyPassword,saltedRound )

     const company = await new companyModel({
        companyName:companyName.toUpperCase(),
        companyPhoneNumber, 
        companyAddress,
        companyEmail: companyEmail.toLowerCase(),
        companyPassword: hashedCompanyPassword,
      })
    
      const companyToken = jwt.sign({
        companyId: company._id,
        companyEmail: company.companyEmail,
        companyRiders: company.companyRiders,
        companyPackages: company.companyPackages,
        companyName: company.companyName
        },process.env.jsonSecret,
        { expiresIn: "50m" }
    );
      
    // Sending a verification email to the user
    const subject = 'Kindly verify your company account';

    const link = `${req.protocol}://${req.get('host')}/api/v1/company/verify-email/${companyToken}`;

    const html = companydynamicMail(companyName.toUpperCase(), link);

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: companyEmail,
        subject,
        html
    }; 

    await transporter.sendMail(mailOptions)
    const savedCompany = await company.save()
        
       
        return res.status(201).json({
        message: `Congratulations!!!, your company ${company.companyName} is successfully created. Kindly Check your email: ${savedCompany.companyEmail} to verify your account on our platform inorder TO ENJOY GOOD TRACKING SERVICES!`,
        savedCompany

    })
}catch(err){
        return res.status(500).json({
            error:err.message
        })
    }
}

exports.companySignIn = async (req, res) => {
    
    const {identifier, companyPassword } = req.body;    
    try {
        // Check if the identifier is an email or accountNumber 
        const isEmail = /\S+@\S+\.\S+/.test(identifier);
        const isPhoneNumber = /^\d{11}$/.test(identifier);
        
        if (!isEmail && !isPhoneNumber) {
            return res.status(400).json({
                message: 'Invalid identifier. Please use a valid email or account number.'
            });
        }

        const company = await companyModel.findOne({
            $or: [
                { companyEmail: isEmail ? identifier.toLowerCase() : '' },
                { companyPhoneNumber: isPhoneNumber ? identifier : '' }
            ]
        });
        //    checking the user in the dataBase
        if (!company) {
            return res.status(404).json({
                message: 'company not found'
            });
        }
           // comparing the user's password to that coming from the req.body 
        const comparePassword = bcrypt.compareSync(companyPassword, company.companyPassword);

        if (!comparePassword) {
            return res.status(400).json({
                message: 'Invalid password. Please type-in a correct password.'
            });
        }
            //   push the user's details to the jwt token
        const companyToken = jwt.sign({
            companyId: company._id,
            companyEmail: company.companyEmail,
            companyRiders: company.companyRiders,
            companyPackages: company.companyPackages,
            companyName: company.companyName
            }
            , process.env.jsonSecret, { expiresIn: '1d' });
             

            // return the success message and the user's data
        return res.status(200).json({
            message: `Welcome ${company.companyName}, Feel free to carry out fast and reliable tracking operations with our application`,
            companyToken,
            company
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}


// verify email
exports.companyVerifyEmail = async (req, res) => {
    try {
      const { companyToken } = req.params;
  
      // verify the token
      const { companyEmail } = jwt.verify(companyToken, process.env.jsonSecret);
  
      const company = await companyModel.findOne({ companyEmail });
  
      // Check if user has already been verified
      if (company.isVerified) {
        return res.status(400).json({
          error: "Company already verified"
        });
      }
  
      // update the user verification
      company.isVerified = true;
  
      // save the changes
      await company.save();
  
      // update the user's verification status
      const updatedCompany = await companyModel.findOneAndUpdate({ companyEmail }, company);
     
    // if(company.isVerified === true){
    //  return res.status(200).send(generateLoginCss, `<script>setTimeout(()=>{window.location.href = 'https://the-track.it.vercel.app/login' ;}, 2000); </script>`);
    // }
        res.status( 200 ).redirect( `${ process.env.BASE_URL }/login` );
     
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
  
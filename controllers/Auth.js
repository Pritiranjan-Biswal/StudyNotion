const User= require("../models/User")

const OTP=require("../models/OTP")

const otpGenerator=require("otp-generator")

exports.sendOTP= async(req, res) => {

    try{
            //fetch email
        const {email}=req.body;
        //check if user already exist

        const checkUserPresent= await User.findOne({email});

        //if user exist, then return a response
        if(checkUserPresent) {
            return res.status(400).json({
                success:true,
                message:"User already registered"
            })
        }
        //generate otp

        var otp=otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabetsfalse,
            specialChars:false
        });
        console.log("otp generated", otp);

        //check unique otp or not
        const result=await OTP.findOne({otp:otp});
        while(result) {
            otp=otpGenerator(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabetsfalse,
                specialChars:false
            })
            result=await OTP.findOne({otp:otp});
        }
        
    }
    catch(error) {

    }

}
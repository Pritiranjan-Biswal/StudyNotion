const User= require("../models/User")

const OTP=require("../models/OTP")

const otpGenerator=require("otp-generator");
const { bcrypt } = require("bcrypt");
const jwt=require("jsonwebtoken")

require("dotenv").config();

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
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("otp generated:- ", otp);

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
        const otpPayload={email, otp};

        //create an entry for otp in db

        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successful

        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp
        })
        
        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }

};

//signup

exports.signUp=async (req, res) => {
    try{
        //data fetch from req.body

    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber, 
        otp
    } = req.body;

    //validate the data
    if(!firstName || !lastName ||!email || !password || !confirmPassword || !otp ) {
        return res.status(403).json({
            success:false,
            message:"All fields are required"
        })
    }
    //2 password match krlo
    if(password !==confirmPassword) {
        res.status(400).json({
            success:false,
            meassage:"Password & ConfirmPassword value does not match, please try again"
        })
    }
    //check user already exist or not

    const existingUser= await User.findOne({email})
    if(existingUser) {
        return res.status.json({
            success:false,
            meassage:"User is already registered"
        })
    }

    //find most recent otp for the user

    const recentOtp=(await OTP.find({email})).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    
    //validate  the otp
    if(recentOtp.length==0) {
        return res.status(400).json({
            success:false,
            message:"otp not found"
        })
    } else if(otp !==recentOtp) {
        return res.status(400).json({
            success:false,
            message:"Invalid otp"
        })
    }

    //hash the password

    const hashedPassword = await bcrypt.hash(password,10);
    //entry created in the db

    const profileDetails= await Profile.create({
        gender:null,
        dataOfBirth:null,
        about:null,
        contactNumber:null
    })

    const user=await user.create({
         firstName,
        lastName,
        email,
        contactNumber, 
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    //return res
    return res.status(200).json({
        success:true,
        message:"user is registered successfully"
    })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"user can not be registered, Please try again"
        })        
    }
}

//login

exports.login =async(req, res) => {
        try{
            //get data from reqbody
            const {email, password}=req.body;

            //validation the data
            if(!email || !password) {
                return res.status(403).json({
                    success:false,
                    message:"All fields are required, Please try again"
                })
            }

            //check the user
            const  user =await User.findOne({email}).populate("additionalDetails");
            if(!user)  {
                return res.status(401).json({
                    success:false,
                    message:"user is registered, please signup first"
                })
            }
            //generate jwt, after password matching
            if(await bcrypt.compare(password, user.password)) {
                const payload={
                    email:user.email,
                    id:user._id,
                    accountType:user.accountType
                }
                const token =jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn:"2h"
                });
                user.token=token;
                user.password=undefined;

                //create a cookie and send a cookie
                const options={
                    expires:new Date(Date.now()+3*24*60*60*1000),
                    httpOnly:true,
                }
                res.cookie("token", token, options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:"Logged in successfully"
                })
            }
            else {
                return res.status(401).json({
                    success:false,
                    message:"Password is incorrect"
                })
            }
            
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Login Failure, please try again"
            })
            
        }
    }

    //change password

exports. ChangePassword = async(req, resp) => {
    try{
        //get data from request ki body
        //get email,old password, new password,confirm new passsword
        const {email,oldpassword, newpassword, confirmnewpassword} = req.body;
        //validation
        if(!email || !oldpassword || !newpassword){
            return resp.status(403).json({
                success:false,
                message:'all fields are required'
            })
        }
        //fetch the user object from db and match the old password we got from request with the actual password of the user
        const existingUser = await User.findOne({email:email});
        //ek baar ye check karna hai ki kya user bina registet hue password change karne jaa sakta hai

        const isMatch = await bcrypt.compare(oldpassword, existingUser.password);
        if(!isMatch){
            return resp.status(403).json({
                success:false,
                message:'incorrect old password'
            })
        }
       // checking wheather the newpassword and confirmpassword entered by the user is smae or not
        if(newpassword!== confirmnewpassword){
            return resp.status(403).json({
                success:false,
                message:'new password and confirm password do not match'
            })
        }
        
        //update  pwd in db by hashing it
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();

        //send mail about the updated password
        sendEmail(email, 'Your Password for this account has been updated in StudyNotion.. Your new Password is:- ',newpassword );

        //return succes response
        resp.status(200).json({
            success:true,
            message:'password changed successfully'
        })
        
    }catch(err){
      console.log('error occured while changing the password')
      console.error(err.message);
      resp.status(500).json({
        success:false,
        message:'internal server error during changing the password'
      })

    }
}
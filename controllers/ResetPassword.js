const { response } = require("express");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");


//reset password token
exports.resetPasswordToken=async(req, res) => {
    
    try{
        //get email from user body
    const email=req.body.email;
    //check user for this email, email validation
    const user= await User.findOne({email:email});
    if(!user) {
        return res.json({
            success:false,
            message:"Your email is not registered with us"
        })
    }
    //generate token 
    const token= crypto.randomUUID();
    //update user by adding token & expiration time
    const updatedDetails=await User.findOneAndUpdate(
                                    {email:email},
                                    {
                                        token: token,
                                        resetPasswordExpires: Date.now()+5*60*1000
                                    },
                                    {new:true})
    //create url
    const url=`http://localhost:3000/update-password/${token}`                                

    //send mail containing the url

    await mailSender(email, 
                     "Password Reset Link",
                    `Password Reset Link:${url}`)
    // return response
    return res.json({
        success:true,
        message:"email sent successfully"
    })

    }
    catch(error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Somthing went wrong while reset the password"
        })
    }
}

//reset password
exports.resetPassword=async(req, res) => {
    try{
        //data fetch
    const {password, confirmPassword, token} = req.body;
    //validation
    if(password !==confirmPassword) {
        return res.json({
            success:false,
            message:"password not matching"
        })
    }
    //get user details from db using token
    const userDetails=await user.findOne({token:token})
    //if no entry-invalid token
    if(!userDetails) {
        res.json({
            success:false,
            message:"Token is invalid"
        })
    }
    //token time check
    if(userDetails.resetPasswordExpires >Date.now()) {
        return res.json({
            success:false,
            message:"Token is expired, please regenerate your token"
        })
    }
    //hash password
    const hashedPassword=await bcrypt.hash(password, 10);
    // update password
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true}
    );
    //return response
    return res.status(200).json({
        success:true,
        message:"Password reset successfully"
    })
    }
    catch(error) {
        return res.status(401).json({
            success:false,
            message:""
        })
    }
}
const mongoose=require("mongoose")



const OTPSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:String,
        default:date.now(),
        expires:5*60
    }
})

module.exports=mongoose.model("OTP", OTPSchema)
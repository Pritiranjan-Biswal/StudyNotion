const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");



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


//create a function

async function sendVerificationEmail(email, otp) {
    try{
        const mailResponse=await mailSender(email, "verification Email from StudyNotion", otp);
        console.log("Email sent successfully", mailResponse);
        
    }
    catch(error) {
        console.log("error occurred sending mail:", error);
        throw error;      
    }
}
OTPSchema.pre("save", async function(next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports=mongoose.model("OTP", OTPSchema)
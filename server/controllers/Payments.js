const {instance}= require("../config/razorpay")

const Course= require("../models/Course")

const User= require("../models/User")

const mailSender= require("../utils/mailSender")

const {courseEnrollmentEmail}= require("../mail/templates/courseEnrollmentEmail")
const { default: mongoose } = require("mongoose")


require('dotenv').config();

//capture the payment and initiate the razorpay

exports.capturePayment= async(req, res) => {
    //get userId and courseId
    const {course_id}=req.body;
    const userId= req.user.id;
    //validation

        //validCourseId
    if(!course_id) {
        return res.json({
            success:false,
            message:"Please provide valid course id"
        })
    }

    //valid courseDetail
    let course;
    try{
        course= await Course.findById(course_id)
        if(!course_id) {
            return re.json({
                success:false,
                message:"Could not find the course"
            })
        }
        //user already pay for the course

        const uid= new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled"
            })
        }
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
    
    
    //order create
    const amount=course.price;
    const currency="INR";

    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }

    }
    try{
        //initiate the payment using razorpay
        const paymentResponse= await  instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDesciption:course.courseDescription,
            thumbnaul:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.payments
        })
        
    }
    catch(error) {
        console.log(error);
        return res.json({
            success:false,
            message:"Could not initiate order"
        })
        
    }
   

}

//verify signature
exports.verifySignature = async (req, res) => {
    const webhookSecret= "12345678";

    const signature=req.headers("x-razorpay-signature");

    const shasum=crypto.createHmac("sha256", webhookSecret);

    shasum.update(JSON.stringify(req.body));

    const digest= shasum.digest("hex");
   
   if(signature === digest) {
    console.log("Payment is Authorized");

    const {courseId, userId}= req.body.payload.payment.entity.notes;

     try{
        //fulfill the action

        //find the course and enroll the student int it
        const enrolledCourse= await Course.findOneAndUpdate(
                                                {_id:courseId},
                                                {$push:{studentsEnrolled:userId}},
                                                {new:true}) 
             if(!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message:"course not found"
                })
             }      
        console.log(enrolledCourse);

        // find the student and add the course to their list enrolled course 

        const enrolledStudent= await User.findOneAndUpdate(
            {_id:id},
            {$push:{courses:courseId}},
            {new:true},
        )
        console.log(enrolledStudent);
        
        //mail sending
        
        const emailResponse= await mailSender(
            enrolledStudent.email,
            "Congratulatons from codeHelp",
            "Congratulations you are onboarded into new CodeHelp Course",

        )
        console.log(emailResponse);

        return res.status(200).json({
            success:true,
            message:"Signature verified and course Added"
        })
        
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
   }
   else {
    return res.status(400).json({
        success:false,
        message:"invalid request"
    })
   }
   
   
}
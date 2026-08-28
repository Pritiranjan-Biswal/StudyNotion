const Course=require("../models/Course")

const Tag= require("../models/Category")

const User=require("../models/User")

const {uploadImageToCloudinary}=require("../utils/imageUploader");

//create course ka handler function

exports.createCourse= async(req, res) => {
    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        //get thumbnail
        const thumbnail=req.files.thumbnailImage;


        //validation start
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            res.staus(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //check for instructor
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);
        console.log("instructor Details: ", instructorDetails);

        //todo verify that userId and instructorDetails._id are same or different

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:"Instructor Details not found"
            })
        }
        //check given tag is valid or not

        const tagDetails=await Tag.findById(tag);
         if(!tagDetails) {
            return res.status(404).json({
                success:false,
                message:"tagDetails  not found"
            })
        }
        //upload image to cloudinary

        const thumbnailImage=await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse= await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLear : whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,

        })

        //add the new course to the user Schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )
        //update the tag schema




        //hw



        return res.status(200).json({
            success:false,
            message:"Course created successfully.",
            data:newCourse
        })
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create course',
            error:error.message
        })
    }
}











//getAll course ka handler function

exports.showAllCourses= async(req, res) => {
    try{
        //todo : change the  below statement increamently
        const allCourses= await Course.find({})
                                            
                return res.status(200).json({
                    success:true,
                    message:"Data for all courses fetched successfully.",
                    data:allCourses
                })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            mmessage:"Can not fetch course data",
            error:error.message
        })        
    }
}


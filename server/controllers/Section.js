const Section= require("../models/Section")

const Course= require("../models/Course")
const { response } = require("express");
const SubSection = require("../models/SubSection");

exports.createSection = async(req, res) => {
    try{
        //data fetch 
        const {section, courseId}= req.body;
        
        //validation daata
        if(!section || !courseId) {
            return res.status(400).json({
                success:false,
                message:"Missing properties"
            })
        }

        //create section
        const newSection =await Section.create({sectionName})

        //update then course with section objectId
        const updatedCourseDetails= await  Course.findByIdAndUpdate(courseId, {
                                                            $push:{
                                                                courseContent:newSection._id,
                                                            }
                                                            }, {new:true}).populate ({path:"courseContent", populate:{path:SubSection}  }).exec()

        // return response
        return res.status(200).json({
            success:true,
            message:"Section created Successfully",
            updatedCourseDetails
        })
    }
    catch(error) {
            return res.status(500).json({
                success:false,
                message:"unable to create the  section."
            })
    }
}


exports.updatedSection= async(req, res) => {
    try{
        //data input 
        const {sectionName, courseId, sectionId}= req.body;
    

        //data validation
        if(!sectionName || !courseId || !sectionId) {
            return res.status(400).json({
                success:false,
                message:"All field are need to fulfill"
            })
        }

        //update the data
        const section = await section.findByIdAndUpdate(sectionId, {sectionName}, {new:true})

        //so once the section is upadted the course containibng the section should be updated
        const updatedCourse= await Course.findById(courseId).populate ({path:"courseContent", populate:{path:SubSection}  }).exec()

        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"unable to updated the section",
            message:error.message
        })
    }
}


exports.deleteSetion= async(req, res) => {
    try{
        //fetch the data from req body
        const {sectionId}= req.body;

        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        
        //TODO:-  we need to delete the entry from the course schema

        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted Successfully"
        })
    }
    catch(error) {
        return res.staus(500).json({
            success:false,
            message:"Unable to delete the section",
            error:error.message
        })
    }
}
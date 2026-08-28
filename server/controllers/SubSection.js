const SubSection= require("../models/SubSection")
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
//create subsection logic

exports.createSubSection = async(req, res)=> {
    try{
        //fetch data 
        
        const {sectionId, title, timeDuration, description}= req.body;

        //extract filevideo
        const video= req.files.videoFile;

        //validation
        if(!sectionId || !title || !timeDuration || !description ||!video) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //upload video to cloudinary
        const uploadDetails= await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        //create a subsection
        const subSectionDetails= await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //update the section with the subSectio objectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                                {$push:{
                                                                    subSection:subSectionDetails._id
                                                                }}, {new:true}).populate('SubSection').exec();
                                    //  HW: log updated section here, after adding populate query                       
                                                            
                                                            

        //return response

        return res.status(200).json({
            success:true,
            message:"Sub section created successfully"
        })
    } 
    catch(error) {
        return res.status(500).json({
            success:false,
            messsge:"Internal server error",
            error:error.message
        })
    }
}


//HomeWork:- updateSection

exports.updateSubSection= async (req, res) => {
    try{
        //fetch the data from req ki body
        const {title, timeDuration, description}= req.body;

        //validate it
        if(!title || ! timeDuration || !description) {
            return res.status(401).json({
                success:false,
                message:"All fire;d are required to bel fulfilled"
            })
        }
        //update the subsection
        const updatedSubsection = await  SubSection.findByIdAndUpdate({title, description, timeDuration}, {new:true})

        //return res
        return res.status(200).json({
            success:true,
            message:"subsection updtaed successfully"
        })
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"internal server error",
            error:error.message
        })
    }
}



//deleteSection



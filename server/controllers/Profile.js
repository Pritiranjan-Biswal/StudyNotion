const Profile= require("../models/Profile");
const User= require("../models/User")

exports.updateProfile = async (req, res) => {
    try{
        //get data
        const {dateofBirth="", about="", contactNumber, gender}= req.body;

        //get UserId
        const id= req.user.id;

        //validate it 
        if(!contactNumber ||  !gender || !id) {
            return res.status(400).json({
                success:false,
                message:"All fields are require"
            })
        }


        //find Profile
        const userDetails= await User.findbyId(id);
        const profileId= userDetails.additionalDetails;
        const profileDetails= await Profile.findById(profileId);

        //update profile
         profileDetails.dateOfBirth=dateofBirth;
         profileDetails.about=about
         profileDetails.gender=gender
         profileDetails.contactNumber=contactNumber


         await profileDetails.save();

        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated  successfully"
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

//delete account 

exports.deleteAccount = async(req, res)=> {
    try{
        //get id
        const id = req.user.id;
        //validation
        const userDetails=await User.findById(id);
        if(!userDetails) {
           return res.status(404).json({
            success:false,
            message:"user not found"
           })
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        //TODO: HW unenroll user from all enroll courses


        //user delete
        await User.findByIdAndDelete({_id:id});

        

        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })

    }
    catch(error) {
            
        }
}
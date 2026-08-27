const mongoose=require("mongoose");

const ratingAndReiewsSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        trim:true,
        ref:"User"
    },
    rating:{
        type:Number,
        required:true,
        trim:true
    },
    review:{
        type:String,
        required:true,
        trim:true
    }
})

module.exports=mongoose.model("ratingAndReiews", ratingAndReiewsSchema)
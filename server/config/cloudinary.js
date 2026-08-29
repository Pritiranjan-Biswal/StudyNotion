const cloudinary = require("cloudinary").v2; //! Cloudinary is being required

exports.cloudinaryConnect = () => {
	try {
		cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: process.env.CLOUD_NAME,
			api_key: process.env.API_KEY,
			api_secret: process.env.API_SECRET,
		});
// 		console.log("Cloudinary config:", {
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY ? "Present" : "Missing",
//     api_secret: process.env.API_SECRET ? "Present" : "Missing",
// });
	} catch (error) {
		console.log(error);
	}
};
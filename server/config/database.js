const mongoose = require("mongoose");

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("DB Connection Successful");
        })
        .catch((error) => {
            console.log("DB Connection Failed");
            console.log(error);
            process.exit(1);
        });
};
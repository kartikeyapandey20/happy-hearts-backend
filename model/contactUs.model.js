const mongoose = require("mongoose");

const ContactUs = mongoose.Schema({
    name : {
        type : String
    },
    phone : {
        type : String
    },
    message : {
        type : String
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    }
})

module.exports = mongoose.model("contactUs" , ContactUs);
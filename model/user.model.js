const mongoose = require("mongoose");

const User = mongoose.Schema({

    firstName :{
        type : String
    },
    lastName : {
        type : String
    },
    mobileNumber : {
        type : String
    },
    email : {
        type : String
    },
    child :{
        type : mongoose.Types.ObjectId,
        ref : "children"
    },
    userImage : {
        type : String,
        default : ""
    }
})

module.exports = mongoose.model("user",User);
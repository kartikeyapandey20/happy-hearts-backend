const mongoose = require("mongoose");

const Child = mongoose.Schema({
    childName : {
        type : String
    },
    status : {
        type : Number
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    }
})

module.exports = mongoose.model("children",Child,"children");
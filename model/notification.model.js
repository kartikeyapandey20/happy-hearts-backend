const mongoose = require("mongoose");

const Notification  = mongoose.Schema({
    description : {
        type : String
    },
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    }
})

module.exports = mongoose.model("notification", Notification);
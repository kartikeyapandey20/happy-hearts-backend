const mongoose = require("mongoose");

const Review = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    rating : {
        type : Number
    }
})

module.exports = mongoose.model("review" , Review);
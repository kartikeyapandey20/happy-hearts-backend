const mongoose = require("mongoose");

const UserSubscription = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    subscription : {
        type : mongoose.Types.ObjectId,
        ref : "subscription"
    },
    buyDate : {
        type : String,
    },
    expDate : {
        type : String
    }
})

module.exports = mongoose.model("userSubscription" , UserSubscription);
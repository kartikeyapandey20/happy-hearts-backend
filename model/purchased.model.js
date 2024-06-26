const mongoose = require("mongoose");

const Purchased = new mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    childId : {
        type : mongoose.Types.ObjectId,
        ref : "children"
    },
    audioId : {
        type: mongoose.Types.ObjectId, 
        ref: 'audios'
    },
    duration : {
        type : String
    },
    buyDate : {
        type : String,
    },
    expDate : {
        type : String
    },
    isFavourite :{
        type : Boolean,
        default :  false
    },
    paymentId : {
        type : String,
        require : true
    }
})

module.exports = mongoose.model('Purchased', Purchased);
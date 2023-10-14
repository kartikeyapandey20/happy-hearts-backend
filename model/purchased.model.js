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
    }
})

module.exports = mongoose.model('Purchased', Purchased);
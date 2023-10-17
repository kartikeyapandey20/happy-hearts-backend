const mongoose = require("mongoose");

const Favourite = mongoose.Schema({
    userId : {
        type : mongoose.Types.ObjectId,
        ref : "user"
    },
    childId :{
        type : mongoose.Types.ObjectId,
        ref : "children"
    },
    audioId : {
        type : mongoose.Types.ObjectId,
        ref : "audios"
    }
})

module.exports = mongoose.model("favourite" , Favourite);
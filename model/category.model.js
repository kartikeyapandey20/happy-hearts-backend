const mongoose = require("mongoose");

const Category = mongoose.Schema({
    categoryName : {
        type : String,
        required : true
    },
    audios : [
        {
            type: mongoose.Types.ObjectId, 
            ref: 'audios'
        }
    ]
})

module.exports = mongoose.model("category" , Category);
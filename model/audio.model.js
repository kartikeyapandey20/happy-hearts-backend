const mongoose = require("mongoose");

const Audio = mongoose.Schema({
    // this is the name of the audio type meaning the problem child is facing 
    audioName: {
        type: String
    },
    // this is name of the audio the story which we are about tell
    musicName: {
        type : String
    },
    audioDiscription: {
        type: String
    },
    hindiAudioUrl: {
        type: String
    },
    englishAudioUrl: {
        type: String
    },
    gujaratiAudioUrl: {
        type: String
    },
    imageUrl: {
        type: String
    },
    audioInstruction: [{
        type: String
    }
    ],
    audioPrice : {
        type : String
    },
    audioDuration  : {
        type : String
    }

})

module.exports = mongoose.model("audios", Audio);
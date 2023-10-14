const mongoose = require("mongoose");

const UserAudio=  mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      isFavourite: {
        type: Boolean,
        default: false
      },
      audioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'audio',
        required: true
      },
      subscirptions : [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'userSubscription',
        }
      ]
});

module.exports = mongoose.model("userAudio",UserAudio);
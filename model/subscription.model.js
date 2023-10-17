const mongoose = require("mongoose");
//this is not used anymore
const Subscription = new mongoose.Schema({
    subscriptionName: {
         type: String,
          required: true 
        },
    subscriptionDescription: {
         type: String 
        },
    price: {
         type: Number,
         required: true
        },
    category: [ {
        type: mongoose.Types.ObjectId,
        ref : "category"
        }],
    duration: {
        type: Number, 
        required: true 
    }
});

module.exports = mongoose.model('subscription', Subscription);
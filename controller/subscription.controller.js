const Subscription = require("../model/subscription.model");
const Category  = require("../model/category.model");
const UserSubscription = require("../model/addSubscription.model");
const mongoose = require("mongoose");










//this is not used any more


async function addSubscription(req,res){
    try {
        const { subscriptionName, subscriptionDescription, price, category, duration } = req.body;
        const categoryIds = category.map(categoryId => new mongoose.Types.ObjectId(categoryId));
    const categoryDocuments = await Category.find({_id: {$in: categoryIds}});
        const newSubscription = new Subscription({
          subscriptionName : subscriptionName,
          subscriptionDescription : subscriptionDescription,
          price : price,
          category : categoryDocuments.map(categoryDocument => categoryDocument._id),
          duration : duration
        });
    
        const savedSubscription = await newSubscription.save();
        if(savedSubscription){

          res.status(200).json({ message: 'Subscription added successfully', Data: savedSubscription });
        }else{
          return res
        .status(200)
        .json({ IsSuccess: true, Data: [], Message: "No Data Found" });
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }    
}

async function getSubscription(req,res){
  try {
    const get = await Subscription.aggregate([
        {
            $match: {
                
            },
        },
    ]);
    if (get.length > 0) {
        return res.status(200).json({
            IsSuccess: true,
            count: get.length,
            Data: get,
            Message: "Data Found",
        });
    } else {
        return res
            .status(200)
            .json({ IsSuccess: true, Data: [], Message: "No Data Found" });
    }
} catch (error) {
    return res.status(500).json({ IsSuccess: false, Message: error.message });
}
}


module.exports = {
    addSubscription,
    getSubscription,
}
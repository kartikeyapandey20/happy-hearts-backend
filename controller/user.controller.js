const User = require("../model/user.model");
const Child = require("../model/child.model");
const ContactUs = require("../model/contactUs.model");
const mongoose = require("mongoose");
const Subscription = require("../model/subscription.model");
const Category = require("../model/category.model");
const Purchased = require("../model/purchased.model");
const UserSubscription = require("../model/addSubscription.model");
const Favourite  = require("../model/favourite.model")
//this is signup api function for adding new user
async function signUp(req, res) {
    try {
        // Check if the user already exists
        const { firstName, lastName, mobileNumber, email, childName, status } = req.body;
        const userExists = await User.findOne({ mobileNumber: mobileNumber });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        // Create a new user
        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            email: email,
            child: null,
            subscription: null
        });
        // Save the new user to the database
        const savedUser = await newUser.save();
        const newChild = new Child({
            childName: childName,
            status: status,
            userId: savedUser._id
        });
        const savedChild = await newChild.save();
        // Find the user by id and update the child data
        const updatedUser = await User.findByIdAndUpdate(savedUser._id, { child: new mongoose.Types.ObjectId(savedChild._id) }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        else if (updateUser) {

            res.status(200).json({
                IsSuccess: true,
                message: 'User created successfully',
                Data: updatedUser
            });
        }
        else {
            return res
                .status(200)
                .json({ IsSuccess: true, Data: [], Message: "No Data Found" });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//this function is written so that when user sign up we can add child to user shcmea as we sign up the child is null
async function addChildToUser(req, res) {
    try {

        const { userId, childName, status } = req.body;
        // Create a new child
        const newChild = new Child({
            childName: childName,
            status: status,
            userId: userId
        });

        const savedChild = await newChild.save();
        // Find the user by id and update the child data
        const updatedUser = await User.findByIdAndUpdate(userId, { child: new mongoose.Types.ObjectId(savedChild._id) }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            IsSuccess: true,
            message: 'Child updated successfully',
            Data: updatedUser
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//this is a login function 
async function login(req, res) {
    try {
        const { mobileNumber } = req.body;


        const get = await User.aggregate([
            {
                $match: {
                    mobileNumber: mobileNumber,
                },
            },
        ]);
        if (get.length > 0) {
            const users = await User.populate(get, { path: "child", model: "children" });
            return res.status(200).json({
                IsSuccess: true,
                count: users.length,
                Data: users,
                Message: "Login Successfully!",
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


//this is used to get the user detail 
async function getUserDetail(req, res) {
    try {
        const { userId } = req.body;
        const get = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
        ]);
        if (get.length > 0) {
            return res.status(200).json({
                IsSuccess: true,
                count: get.length,
                Data: get,
                Message: "Data Found"
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

async function addContactUs(req, res) {
    try {
        const { userId, name, phone, message } = req.body;
        // Create a new user
        const contactUs = new ContactUs({
            name: name,
            phone: phone,
            message: message,
            userId: userId
        });

        // Save the new user to the database
        const savedContactUs = await contactUs.save();
        res.status(200).json({
            IsSuccess: true,
            message: 'Message sent successfully',
            Data: savedContactUs
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



async function userSubscription(req, res) {
    try {
        const { userId, subscriptionId } = req.body;

        // Find the subscription by ID to retrieve the duration
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ error: 'Subscription not found' });
        }

        const { duration } = subscription;

        // Calculate the expiration date based on the duration
        const expDate = new Date();
        expDate.setDate(expDate.getDate() + duration);

        // Format the buyDate and expDate to "dd/mm/yy" format
        const buyDateFormatted = new Date().toLocaleDateString('en-GB');
        const expDateFormatted = expDate.toLocaleDateString('en-GB');

        // Create a new user subscription
        const newSubscription = new UserSubscription({
            userId: userId,
            subscription: subscriptionId,
            buyDate: buyDateFormatted,
            expDate: expDateFormatted
        });

        // Save the new user subscription to the database
        const savedSubscription = await newSubscription.save();
        if (savedSubscription) {
            res.status(200).json({
                message: 'Subscription added successfully',
                subscription: savedSubscription
            });
        }
        else {
            return res
                .status(200)
                .json({ IsSuccess: true, Data: [], Message: "No Data Found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


//this is use to get the subscription which is purchased by the user 

//this is not used any more
async function getUserSubscription(req, res) {
    try {
        const { userId } = req.body;

        // Find all user subscriptions for the given userId and populate the subscription details
        const userSubscriptions = await UserSubscription.find({ userId })
        .populate({
            path: "subscription",
            populate: {
                path: "category",
                populate: {
                    path: "audios"
                }
            }
        });

        // if (userSubscriptions.length === 0) {
        //     return res.status(200).json({ IsSuccess: true, Data: [], Message: "No Data Found"  });
        // }

        // Format the buyDate and expDate for each user subscription
        const userSubscriptionsFormatted = userSubscriptions.map(subscription => {
            const buyDateFormatted = new Date(subscription.buyDate).toLocaleDateString('en-GB');
            const expDateFormatted = new Date(subscription.expDate).toLocaleDateString('en-GB');

            return {
                userId: subscription.userId,
                subscription: subscription.subscription,
                buyDate: buyDateFormatted,
                expDate: expDateFormatted
            };
        });
        if (userSubscriptions.length > 0) {
            res.status(200).json({
                IsSuccess: true,
                Data: userSubscriptionsFormatted,
                Message: 'User subscriptions retrieved successfully'
            });
        }
        else {
            return res
                .status(200)
                .json({ IsSuccess: true, Data: [], Message: "No Data Found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// Controller to get all categories with purchase information for each audio

// async function getAllCategoriesWithPurchaseInfo(req, res) {
//     try {
//       const userId = req.body; // Assuming you have the user ID available
  
//       // Convert the userId to a valid ObjectId
//       const validUserId = mongoose.Types.ObjectId.isValid(userId)
//         ? mongoose.Types.ObjectId(userId)
//         : null;
  
//       // Perform aggregation to get categories with purchase information
//       const categoriesWithPurchaseInfo = await Category.aggregate([
//         // Lookup to get audios for each category
//         {
//           $lookup: {
//             from: "audios",
//             localField: "audios",
//             foreignField: "_id",
//             as: "audios",
//           },
//         },
//         // Unwind audios array
//         { $unwind: "$audios" },
//         // Lookup to check if audio is purchased by the user
//         {
//           $lookup: {
//             from: "purchaseds",
//             let: { audioId: "$audios._id", userId: validUserId },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ["$audioId", "$$audioId"] },
//                       { $eq: ["$userId", "$$userId"] },
//                     ],
//                   },
//                 },
//               },
//             ],
//             as: "purchasedAudios",
//           },
//         },
//         // Add isPurchased field based on the presence of purchasedAudios array
//         {
//           $addFields: {
//             "audios.isPurchased": {
//               $cond: {
//                 if: { $gt: [{ $size: "$purchasedAudios" }, 0] },
//                 then: true,
//                 else: false,
//               },
//             },
//           },
//         },
//         // Group the audios back into categories
//         {
//           $group: {
//             _id: "$_id",
//             name: { $first: "$categoryName" },
//             audios: { $push: "$audios" },
//           },
//         },
//       ]);
  
//       // Return the categories data with purchase information for each audio
//       if (categoriesWithPurchaseInfo.length > 0) {
//         res.status(200).json({
//           IsSuccess: true,
//           categories: categoriesWithPurchaseInfo,
//           message: "Data Found",
//         });
//       } else {
//         res.status(200).json({
//           IsSuccess: true,
//           categories: [],
//           message: "No Data Found",
//         });
//       }
//     } catch (error) {
//       console.error("Error getting categories with purchase information:", error);
//       res
//         .status(500)
//         .json({ error: `${error}`, message: "Internal server error" });
//     }
//   }
async function getAllCategoriesWithPurchaseInfo(req, res) {
    try {
      const userId = req.body; // Assuming you have the user ID available
  
      // Convert the userId to a valid ObjectId
      const validUserId = mongoose.Types.ObjectId.isValid(userId)
        ? mongoose.Types.ObjectId(userId)
        : null;
  
      // Find all categories and populate the audios field
      const categories = await Category.find().populate({
        path: "audios",
        let: { userId: validUserId },
        pipeline: [
          {
            $lookup: {
              from: "purchaseds",
              let: { audioId: "$_id", userId: "$$userId" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$audioId", "$$audioId"] },
                        { $eq: ["$userId", "$$userId"] },
                      ],
                    },
                  },
                },
              ],
              as: "isPurchased",
            },
          },
          {
            $addFields: {
              isPurchased: { $gt: [{ $size: "$isPurchased" }, 0] },
            },
          },
        ],
      });
  
      // Return the categories data with purchase information for each audio
      if (categories.length > 0) {
        res.status(200).json({
          IsSuccess: true,
          categories: categories.map((category) => ({
            _id: category._id,
            categoryName: category.categoryName,
            audios: category.audios.map((audio) => ({
              ...audio,
              isPurchased: audio.isPurchased,
            })),
          })),
          message: "Data Found",
        });
      } else {
        res.status(200).json({
          IsSuccess: true,
          categories: [],
          message: "No Data Found",
        });
      }
    } catch (error) {
      console.error("Error getting categories with purchase information:", error);
      res
        .status(500)
        .json({ error: `${error}`, message: "Internal server error" });
    }
  }
  
async function deleteUser(req, res) {
    try {
        const { userId } = req.body;

        // Find and delete the user
        const result = await User.deleteOne({ _id: userId });

        // Check the deletion result
        if (result.deletedCount === 0) {
            return res.status(404).json({ IsSuccess: false, Message: "User not found" });
        }

        return res.status(200).json({ IsSuccess: true, Message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ IsSuccess: false, Message: error.message });
    }

}




module.exports = {
    signUp,
    addChildToUser,
    login,
    getUserDetail,
    addContactUs,
    userSubscription,
    getUserSubscription,
    deleteUser,
    getAllCategoriesWithPurchaseInfo,
}
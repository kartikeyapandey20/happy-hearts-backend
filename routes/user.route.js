const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/user.controller");
const childController = require("../controller/child.controller");
const purchaseController = require("../controller/purchase.controller");
const favoriteController = require("../controller/favourite.controller");
const multer = require("multer");
const path = require("path");
const User = require("../model/user.model");
const { default: mongoose, mongo } = require("mongoose");
const Child = require("../model/child.model");
const { log } = require("console");
// Set up multer storage for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const languageFolder = getLanguageFolder(file.fieldname);
    const destinationPath = path.join(
      __dirname,
      "../uploads/userImages",
      languageFolder
    );
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = uniqueSuffix + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

function getLanguageFolder(fieldname) {
  switch (fieldname) {
    case "userImage":
      return "userImage";
    default:
      return "other";
  }
}
//this is used to update the user detail
userRouter.put("/updateUser", upload.fields([
  { name: "userImage", maxCount: 1 },
]), async (req, res) => {
  //this is used to update the user Detail
  let userImage = "";
  const {
    firstName,
    lastName,
    mobileNumber,
    email,
    childName,
    childId,
    userId,
  } = req.body;
  try {
    // Find the user by their ID and update with the entire request body
    // Set the audio URLs
    var UserDetails = User.find({ _id: new mongoose.Types.ObjectId(userId) });

    if (firstName == null) {
      firstName = UserDetails.firstName;
    }
    if (lastName == null) {
      lastName = UserDetails.lastName;
    }
    if (mobileNumber == null) {
      mobileNumber = UserDetails.mobileNumber;
    }
    if (email == null) {
      email = UserDetails.email;
    }
    if (childName == null) {
      // Child.findOneAndUpdate({_id : childId},{ $set:{ name : childName}}, function(err){}
      const childDetail = await Child.find({
        _id: new mongoose.Types.ObjectId(childId),
        userId: new mongoose.Types.ObjectId(userId),
      });
      childName = childDetail.childName;
    }
    if (req.files.userImage ==  null) {
      userImage = UserDetails.userImage
    }
    if (req.files.userImage) {
      console.log("this is console");
      const userImageUrl =
        "/uploads/userImages/userImage/" + req.files.userImage[0].filename;
      userImage = userImageUrl;
      // console.log(userImage);
    }
    // console.log("this is console");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        email: email,
        userImage: userImage
      },
      { new: true }
    );

    const childUpate =await Child.findOneAndUpdate(
      { _id: childId },
      { $set: { childName: childName } }
    );
    if (!updatedUser) {
      return res.status(404).json({
        IsSuccess: false,
        Message: "User not found",
      });
    }
    await childUpate.save();
    res.status(200).json({
      IsSuccess: true,
      Data: updatedUser,
      Message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ IsSuccess: false, Message: "Internal server error" });
  }
});

userRouter.get("/uploads/userImages/userImage/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/userImages/userImage", filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Send the file as a response
    res.sendFile(filePath);
  } else {
    // File not found, send an error response
    res.status(404).send("File not found");
  }
});

//this is a route for sign up
userRouter.post("/signUp", userController.signUp);

//this is used to add child after the sign up
userRouter.put("/addChildToUser", userController.addChildToUser);

//this is used to login the user
userRouter.post("/login", userController.login);

//this is used to get the detial of the user
userRouter.get("/getUser", userController.getUserDetail);

//this is used to add multiple child for the particular user
userRouter.post("/addChild", childController.addChild);

//this is use to get the child of the user
userRouter.get("/getUserChildren", childController.getUserChildren);

//this is use to send the request to admin if any
userRouter.post("/addContactUs", userController.addContactUs);

//this is use to add subscription to the user
userRouter.post("/addUserPurchase", userController.userSubscription);

//this is use to get subscription of the user
userRouter.post(
  "/getAllCategoriesWithPurchaseInfo",
  userController.getAllCategoriesWithPurchaseInfo
);

//this is use to make purchase by the user for the audio
userRouter.post("/addPurchase", purchaseController.addPurchase);

//this is use to check if the audio is purchased or not
userRouter.post("/audioStatus", purchaseController.findAudioPurchaseStatus);

//this is use to get the activity history of the user
userRouter.post("/getActivityHistory", purchaseController.getActivityHistory);

//this is use to delete the user
userRouter.delete("/deleteUser", userController.deleteUser);

//this is use to add favourite audio
userRouter.post("/addFavourite", favoriteController.addFavourite);

module.exports = userRouter;

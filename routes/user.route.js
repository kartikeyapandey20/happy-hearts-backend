const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/user.controller");
const childController = require("../controller/child.controller");
const purchaseController = require("../controller/purchase.controller");
//this is a route for sign up
userRouter.post("/signUp",userController.signUp);

//this is used to add child after the sign up
userRouter.put("/addChildToUser",userController.addChildToUser);

//this is used to login the user
userRouter.post("/login",userController.login);

//this is used to get the detial of the user
userRouter.get("/getUser",userController.getUserDetail)

//this is used to update the user detail
userRouter.put("/updateUser",userController.updateUser);

//this is used to add multiple child for the particular user
userRouter.post("/addChild" , childController.addChild);

//this is use to get the child of the user
userRouter.get("/getUserChildren",childController.getUserChildren);

//this is use to send the request to admin if any
userRouter.post("/addContactUs",userController.addContactUs);

//this is use to add subscription to the user
userRouter.post("/addUserPurchase",userController.userSubscription);

//this is use to get subscription of the user
userRouter.post("/getAllCategoriesWithPurchaseInfo",userController.getAllCategoriesWithPurchaseInfo);


//this is use to make purchase by the user for the audio
userRouter.post("/addPurchase",purchaseController.addPurchase);
//this is use to delete the user
userRouter.delete("/deleteUser",userController.deleteUser);
module.exports = userRouter
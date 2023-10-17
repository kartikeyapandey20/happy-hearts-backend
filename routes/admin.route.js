const express = require('express');
const multer = require('multer');
const adminRouter = express.Router();
const Audio = require('../model/audio.model');
const audioController = require("../controller/audio.controller");
const path = require('path');
const categoryController = require("../controller/category.controller");
const subscriptionController = require("../controller/subscription.controller");
// Set up multer storage for audio and image files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/audio'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
})

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ('uploads/audio'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage });
const imageUpload = multer({ storage: imageStorage });

// Create a new audio record
adminRouter.post('/addAudio', audioController.addAudio);
//this is used to get audio
adminRouter.get("/getAudio",audioController.getAudio);

//this is used to add category
adminRouter.post("/addCategory",categoryController.addCategory);

//this is used to get existing category list
adminRouter.get("/getCategory",categoryController.getCategory);

//this is used to add audio to existing category
adminRouter.put("/addAudioToCategory", categoryController.addAudioToCategory);

//this is use to delete the audio from the category
adminRouter.delete("/deleteAudioFromCategory",categoryController.deleteAudioFromCategory);

//this is used get the audio from the particular category
adminRouter.post("/getAudioByCategory",categoryController.getAudioCategory);


//this is use to add subscription from the admin which will be showed at the user side
adminRouter.post("/addSubscription",subscriptionController.addSubscription);

//this is use to get the subsciption
adminRouter.get("/getSubscription",subscriptionController.getSubscription);

adminRouter.put("/addEnglishAudio",audioController.addEnglishAudio);

adminRouter.put("/addGujaratiAudio",audioController.addGujaratiAudio);
module.exports = adminRouter;

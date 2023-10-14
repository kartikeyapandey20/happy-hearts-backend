const express = require("express");
const audioRouter = express.Router();
const Audio = require("../model/audio.model");
const multer = require("multer");
const path = require("path");

// Set up multer storage for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const languageFolder = getLanguageFolder(file.fieldname);
    const destinationPath = path.join(__dirname, "../uploads/audios", languageFolder);
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

// Helper function to determine the folder based on the language fieldname
function getLanguageFolder(fieldname) {
  switch (fieldname) {
    case "hindiAudioUrl":
      return "hindi";
    case "englishAudioUrl":
      return "english";
    case "gujaratiAudioUrl":
      return "gujarati";
    case "imageUrl":
      return "images";
    default :
      return "other";
  }
}

// Define the route to handle audio file uploads
audioRouter.post("/upload", upload.fields([
  { name: "hindiAudioUrl", maxCount: 1 },
  { name: "englishAudioUrl", maxCount: 1 },
  { name: "gujaratiAudioUrl", maxCount: 1 },
  { name: "imageUrl", maxCount: 1 },
]), async (req, res) => {
  try {
    // Create a new Audio document
    const audio = new Audio();

    // Set the audio details
    audio.audioName = req.body.audioName;
    audio.audioDiscription = req.body.audioDiscription;
    audio.audioInstruction = req.body.audioInstruction;
    audio.audioPrice = req.body.audioPrice;
    audio.audioDuration = req.body.audioDuration;
    audio.musicName = req.body.musicName;

    // Set the audio URLs
    if (req.files.hindiAudioUrl) {
      const hindiAudioUrl = "/uploads/audios/hindi/" + req.files.hindiAudioUrl[0].filename;
      audio.hindiAudioUrl = hindiAudioUrl;
    }
    if (req.files.englishAudioUrl) {
      const englishAudioUrl = "/uploads/audios/english/" + req.files.englishAudioUrl[0].filename;
      audio.englishAudioUrl = englishAudioUrl;
    }
    if (req.files.gujaratiAudioUrl) {
      const gujaratiAudioUrl = "/uploads/audios/gujarati/" + req.files.gujaratiAudioUrl[0].filename;
      audio.gujaratiAudioUrl = gujaratiAudioUrl;
    }
    if (req.files.imageUrl) {
      const imageUrl = "/uploads/audios/images/" + req.files.imageUrl[0].filename;
      audio.imageUrl = imageUrl;
      console.log(audio.imageUrl);
    }
    // Save the audio document
    console.log(audio);
    await audio.save();

    res.json({
      message: "Audio uploaded successfully",
      audio: audio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while uploading the audio",
      error: error.message,
    });
  }
});

// Define the route to handle audio file updates
audioRouter.put("/upload/:id", upload.fields([
  { name: "hindiAudioUrl", maxCount: 1 },
  { name: "englishAudioUrl", maxCount: 1 },
  { name: "gujaratiAudioUrl", maxCount: 1 },
  { name: "imageUrl", maxCount: 1 },
]), async (req, res) => {
  try {
    // Find the audio document to update
    const audio = await Audio.findById(req.params.id);

    // Set the updated audio details
    audio.audioName = req.body.audioName;
    audio.audioDiscription = req.body.audioDiscription;
    audio.audioInstruction = req.body.audioInstruction;
    audio.audioPrice = req.body.audioPrice;
    audio.audioDuration = req.body.audioDuration;
    audio.musicName = req.body.musicName;

    // Update the audio URLs
    if (req.files.hindiAudioUrl) {
      const hindiAudioUrl = "/uploads/audios/hindi/" + req.files.hindiAudioUrl[0].filename;
      audio.hindiAudioUrl = hindiAudioUrl;
    }
    if (req.files.englishAudioUrl) {
      const englishAudioUrl = "/uploads/audios/english/" + req.files.englishAudioUrl[0].filename;
      audio.englishAudioUrl = englishAudioUrl;
    }
    if (req.files.gujaratiAudioUrl) {
      const gujaratiAudioUrl = "/uploads/audios/gujarati/" + req.files.gujaratiAudioUrl[0].filename;
      audio.gujaratiAudioUrl = gujaratiAudioUrl;
    }
    if (req.files.imageUrl) {
      const imageUrl = "/uploads/audios/images/" + req.files.imageUrl[0].filename;
      audio.imageUrl = imageUrl;
    }

    // Save the updated audio document
    await audio.save();

    res.json({
      message: "Audio updated successfully",
      audio: audio,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the audio",
      error: error.message,
    });
  }
});

// API endpoint to retrieve the audio file
audioRouter.get("/uploads/audios/hindi/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/audios/hindi", filename);

  // Send the audio file as a response
  res.sendFile(filePath);
});

audioRouter.get("/uploads/audios/english/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/audios/english", filename);

  // Send the audio file as a response
  res.sendFile(filePath);
});

audioRouter.get("/uploads/audios/gujarati/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/audios/gujarati", filename);

  // Send the audio file as a response
  res.sendFile(filePath);
});

audioRouter.get("/uploads/audios/images/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../uploads/audios/images", filename);

  // Send the audio file as a response
  res.sendFile(filePath);
});
// Serve audio files
audioRouter.use("/uploads/audios", express.static(path.join(__dirname, "../uploads/audios")));

module.exports = audioRouter;

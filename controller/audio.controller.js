const Audio = require("../model/audio.model")
const fs = require("fs")
async function addAudio(req, res) {
  try {
      const {image, audioName, audioDiscription } = req.body;
        
      let imagePath = [];
    if (image != undefined && image != null && image != [] && image != "") {
      if (image.length > 0) {
        let listStringToBase64 = image.split(",");
        listStringToBase64.forEach(dateIs => {
          const path = "uploads/audio/" + Date.now() + ".acc"
          const base64Date = dateIs.replace(/^data:([A-Za-z-+/]+);base64,/, '');
          fs.writeFileSync(path, base64Date, { encoding: "base64" });
          imagePath.push(path);
        });
      }
    }
      // const imageUrl = req.file.filename
      // console.log(imageUrl);
      const newAudio = new Audio({
          audioName: audioName,
          hindiAudioUrl: image,
          imageUrl: null,
          audioDiscription: audioDiscription
      });

      const savedAudio = await newAudio.save();
      res.status(200).json({ message: 'Audio uploaded successfully', audio: savedAudio });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
}

async function addEnglishAudio(req, res) {
    try {
        const { audioId } = req.body; // Assuming you send audioId in the request body
    
        // Check if the request contains an uploaded file
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
    
        // Assuming the file path is available in req.file.path
        const englishAudioUrl = req.file.path;
    
        // Find the audio document by ID and update the English audio URL
        const audio = await Audio.findByIdAndUpdate(
          audioId,
          { englishAudioUrl },
          { new: true }
        );
    
        if (!audio) {
          return res.status(404).json({ message: "Audio not found" });
        }
    
        return res.status(200).json({ message: "English audio URL updated successfully", audio });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
}

async function addGujaratiAudio(req, res) {
    try {
        const { audioId } = req.body; // Assuming you send audioId in the request body
    
        // Check if the request contains an uploaded file
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
    
        // Assuming the file path is available in req.file.path
        const gujaratiAudioUrl = req.file.path;
    
        // Find the audio document by ID and update the English audio URL
        const audio = await Audio.findByIdAndUpdate(
          audioId,
          { gujaratiAudioUrl },
          { new: true }
        );
    
        if (!audio) {
          return res.status(404).json({ message: "Audio not found" });
        }
        else{
            return res.status(200).json({ message: "Gujarati audio URL updated successfully", audio });
        }
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
      }
}
async function getAudio(req,res) {
    try {
        const get = await Audio.aggregate([
            {
                $match: {},
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
        
    }catch(err){
        res.status(500).json({error  : err.message})
    }
}
module.exports = {
    addAudio,
    getAudio,
    addEnglishAudio,
    addGujaratiAudio
}

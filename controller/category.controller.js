const Category = require("../model/category.model");
const Audio = require("../model/audio.model");
const mongoose = require("mongoose");

async function addCategory(req,res){
    try{
        const {name , audioId} = req.body;
        const audioObjectIds = audioId.map(id => new mongoose.Types.ObjectId(id));
        const newCategory = new Category({
            categoryName : name,
            audios : audioObjectIds
        }) ;

        const savedCategory = await newCategory.save();

        res.status(200).json({
            message : "Category Created Successfully", 
            Data : savedCategory
        })
    }catch(err){
        res.status(500).json({error : err.message});
    }
}

async function getCategory(req,res) {
    try {
        const get = await Category.find({});
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

async function addAudioToCategory(req,res){

    try {

        const {categoryId , audioId } = req.body;
    
        const category = await Category.findById(categoryId);
    
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        // Convert the IDs to Mongoose ObjectId objects
        const audioObjectIds = audioId.map(id => new mongoose.Types.ObjectId(id));
    
        const audio = await Audio.find({ _id: { $in: audioObjectIds } });
        if (audio.length === 0) {
          return res.status(404).json({ message: 'Audio not found' });
        }
        // Add the audio records to the category
        category.audios.push(...audio);
        // Save the category
        const updatedCategory =await category.save();

        res.status(200).json({
            message : "Audio Updated Successfully",
            Data : updatedCategory
        });
    }
    catch(err)
    {
        res.status(500).json({error : err.message});
    }
}

async function deleteAudioFromCategory(req,res){
    try {
        const { categoryId, audioId } = req.body;
    
        const updatedCategory = await Category.findOneAndUpdate(
          { _id: categoryId },
          { $pull: { audios: audioId } },
          { new: true }
        );
    
        if (!updatedCategory) {
          return res
            .status(404)
            .json({ error: 'Category not found or audio not in category' });
        }
    
        res.json({
          message: 'Audio deleted from category',
          category: updatedCategory,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
}


async function getAudioCategory(req,res) {
    try {
        const {categoryId} = req.body;
        const get = await Category.find({
            _id : categoryId
        }).populate("audios");
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
    addCategory,
    getCategory,
    addAudioToCategory,
    deleteAudioFromCategory,
    getAudioCategory
}
const User = require("../model/user.model");
const Child = require("../model/child.model");
const mongoose = require("mongoose");

//this is used to add multiple child for the user 
async function addChild(req, res) {
    try {

        const { userId, childName, status } = req.body;
        // Create a new child for the user
        const newChild = new Child({
            childName: childName,
            status: status,
            userId: userId
        });

        const savedChild = await newChild.save();

        res.status(200).json({
            IsSuccess: true,
            message: 'Child added successfully',
            Data: savedChild
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getUserChildren(req,res){
    try {
        const { userId } = req.body;


        const get = await Child.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
        ]);
        if (get.length > 0) {
            return res.status(200).json({
                IsSuccess: true,
                count: get.length,
                Data: get,
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
    addChild,
    getUserChildren
}
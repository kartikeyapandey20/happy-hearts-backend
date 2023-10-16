const User = require("../model/user.model");
const Child = require("../model/child.model");
const mongoose = require("mongoose");
const Category = require("../model/category.model");
const Purchased = require("../model/purchased.model");
const Favourite = require("../model/favourite.model");


async function addFavourite(req, res) {
    try {
        const { userId, childId, audioId } = req.body;

        const favorite = new Favourite({
            userId,
            childId,
            audioId
        });

        await favorite.save();

        const purchasedAudio = await Purchased.find({ userId: new mongoose.Types.ObjectId(userId), childId: new mongoose.Types.ObjectId(childId), audioId: new mongoose.Types.ObjectId(audioId) });

        // Check if there are any purchasedAudio documents in the array
        if (purchasedAudio.length > 0) {
            // Assuming you want to mark all matching documents as favorites
            for (const audioDoc of purchasedAudio) {
                audioDoc.isFavourite = true;
                await audioDoc.save();
            }
        }
        return res.status(200).json({ IsSuccess: true, Message: "Added To Favourite" });
    } catch (error) {
        return res.status(500).json({ IsSuccess: false, Message: error.message });
    }
}


module.exports = {
    addFavourite
}
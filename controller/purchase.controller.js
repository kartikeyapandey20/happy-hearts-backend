const Purchased = require("../model/purchased.model");
const mongoose = require("mongoose");
const ActivityHistory = require('../model/activityHistory.model');
async function addPurchase(req, res) {
  try {
    const { userId, childId, audioId, duration,paymentId } = req.body;

    const currentDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(currentDate.getDate() + parseInt(duration));
    const get = await Purchased.aggregate([
      {
          $match: {
            userId : new mongoose.Types.ObjectId(userId) ,
            childId : new mongoose.Types.ObjectId(childId),
            audioId : new mongoose.Types.ObjectId(audioId)
          },
      },
  ]);
  console.debug(get);
    if(get.length > 0)
    {
      return res.status(204).json({
        IsSuccess: false,
        message: "Audio Already Purchased",
      });
    }
    const purchase = new Purchased({
      userId: new mongoose.Types.ObjectId(userId),
      audioId: new mongoose.Types.ObjectId(audioId),
      childId: new mongoose.Types.ObjectId(childId),
      duration: duration,
      buyDate: currentDate.toISOString(),
      expDate: expirationDate.toISOString(),
      paymentId : paymentId
    });

    await purchase.save();

    if (purchase) {
      res.status(200).json({
        IsSuccess: true,
        Data: purchase,
        message: "Purchase added successfully",
      });
    } else {
      res.status(200).json({
        IsSuccess: false,
        Data: [],
        message: "Purchase Unsuccessful",
      });
    }
  } catch (error) {
    console.error("Error adding purchase:", error);
    res.status(500).json({ error: `${error}`, message: "Internal server error" });
  }
}

async function findAudioPurchaseStatus(req, res) {
  try {
    const { userId, audioId, childId } = req.body;

    // Search for a purchase record matching the userId and audioId
    const purchase = await Purchased.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      audioId: new mongoose.Types.ObjectId(audioId),
      childId: new mongoose.Types.ObjectId(childId)
    });

    // If a purchase record is found, the audio has been purchased; otherwise, it hasn't.
    const isPurchased = purchase !== null;
    const get = await ActivityHistory.find({userId : new mongoose.Types.ObjectId(userId),audioId : new mongoose.Types.ObjectId(audioId),childId : new mongoose.Types.ObjectId(childId)})
    if (isPurchased && get.length==0) {
      console.log("this is executed")
      const activityHistory = new ActivityHistory({
        userId: new mongoose.Types.ObjectId(userId),
        audioId: new mongoose.Types.ObjectId(audioId),
        childId: new mongoose.Types.ObjectId(childId)
      })

      await activityHistory.save();
    }

    res.status(200).json({
      IsSuccess: true,
      Data: { audioPurchase: isPurchased },
      message: isPurchased ? "Audio has been purchased" : "Audio has not been purchased",
    });
  } catch (error) {
    console.error("Error finding audio purchase status:", error);
    res.status(500).json({ IsSuccess: false, Message: "Internal server error" });
  }
}

async function getActivityHistory(req, res) {
  try {
    const { userId, childId, audioId } = req.body;

    // Build the query to find activity history records
    const query = {
      userId: new mongoose.Types.ObjectId(userId),
      childId: new mongoose.Types.ObjectId(childId),
      audioId: new mongoose.Types.ObjectId(audioId)
    };

    // Find the matching activity history records and populate the 'audioId' field
    const activityHistory = await ActivityHistory.find(query).populate('audioId');

    res.status(200).json({
      IsSuccess: true,
      Data: activityHistory,
      Message: "Activity History Retrieved Successfully"
    });
  } catch (error) {
    console.error("Error retrieving activity history:", error);
    res.status(500).json({ IsSuccess: false, Message: "Internal server error" });
  }
}
// Helper function to format date as dd/mm/yy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

module.exports = { addPurchase, findAudioPurchaseStatus, getActivityHistory };

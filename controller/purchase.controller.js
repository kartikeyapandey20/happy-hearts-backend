const Purchased =  require("../model/purchased.model");
const mongoose = require("mongoose");

async function addPurchase(req, res) {
    try {
      const { userId, audioId, duration } = req.body;
  
      const currentDate = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(currentDate.getDate() + parseInt(duration));
  
      const purchase = new Purchased({
        userId : new mongoose.Types.ObjectId(userId),
        audios : new mongoose.Types.ObjectId(audioId),
        duration : duration,
        buyDate: currentDate.toISOString(),
        expDate: expirationDate.toISOString(),
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
  
  

// Helper function to format date as dd/mm/yy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

module.exports = { addPurchase };

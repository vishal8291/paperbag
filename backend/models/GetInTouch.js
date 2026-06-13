const mongoose = require("mongoose");

const getInTouchSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const GetInTouch = mongoose.models.GetInTouch || mongoose.model("GetInTouch", getInTouchSchema);
module.exports = GetInTouch;

const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    address: { type: String, default: "" },
    paymentSettings: {
      razorpayKeyId: { type: String, default: "" },
      razorpayKeySecret: { type: String, default: "" },
    },
    themeSettings: {
      primaryColor: { type: String, default: "#15803d" }, // default green-700
      secondaryColor: { type: String, default: "#166534" }, // default green-800
      fontFamily: { type: String, default: "Inter" },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", StoreSchema);

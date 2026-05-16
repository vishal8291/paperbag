const GetInTouch = require("../models/GetInTouch");

exports.submitGetInTouch = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    const newEntry = new GetInTouch({ fullName, email, phone, subject, message });
    await newEntry.save();

    res.status(200).json({ message: "Information received successfully" });
  } catch (error) {
    console.error("Error saving get in touch info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

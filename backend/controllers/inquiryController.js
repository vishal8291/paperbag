const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
  const inquiry = new Inquiry(req.body);
  await inquiry.save();
  res.status(201).json(inquiry);
};

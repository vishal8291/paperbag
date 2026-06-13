const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
  const inquiry = new Inquiry({ ...req.body, storeId: req.storeId });
  await inquiry.save();
  res.status(201).json(inquiry);
};

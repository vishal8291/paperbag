// Structure similar to Order, with extra custom fields as needed

exports.createCustomOrder = async (req, res) => {
  // You can reuse Order, or define a new schema for custom
  res.status(201).json({ success: true, detail: "custom order placeholder" });
};

const Store = require("../models/Store");
const User = require("../models/User");

// Create store
exports.createStore = async (req, res) => {
  try {
    const { name, slug, description } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ message: "Store name and slug are required." });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    if (!cleanSlug) {
      return res.status(400).json({ message: "Invalid slug." });
    }

    // Check if slug is unique
    const existingStore = await Store.findOne({ slug: cleanSlug });
    if (existingStore) {
      return res.status(400).json({ message: "Store slug is already taken." });
    }

    // Check if user already owns a store
    const user = await User.findById(req.user.id);
    if (user.storeId) {
      return res.status(400).json({ message: "You already own a store." });
    }

    const store = await Store.create({
      name,
      slug: cleanSlug,
      description: description || "",
      owner: req.user.id,
      contactEmail: user.email,
    });

    // Update user role to seller and set storeId
    user.role = user.role === "admin" ? "admin" : "seller";
    user.storeId = store._id;
    await user.save();

    res.status(201).json({ message: "Store created successfully.", store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user's store
exports.getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update store details
exports.updateMyStore = async (req, res) => {
  try {
    const { name, slug, description, logo, banner, contactEmail, contactPhone, address, paymentSettings, themeSettings } = req.body;
    const store = await Store.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }

    if (name) store.name = name;
    if (description !== undefined) store.description = description;
    if (logo !== undefined) store.logo = logo;
    if (banner !== undefined) store.banner = banner;
    if (contactEmail !== undefined) store.contactEmail = contactEmail;
    if (contactPhone !== undefined) store.contactPhone = contactPhone;
    if (address !== undefined) store.address = address;

    if (slug) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      if (cleanSlug && cleanSlug !== store.slug) {
        const taken = await Store.findOne({ slug: cleanSlug });
        if (taken) {
          return res.status(400).json({ message: "Store slug is already taken." });
        }
        store.slug = cleanSlug;
      }
    }

    if (paymentSettings) {
      store.paymentSettings = {
        razorpayKeyId: paymentSettings.razorpayKeyId !== undefined ? paymentSettings.razorpayKeyId : store.paymentSettings.razorpayKeyId,
        razorpayKeySecret: paymentSettings.razorpayKeySecret !== undefined ? paymentSettings.razorpayKeySecret : store.paymentSettings.razorpayKeySecret,
      };
    }

    if (themeSettings) {
      store.themeSettings = {
        primaryColor: themeSettings.primaryColor || store.themeSettings.primaryColor,
        secondaryColor: themeSettings.secondaryColor || store.themeSettings.secondaryColor,
        fontFamily: themeSettings.fontFamily || store.themeSettings.fontFamily,
      };
    }

    await store.save();
    res.json({ message: "Store updated successfully.", store });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get store by slug (public)
exports.getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.findOne({ slug: req.params.slug.toLowerCase().trim(), isActive: true })
      .select("-paymentSettings.razorpayKeySecret"); // hide sensitive info!
    if (!store) {
      return res.status(404).json({ message: "Store not found." });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all stores (Admin only)
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate("owner", "name email");
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

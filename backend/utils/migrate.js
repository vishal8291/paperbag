const Store = require("../models/Store");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Coupon = require("../models/Coupon");
const Review = require("../models/Review");
const Testimonial = require("../models/Testimonial");
const Subscriber = require("../models/Subscriber");
const Newsletter = require("../models/Newsletter");
const Contact = require("../models/Contact");
const GetInTouch = require("../models/GetInTouch");
const Inquiry = require("../models/Inquiry");
const bcrypt = require("bcryptjs");

const runMigration = async () => {
  try {
    console.log("🛠️  Running multi-tenant database migration...");

    // 1. Resolve or create a default owner
    let owner = await User.findOne({ role: "admin" });
    if (!owner) {
      owner = await User.findOne({ role: "seller" });
    }
    if (!owner) {
      owner = await User.findOne(); // grab any user
    }
    if (!owner) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      owner = await User.create({
        name: "Default Admin",
        email: "admin@storecraft.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("👤 Created default admin user: admin@storecraft.com / admin123");
    }

    // 2. Resolve or create default Store
    let defaultStore = await Store.findOne({ slug: "paperbag" });
    if (!defaultStore) {
      defaultStore = await Store.create({
        name: "Paperbag Store",
        slug: "paperbag",
        description: "Handcrafted eco-friendly paper bags store.",
        owner: owner._id,
        contactEmail: owner.email,
        themeSettings: {
          primaryColor: "#15803d",
          secondaryColor: "#166534"
        }
      });
      console.log("🏪 Created default store: Paperbag Store (/store/paperbag)");

      // Link owner to default store
      if (!owner.storeId) {
        owner.storeId = defaultStore._id;
        owner.role = owner.role === "user" ? "seller" : owner.role;
        await owner.save();
      }
    }

    const storeId = defaultStore._id;

    // 3. Migrate legacy records without storeId
    const pResult = await Product.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const oResult = await Order.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const cResult = await Coupon.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const rResult = await Review.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const tResult = await Testimonial.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const sResult = await Subscriber.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const nResult = await Newsletter.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const cnResult = await Contact.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const gitResult = await GetInTouch.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });
    const inqResult = await Inquiry.updateMany({ storeId: { $exists: false } }, { $set: { storeId } });

    console.log(`✅ Database migration finished!`);
    console.log(`   - Products migrated: ${pResult.modifiedCount}`);
    console.log(`   - Orders migrated: ${oResult.modifiedCount}`);
    console.log(`   - Coupons migrated: ${cResult.modifiedCount}`);
    console.log(`   - Reviews migrated: ${rResult.modifiedCount}`);
    console.log(`   - Testimonials migrated: ${tResult.modifiedCount}`);

  } catch (err) {
    console.error("❌ Database migration failed:", err);
  }
};

module.exports = runMigration;

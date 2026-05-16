/**
 * Paperbag — Product Seeder
 * Run: node backend/scripts/seedProducts.js
 * Clears existing products and inserts 8 hand-crafted ones.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Product  = require("../models/Product");

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

const PRODUCTS = [
  {
    name: "Kraft Classic Shopping Bag",
    price: 149,
    description:
      "Our best-selling kraft paper bag, handcrafted from 300 GSM post-consumer recycled paper. Twisted rope handles, reinforced base, and a natural brown finish that complements any retail brand. Fully biodegradable and food-safe. Perfect for boutiques, grocery stores, and daily retail use.",
    imageUrl: `${BASE_URL}/products/kraft-classic.svg`,
    availableSizes: ["Small (20×10×25 cm)", "Medium (30×12×35 cm)", "Large (40×15×45 cm)"],
    ecoFriendly: true,
  },
  {
    name: "Luxury Gift Bag — Midnight",
    price: 299,
    description:
      "Deep midnight-purple paper bag with a gold satin ribbon bow and metallic rope handles. Made from 350 GSM premium matte paper with a soft-touch laminate finish. The gold foil stamping adds an opulent feel that makes every gift unforgettable. Ideal for jewellery, high-end apparel, and luxury gifting.",
    imageUrl: `${BASE_URL}/products/gift-luxury.svg`,
    availableSizes: ["Small (18×8×22 cm)", "Medium (25×10×30 cm)"],
    ecoFriendly: true,
  },
  {
    name: "Natural Canvas Tote Bag",
    price: 199,
    description:
      "Sturdy natural canvas tote bag with wide flat handles and a generous main compartment. Made from unbleached, undyed organic cotton canvas. The minimalist leaf print is done with water-based inks. Holds up to 8 kg — perfect for groceries, farmers markets, and everyday carry. Machine washable.",
    imageUrl: `${BASE_URL}/products/tote-natural.svg`,
    availableSizes: ["Standard (38×10×40 cm)"],
    ecoFriendly: true,
  },
  {
    name: "Wedding Blush Favour Bag",
    price: 89,
    description:
      "Delicate blush-pink paper bag adorned with a rose-gold satin ribbon bow and subtle floral print. Made from 250 GSM pastel matte paper with a soft sheen. Perfect for wedding favours, bridal showers, baby showers, and anniversary gifts. Available in packs of 12, 25, and 50.",
    imageUrl: `${BASE_URL}/products/wedding-blush.svg`,
    availableSizes: ["Mini (12×6×15 cm)", "Standard (18×8×22 cm)"],
    ecoFriendly: true,
  },
  {
    name: "Boutique Black Premium Bag",
    price: 249,
    description:
      "Sleek matte-black bag with a glossy finish, premium black ribbon handles, and a debossed Paperbag monogram. Made from 320 GSM premium art paper with spot UV coating. Exudes sophistication for fashion boutiques, electronics stores, and exclusive retail brands. Sold individually and in bulk.",
    imageUrl: `${BASE_URL}/products/boutique-black.svg`,
    availableSizes: ["Medium (28×10×32 cm)", "Large (36×14×42 cm)"],
    ecoFriendly: true,
  },
  {
    name: "Food Grade Kraft Bag",
    price: 59,
    description:
      "Heavy-duty flat-bottom kraft bag with a serrated top fold and grease-resistant inner lining. FDA-approved food-safe materials, no bleaching agents used. The gusseted sides hold up to 3 kg comfortably. Ideal for bakeries, cafés, food delivery, takeaway restaurants, and delis.",
    imageUrl: `${BASE_URL}/products/food-kraft.svg`,
    availableSizes: ["Small (15×8×20 cm)", "Medium (22×10×28 cm)", "Large (30×12×35 cm)"],
    ecoFriendly: true,
  },
  {
    name: "Custom Branded Bag",
    price: 349,
    description:
      "Deep forest-green paper bag with full CMYK custom printing — your logo, colours, and artwork on a premium 300 GSM matte base. Minimum order: 50 pieces. Comes with gold foil optional add-on. Our in-house design team will finalise artwork within 24 hours of order. Perfect for brand activation, events, and retail packaging.",
    imageUrl: `${BASE_URL}/products/custom-printed.svg`,
    availableSizes: ["Small (20×10×25 cm)", "Medium (30×12×35 cm)", "Large (40×15×45 cm)", "Custom Size"],
    ecoFriendly: true,
  },
  {
    name: "Mini Gift Bags — Festive Set (Pack of 12)",
    price: 399,
    description:
      "A vibrant set of 12 mini gift bags in 3 festive colours — sunshine yellow, candy pink, and sky blue — with matching ribbon handles and assorted patterns (polka dots, hearts, stars). Made from 200 GSM coated paper. Each bag is 14×7×18 cm. Perfect for birthday parties, Diwali, Christmas, and children's events.",
    imageUrl: `${BASE_URL}/products/mini-gift.svg`,
    availableSizes: ["Mini (14×7×18 cm) — Pack of 12"],
    ecoFriendly: true,
  },
  {
    name: "Eco White Signature Bag",
    price: 179,
    description:
      "Clean, crisp white paper bag with our signature Paperbag leaf logo printed in forest green. Made from 280 GSM FSC-certified virgin white paper with recycled content. Green twisted rope handles and a reinforced base. Versatile for any retail store, launch event, or corporate gifting. Minimal, timeless, eco-proud.",
    imageUrl: `${BASE_URL}/products/eco-white.svg`,
    availableSizes: ["Small (20×10×25 cm)", "Medium (30×12×35 cm)", "Large (40×15×45 cm)"],
    ecoFriendly: true,
  },
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/paperbag";
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");

    const existing = await Product.countDocuments();
    if (existing > 0) {
      await Product.deleteMany({});
      console.log(`🗑️  Cleared ${existing} existing products`);
    }

    const inserted = await Product.insertMany(PRODUCTS);
    console.log(`\n🌿 Seeded ${inserted.length} products:\n`);
    inserted.forEach((p, i) =>
      console.log(`  ${i + 1}. ${p.name}  —  ₹${p.price}`)
    );
    console.log("\n✨ Done! Run your backend & frontend to see them live.\n");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();

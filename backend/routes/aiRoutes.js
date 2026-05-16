const express   = require("express");
const Groq      = require("groq-sdk");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max:      20,
  message:  { message: "AI chat limit reached. Please wait a minute." },
});

const client = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are Leaf, a friendly and knowledgeable AI assistant for Paperbag — an eco-friendly handmade paper bag store based in Mumbai, India.

About Paperbag:
- We sell 100% eco-friendly, handmade paper bags for shopping, gifting, and custom packaging
- All bags are made from recycled and biodegradable materials
- We offer custom orders with branding, colors, and sizes
- Prices start from ₹50 for basic bags, premium and custom bags vary
- We ship across India with fast delivery
- Payment via Razorpay (online) or Cash on Delivery
- For contact details, direct users to the Contact page on the website

Your job:
- Help customers find the right bag for their needs
- Answer questions about products, pricing, delivery, and custom orders
- Guide users through the checkout process
- Highlight eco-friendly benefits enthusiastically
- Be warm, concise, and helpful
- Always respond in the same language the user writes in
- Keep responses under 120 words unless the user asks for detail
- Use emojis sparingly but effectively 🌿`;

// POST /api/ai/chat
router.post("/chat", aiLimiter, async (req, res) => {
  if (!client) {
    return res.status(503).json({ message: "AI assistant not configured. Add GROQ_API_KEY to .env" });
  }

  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: "Messages array is required." });
  }

  // Keep last 10 messages for context
  const history = messages.slice(-10).map((m) => ({
    role:    m.role === "assistant" ? "assistant" : "user",
    content: String(m.content).slice(0, 500),
  }));

  try {
    const response = await client.chat.completions.create({
      model:       "llama-3.1-8b-instant",  // free, fast Llama 3.1 8B
      max_tokens:  300,
      messages:    [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    });

    const text = response.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    res.json({ reply: text });
  } catch (error) {
    console.error("AI chat error:", error.message);
    res.status(500).json({ message: "AI assistant is temporarily unavailable." });
  }
});

module.exports = router;

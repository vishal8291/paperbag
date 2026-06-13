require("dotenv").config();

// ── Strip insecure dev-only flags in production ───────────────
if (process.env.NODE_ENV === "production") {
  delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
}

// ── Startup env validation ────────────────────────────────────
const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET must be at least 32 characters long for security.");
  process.exit(1);
}

const express      = require("express");
const cors         = require("cors");
const helmet       = require("helmet");
const rateLimit    = require("express-rate-limit");
const path         = require("path");

const connectDB    = require("./config/db");

const userRoutes        = require("./routes/userRoutes");
const productRoutes     = require("./routes/productRoutes");
const orderRoutes       = require("./routes/orderRoutes");
const paymentRoutes     = require("./routes/paymentRoutes");
const contactRoutes     = require("./routes/contactRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const newsletterRoutes  = require("./routes/newsletterRoutes");
const getInTouchRoutes  = require("./routes/getInTouchRoutes");
const customOrderRoutes = require("./routes/customOrderRoutes");
const inquiryRoutes     = require("./routes/inquiryRoutes");
const aiRoutes          = require("./routes/aiRoutes");
const couponRoutes      = require("./routes/couponRoutes");
const reviewRoutes      = require("./routes/reviewRoutes");
const referralRoutes    = require("./routes/referralRoutes");
const storeRoutes       = require("./routes/storeRoutes");

const { resolveTenant } = require("./middleware/tenant");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect DB ────────────────────────────────────────────────
connectDB();

// ── Security headers ──────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", "data:", "https:", "blob:"],
      connectSrc:  ["'self'", process.env.CLIENT_URL, "https://api.groq.com", "https://accounts.google.com"].filter(Boolean),
      frameSrc:    ["'none'"],
      objectSrc:   ["'none'"],
      baseUri:     ["'self'"],
      formAction:  ["'self'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));

// ── CORS ──────────────────────────────────────────────────────
// Add all allowed origins as comma-separated values in ALLOWED_ORIGINS env var.
// Example: ALLOWED_ORIGINS=https://paperbag.in,https://paperbag.vercel.app
const extraOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean)
  : [];

const allowedOrigins = [
  ...extraOrigins,
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:3001",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman in dev)
    if (!origin) return callback(null, true);
    
    // Always allow localhost/127.0.0.1 on any port in development
    if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
      return callback(null, true);
    }
    
    // Allow any local network IP 192.168.x.x on any port
    if (/^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    // Allow Vercel deployments
    if (origin.endsWith(".vercel.app") || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ── Global rate limiting ──────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      200,
  message:  { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders:   false,
}));

// ── Stricter limit on auth routes ─────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { message: "Too many login attempts. Please wait 15 minutes." },
});
app.use("/api/users/login",    authLimiter);
app.use("/api/users/register", authLimiter);
app.use("/api/users/google",   authLimiter);

// ── Body parser ───────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static uploads (local fallback) ──────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────
app.use(resolveTenant);

app.use("/api/stores",       storeRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/products",     productRoutes);
app.use("/api/orders",       orderRoutes);
app.use("/api/payment",      paymentRoutes);
app.use("/api/contact",      contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/newsletter",   newsletterRoutes);
app.use("/api/getintouch",   getInTouchRoutes);
app.use("/api/customorders", customOrderRoutes);
app.use("/api/inquiry",      inquiryRoutes);
app.use("/api/ai",           aiRoutes);
app.use("/api/coupons",      couponRoutes);
app.use("/api/reviews",     reviewRoutes);
app.use("/api/referral",    referralRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => res.send("Paperbag API Running ✅"));

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// ── Error handler ─────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  const status  = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error.";
  res.status(status).json({ message });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔒 JWT auth enabled`);
  console.log(`📧 Email: ${process.env.SMTP_USER ? "configured" : "not configured"}`);
  console.log(`💳 Razorpay: ${process.env.RAZORPAY_KEY_ID ? "configured" : "not configured"}`);
  console.log(`☁️  Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "using local uploads"}`);
});

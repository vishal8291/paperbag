const jwt            = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist");

// ── Protect — verify JWT + check blacklist ─────────────────────
async function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorised. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  // 1. Verify signature & expiry first (cheap — no DB hit on invalid tokens)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Token expired or invalid. Please log in again." });
  }

  // 2. Check if token was explicitly revoked (logout)
  try {
    const revoked = await TokenBlacklist.findOne({ token }).lean();
    if (revoked) {
      return res.status(401).json({ message: "Session has been revoked. Please log in again." });
    }
  } catch {
    // If blacklist check fails, fail open (don't block legitimate users due to DB issue)
    console.error("[auth] Blacklist check failed — proceeding without it");
  }

  req.user = decoded; // { id, name, email, role }
  next();
}

// ── Admin-only guard ───────────────────────────────────────────
function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}

// ── Optional auth (attaches user if token valid, never blocks) ──
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
    } catch {
      // ignore expired/invalid token — route handles unauthenticated state
    }
  }
  next();
}

module.exports = { protect, adminOnly, optionalAuth };

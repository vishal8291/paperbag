const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const crypto  = require("crypto");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const User           = require("../models/User");
const Otp            = require("../models/Otp");
const TokenBlacklist = require("../models/TokenBlacklist");
const { sendWelcomeEmail, sendOtpEmail } = require("../utils/sendEmail");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Constants ──────────────────────────────────────────────────
const EMAIL_REGEX    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASS_LEN   = 8;   // minimum password length
const MAX_LOGIN_FAIL = 5;   // lock after this many failures
const LOCK_DURATION  = 15 * 60 * 1000; // 15 minutes in ms

// ── Helper: sign JWT ───────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// ── Helper: safe user response (never return password/hashes) ──
function safeUser(user) {
  return {
    _id:      user._id,
    name:     user.name,
    email:    user.email,
    mobile:   user.mobile,
    role:     user.role,
    avatar:   user.avatar,
    wishlist: user.wishlist,
  };
}

// ── POST /api/users/register ───────────────────────────────────
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < MIN_PASS_LEN) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASS_LEN} characters.` });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed });

    sendWelcomeEmail(user.email, user.name).catch(() => {});

    const token = signToken(user);
    res.status(201).json({ message: "Account created successfully.", token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Registration failed." });
  }
};

// ── POST /api/users/login ──────────────────────────────────────
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generic message — never reveal whether email exists
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(429).json({
        message: `Account temporarily locked. Try again in ${mins} minute${mins !== 1 ? "s" : ""}.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Increment failure counter
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_LOGIN_FAIL) {
        user.lockUntil           = new Date(Date.now() + LOCK_DURATION);
        user.failedLoginAttempts = 0;
        await user.save();
        return res.status(429).json({
          message: `Too many failed attempts. Account locked for 15 minutes.`,
        });
      }
      await user.save();
      const remaining = MAX_LOGIN_FAIL - user.failedLoginAttempts;
      return res.status(401).json({
        message: `Invalid email or password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
      });
    }

    // Successful login — reset counters
    user.failedLoginAttempts = 0;
    user.lockUntil           = null;
    await user.save();

    const token = signToken(user);
    res.json({ message: "Login successful.", token, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Login failed." });
  }
};

// ── POST /api/users/logout ─────────────────────────────────────
exports.logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.exp) {
        // Blacklist until natural expiry — TTL index auto-cleans it
        await TokenBlacklist.create({
          token,
          expiresAt: new Date(decoded.exp * 1000),
        }).catch(() => {}); // ignore duplicate inserts
      }
    }
    res.json({ message: "Logged out successfully." });
  } catch {
    res.json({ message: "Logged out." });
  }
};

// ── POST /api/users/google ─────────────────────────────────────
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Google credential required." });

    const ticket  = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (!user) {
      user = await User.create({
        name, email: email.toLowerCase(), googleId,
        avatar: picture, role: "user",
      });
      sendWelcomeEmail(user.email, user.name).catch(() => {});
    } else {
      // Always sync googleId and avatar from Google (handles new OAuth client, avatar updates)
      let dirty = false;
      if (user.googleId !== googleId) { user.googleId = googleId; dirty = true; }
      if (picture && user.avatar !== picture) { user.avatar = picture; dirty = true; }
      if (dirty) await user.save();
    }

    const token = signToken(user);
    res.json({ message: "Google login successful.", token, user: safeUser(user) });
  } catch {
    res.status(401).json({ message: "Google authentication failed." });
  }
};

// ── GET /api/users/me ──────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist", "name price imageUrl");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(safeUser(user));
  } catch {
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

// ── PUT /api/users/profile ─────────────────────────────────────
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;
    // Sanitize name — alphanumeric + spaces only, max 60 chars
    const safeName   = name   ? String(name).replace(/[<>\"']/g, "").trim().slice(0, 60)   : undefined;
    const safeMobile = mobile ? String(mobile).replace(/\D/g, "").slice(0, 15)              : undefined;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...(safeName   && { name: safeName }),
        ...(safeMobile && { mobile: safeMobile }) },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ message: "Profile updated successfully.", user: safeUser(user) });
  } catch {
    res.status(500).json({ message: "Update failed." });
  }
};

// ── POST /api/users/wishlist/:productId ────────────────────────
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId to prevent NoSQL injection
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const idx = user.wishlist.findIndex((id) => id.toString() === productId);
    const action = idx === -1 ? "added" : "removed";
    if (idx === -1) user.wishlist.push(productId);
    else            user.wishlist.splice(idx, 1);
    await user.save();

    const populated = await User.findById(req.user.id).populate("wishlist", "name price imageUrl");
    res.json({ action, wishlist: populated.wishlist });
  } catch {
    res.status(500).json({ message: "Wishlist update failed." });
  }
};

// ── GET /api/users/wishlist ────────────────────────────────────
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist", "name price imageUrl description ecoFriendly");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user.wishlist);
  } catch {
    res.status(500).json({ message: "Failed to fetch wishlist." });
  }
};

// ── POST /api/users/send-otp ───────────────────────────────────
exports.sendOtp = async (req, res) => {
  try {
    const { email, type = "auth", name } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const emailLc = email.toLowerCase().trim();

    // Rate-limit: max 3 OTPs per 10 min per email
    const recent = await Otp.countDocuments({ identifier: emailLc, type });
    if (recent >= 3) {
      return res.status(429).json({ message: "Too many OTP requests. Please wait 10 minutes." });
    }

    const otp     = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ identifier: emailLc, type });
    await Otp.create({ identifier: emailLc, otpHash, type, name: name || "" });

    // Send email — if it fails, return error (don't leak OTP in logs)
    try {
      await sendOtpEmail(emailLc, otp, type);
    } catch (emailErr) {
      console.error("[OTP] Email delivery failed:", emailErr.message);
      return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }

    const userExists = !!(await User.findOne({ email: emailLc }));
    res.json({ message: "OTP sent to your email.", userExists });
  } catch {
    res.status(500).json({ message: "Failed to send OTP." });
  }
};

// ── POST /api/users/verify-otp ─────────────────────────────────
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, name } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const emailLc = email.toLowerCase().trim();
    const record  = await Otp.findOne({ identifier: emailLc, type: "auth" });
    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
    }

    if (record.attempts >= 5) {
      await record.deleteOne();
      return res.status(400).json({ message: "Too many failed attempts. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(String(otp), record.otpHash);
    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: `Incorrect OTP. ${5 - record.attempts} attempt(s) remaining.` });
    }

    await record.deleteOne();

    let user = await User.findOne({ email: emailLc });
    let isNew = false;

    if (!user) {
      const userName = name?.trim() || record.name || emailLc.split("@")[0];
      user  = await User.create({ name: userName.slice(0, 60), email: emailLc });
      isNew = true;
      sendWelcomeEmail(emailLc, userName).catch(() => {});
    }

    const token = signToken(user);
    res.json({
      message: isNew ? "Account created and logged in!" : "Login successful.",
      token,
      user: safeUser(user),
      isNew,
    });
  } catch {
    res.status(500).json({ message: "OTP verification failed." });
  }
};

// ── POST /api/users/forgot-password ───────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const emailLc = email.toLowerCase().trim();

    // Always return same message — prevent email enumeration
    const genericMsg = { message: "If an account exists, a reset OTP has been sent." };

    if (!EMAIL_REGEX.test(emailLc)) return res.json(genericMsg);

    const user = await User.findOne({ email: emailLc });
    if (!user) return res.json(genericMsg);

    const recent = await Otp.countDocuments({ identifier: emailLc, type: "reset" });
    if (recent >= 3) {
      return res.status(429).json({ message: "Too many requests. Please wait 10 minutes." });
    }

    const otp     = String(Math.floor(100000 + Math.random() * 900000));
    const otpHash = await bcrypt.hash(otp, 10);
    await Otp.deleteMany({ identifier: emailLc, type: "reset" });
    await Otp.create({ identifier: emailLc, otpHash, type: "reset" });

    sendOtpEmail(emailLc, otp, "reset").catch((e) =>
      console.error("[forgot-password] Email failed:", e.message)
    );

    res.json(genericMsg);
  } catch {
    res.status(500).json({ message: "Failed to process request." });
  }
};

// ── POST /api/users/reset-password ────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (newPassword.length < MIN_PASS_LEN) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASS_LEN} characters.` });
    }

    const emailLc = email.toLowerCase().trim();
    const record  = await Otp.findOne({ identifier: emailLc, type: "reset" });

    if (!record) {
      return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
    }
    if (record.attempts >= 5) {
      await record.deleteOne();
      return res.status(400).json({ message: "Too many failed attempts. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(String(otp), record.otpHash);
    if (!isMatch) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ message: `Incorrect OTP. ${5 - record.attempts} attempt(s) remaining.` });
    }

    await record.deleteOne();

    const hashed = await bcrypt.hash(newPassword, 12);
    const user   = await User.findOneAndUpdate(
      { email: emailLc },
      { password: hashed },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found." });

    const token = signToken(user);
    res.json({ message: "Password reset successful!", token, user: safeUser(user) });
  } catch {
    res.status(500).json({ message: "Password reset failed." });
  }
};

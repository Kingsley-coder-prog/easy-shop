// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { findUserById } = require("../models/usersSheet");
const { isTokenBlacklisted } = require("../utils/tokenBlacklist");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header)
      return res.status(401).json({ error: "Missing Authorization header" });
    const token = header.split(" ")[1];
    if (await isTokenBlacklisted(token))
      return res.status(401).json({ msg: "Authentication invalid" });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Authentication invalid" });
    }

    // optionally verify user still exists
    const user = await findUserById(decoded.user_id);
    if (!user) return res.status(401).json({ error: "User not found" });

    // attach to req
    req.user = { user_id: user.user_id, role: user.role };
    req.token = token;

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  next();
}

module.exports = { auth, adminOnly };

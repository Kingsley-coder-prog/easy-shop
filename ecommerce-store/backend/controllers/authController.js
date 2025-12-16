// Auth Controller
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const bcrypt = require("bcryptjs");
const {
  getUsers,
  findUserByEmail,
  createUser,
} = require("../models/usersSheet");
const jwt = require("jsonwebtoken");
const { blacklistToken } = require("../utils/tokenBlacklist");
const {
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
} = require("../models/refreshTokensSheet");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

// register
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    // role is not accepted from public registration; new users are 'user' by default
    const allUsers = await getUsers();
    const isFirstUser = allUsers.length === 0;

    // First registered user becomes admin
    const role = isFirstUser ? "admin" : "user";

    const result = await createUser({ name, email, password, role });

    if (result.status && result.status !== 201) {
      return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;
    // generate token (exclude password_hash in token payload)
    const accessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    await createRefreshToken(
      user.user_id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    );

    // return safe user object
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    return res.status(StatusCodes.CREATED).json({
      message: isFirstUser
        ? "First user registered as administrator"
        : "User registered",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("REGISTER ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// Admin-only registration endpoint
async function registerAdmin(req, res) {
  try {
    // Check if current user is admin
    if (req.user.role !== "admin") {
      throw new CustomError.UnauthorizedError(
        "Only administrators can create admin accounts"
      );
    }

    const { name, email, password } = req.body;
    const result = await createUser({
      name,
      email,
      password,
      role: "admin",
    });

    if (result.status && result.status !== 201) {
      return res.status(result.status).json({ error: result.error });
    }

    const user = result.user;
    const accessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    await createRefreshToken(
      user.user_id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    );

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    return res.status(StatusCodes.CREATED).json({
      message: "Administrator account created",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("ADMIN REGISTER ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      throw new CustomError.BadRequestError("Invalid credentials");
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new CustomError.BadRequestError("Invalid credentials");
    }

    const accessToken = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN,
    });

    await createRefreshToken(
      user.user_id,
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    );

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };

    return res.status(StatusCodes.OK).json({
      message: "Logged in",
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ error: "Authentication invalid" });

    const stored = await findRefreshToken(refreshToken);
    if (!stored)
      return res.status(401).json({ error: "Authentication invalid" });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_SECRET);
    } catch {
      return res.status(401).json({ error: "Authentication invalid" });
    }

    const accessToken = jwt.sign({ user_id: decoded.user_id }, JWT_SECRET, {
      expiresIn: ACCESS_EXPIRES_IN,
    });

    return res.json({ accessToken });
  } catch (err) {
    console.error("REFRESH ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// logout (single device)
async function logout(req, res) {
  try {
    // JWT is stateless → nothing to invalidate server-side
    // Client should delete token (localStorage / cookie)
    blacklistToken(req.token);

    if (req.body.refreshToken) {
      await revokeRefreshToken(req.body.refreshToken);
    }

    return res.status(StatusCodes.OK).json({
      message: "user logged out",
    });
  } catch (err) {
    console.error("LOGOUT ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// logout from all devices
async function logoutAll(req, res) {
  try {
    blacklistToken(req.token);
    await revokeAllUserRefreshTokens(req.user.user_id);

    return res.json({
      message: "Logged out from all devices",
    });
  } catch (err) {
    console.error("LOGOUT ALL ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  register,
  registerAdmin,
  login,
  refresh,
  logout,
  logoutAll,
};

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

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const JWT_EXPIRES_IN = process.env.JWT_LIFETIME;

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
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
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
      token,
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
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
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
      token,
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
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
    console.log("Login attempt email:", email);
    console.log("Found user:", user);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Logged in", user: safeUser, token });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  register,
  login,
  registerAdmin,
};

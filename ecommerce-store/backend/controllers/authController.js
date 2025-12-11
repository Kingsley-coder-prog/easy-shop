// Auth Controller
const {
  getUsers,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  findUserById,
} = require("../models/usersSheet");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const JWT_EXPIRES_IN = "7d";

// register
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    // role is not accepted from public registration; new users are 'user' by default
    const result = await createUser({ name, email, password, role: "user" });

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

    return res
      .status(201)
      .json({ message: "User registered", user: safeUser, token });
  } catch (err) {
    console.error("REGISTER ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const bcrypt = require("bcryptjs");
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

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

    return res.json({ message: "Logged in", user: safeUser, token });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// get current user (requires auth middleware to set req.user)
async function me(req, res) {
  try {
    const user = await findUserById(req.user.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
    return res.json({ user: safeUser });
  } catch (err) {
    console.error("ME ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// admin - list all users
async function listUsers(req, res) {
  try {
    const users = await getUsers();
    // remove password_hash from response
    const safe = users.map((u) => ({
      user_id: u.user_id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
    }));
    return res.json({ count: safe.length, users: safe });
  } catch (err) {
    console.error("LIST USERS ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// admin - update user
async function adminUpdateUser(req, res) {
  try {
    const user_id = req.params.id;
    const newData = req.body;
    // allow role change only for admin route
    const result = await updateUser(user_id, newData, {
      allowRoleChange: true,
    });
    if (result.status && result.status !== 200)
      return res.status(result.status).json({ error: result.error });
    const user = result.user;
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
    return res.json({ message: "User updated", user: safeUser });
  } catch (err) {
    console.error("ADMIN UPDATE ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// delete user (admin only)
async function adminDeleteUser(req, res) {
  try {
    const user_id = req.params.id;
    const result = await deleteUser(user_id);
    if (result.status && result.status !== 200) {
      // if 404, forward
      return res.status(result.status).json({ error: result.error });
    }
    return res.json({ message: result.message });
  } catch (err) {
    console.error("ADMIN DELETE ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  register,
  login,
  me,
  listUsers,
  adminUpdateUser,
  adminDeleteUser,
};

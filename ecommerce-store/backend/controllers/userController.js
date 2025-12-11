const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  getUsers,
  updateUser,
  deleteUser,
  findUserById,
} = require("../models/usersSheet");

// get current user (requires auth middleware to set req.user)
async function getCurrentUser(req, res) {
  try {
    const user = await findUserById(req.user.user_id);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
    return res.status(StatusCodes.OK).json({ user: safeUser });
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
    return res.status(StatusCodes.OK).json({ count: safe.length, users: safe });
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
    return res
      .status(StatusCodes.OK)
      .json({ message: "User updated", user: safeUser });
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
    return res.status(StatusCodes.OK).json({ message: result.message });
  } catch (err) {
    console.error("ADMIN DELETE ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getCurrentUser,
  listUsers,
  adminUpdateUser,
  adminDeleteUser,
};

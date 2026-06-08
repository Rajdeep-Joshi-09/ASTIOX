const bcrypt = require("bcryptjs");
const userService = require("../services/user.service");

// ─── Validators ───────────────────────────────────────────────

function validateEmail(email) {
  if (!email || !email.trim()) {
    const err = new Error("Email is required");
    err.statusCode = 400;
    throw err;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    const err = new Error("Invalid email format");
    err.statusCode = 400;
    throw err;
  }
  return email.trim().toLowerCase();
}

function validateUsername(username) {
  if (!username || !username.trim()) {
    const err = new Error("Username is required");
    err.statusCode = 400;
    throw err;
  }
  const name = username.trim();
  if (name.length < 3 || name.length > 50) {
    const err = new Error("Username length must be between 3 to 50");
    err.statusCode = 400;
    throw err;
  }
  return name;
}

function validateUserType(userType) {
  const allowed = ["admin", "super_admin", "sub_admin"];
  if (!userType || !allowed.includes(userType)) {
    const err = new Error("User type must be admin, super_admin, or sub_admin");
    err.statusCode = 400;
    throw err;
  }
  return userType;
}

function validatePasswords(password, confirmPassword) {
  if (!password) {
    const err = new Error("Password is required");
    err.statusCode = 400;
    throw err;
  }
  if (password.length < 6) {
    const err = new Error("Password must be at least 6 characters");
    err.statusCode = 400;
    throw err;
  }
  if (password !== confirmPassword) {
    const err = new Error("Passwords do not match");
    err.statusCode = 400;
    throw err;
  }
}

// ─── Controllers ──────────────────────────────────────────────

const createUser = async (req, res) => {
  try {
    const { username, userEmail, userType, password, confirmPassword } =
      req.body;

    const user_name = validateUsername(username);
    const user_email = validateEmail(userEmail);
    const user_type = validateUserType(userType);
    validatePasswords(password, confirmPassword);

    if (req.user?.user_type === "sub_admin" && user_type === "super_admin") {
      return res.status(403).json({ message: "Cannot create super admin users" });
    }

    const existing = await userService.findUserByEmail(user_email);
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser({
      user_name,
      user_email,
      user_type,
      password: hashedPassword,
      is_status: 1,
      is_delete: 0,
    });

    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: {
        id: user.id,
        userName: user.user_name,
        userEmail: user.user_email,
        userType: user.user_type,
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const viewerType = req.user?.user_type;
    const usersData = await userService.getAllUsers(viewerType);
    const users = usersData.map((u) => ({
      id: u.id,
      userName: u.user_name,
      userEmail: u.user_email,
      userType: u.user_type,
      isStatus: u.is_status === 1 ? "Active" : "Inactive",
      createdDate: u.created_date,
    }));
    res.status(200).json({
      status: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getOneUser(Number(id));
    if (!user) {
      return res.status(404).json({ message: "No user found on this Id" });
    }
    if (req.user?.user_type !== "super_admin" && user.user_type === "super_admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json({
      status: true,
      message: "User found",
      data: {
        id: user.id,
        userName: user.user_name,
        userEmail: user.user_email,
        userType: user.user_type,
        isStatus: user.is_status === 1 ? "Active" : "Inactive",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, userEmail, userType, isStatus } = req.body;

    const existing = await userService.getOneUser(Number(id));
    if (!existing) {
      return res.status(404).json({ message: "No user found on this Id" });
    }

    if (req.user?.user_type !== "super_admin") {
      if (existing.user_type === "super_admin") {
        return res.status(403).json({ message: "Cannot modify super admin users" });
      }
      if (userType === "super_admin") {
        return res.status(403).json({ message: "Cannot assign super admin role" });
      }
    }

    const user_name = validateUsername(username);
    const user_email = validateEmail(userEmail);
    const user_type = validateUserType(userType);

    await userService.updateUser({
      id: Number(id),
      user_name,
      user_email,
      user_type,
      is_status: Number(isStatus),
    });

    res
      .status(200)
      .json({ status: true, message: "User updated successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "No record found on this Id" });
    }
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "No user found on this Id" });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };

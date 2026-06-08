const bcrypt = require("bcryptjs");
const { signToken } = require("../../utils/jwt");
const {
  findUserByEmail,
  findAnyUserByEmail,
  createAuthUser,
  getUserById,
} = require("../services/auth.service");

function validateEmail(email) {
  if (!email?.trim()) {
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
  if (!username?.trim()) {
    const err = new Error("Username is required");
    err.statusCode = 400;
    throw err;
  }
  const name = username.trim();
  if (name.length < 3 || name.length > 50) {
    const err = new Error("Username must be between 3 to 50 characters");
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
  if (confirmPassword !== undefined && password !== confirmPassword) {
    const err = new Error("Passwords do not match");
    err.statusCode = 400;
    throw err;
  }
}

const register = async (req, res) => {
  try {
    const { username, userEmail, userType, password, confirmPassword } =
      req.body;

    const user_name = validateUsername(username);
    const user_email = validateEmail(userEmail);
    const user_type = validateUserType(userType || "admin");
    validatePasswords(password, confirmPassword);

    const existing = await findAnyUserByEmail(user_email);
    if (existing) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createAuthUser({
      user_name,
      user_email,
      user_type,
      password: hashedPassword,
      is_status: 1,
      is_delete: 0,
    });

    const token = signToken({
      id: user.id,
      email: user.user_email,
      userName: user.user_name,
      userType: user.user_type,
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      user: {
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user.id,
      email: user.user_email,
      userName: user.user_name,
      userType: user.user_type,
    });

    res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userName: user.user_name,
        userEmail: user.user_email,
        userType: user.user_type,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.admin.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { getMenusForUserType } = require("../services/permission.service");
    const menus = await getMenusForUserType(user.user_type);

    res.status(200).json({
      status: true,
      data: {
        id: user.id,
        userName: user.user_name,
        userEmail: user.user_email,
        userType: user.user_type,
        isStatus: user.is_status === 1 ? "Active" : "Inactive",
        menus: menus.map((m) => ({
          menuKey: m.menu_key,
          menuName: m.menu_name,
          menuPath: m.menu_path,
          icon: m.icon,
          isDeveloperOnly: m.is_developer_only === 1,
        })),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe };

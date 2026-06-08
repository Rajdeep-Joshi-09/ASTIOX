const { getUserById } = require("../src/services/auth.service");

const loadUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.admin.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const requireSuperAdmin = (req, res, next) => {
  if (req.user?.user_type !== "super_admin") {
    return res.status(403).json({ message: "Access denied. Super admin only." });
  }
  next();
};

module.exports = { loadUser, requireSuperAdmin };

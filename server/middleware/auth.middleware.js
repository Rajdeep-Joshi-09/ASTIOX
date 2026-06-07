const { verifyToken } = require("../utils/jwt");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

module.exports = { protect };

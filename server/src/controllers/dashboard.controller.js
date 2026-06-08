const dashboardService = require("../services/dashboard.service");

const getStats = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats(req.user.user_type);
    res.status(200).json({ status: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats };

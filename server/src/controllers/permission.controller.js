const permissionService = require("../services/permission.service");

const ALLOWED_ROLES = ["admin", "sub_admin"];

const getRolePermissions = async (req, res) => {
  try {
    const { userType } = req.params;
    if (!ALLOWED_ROLES.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }
    const permissions = await permissionService.getPermissionsByRole(userType);
    res.status(200).json({ status: true, data: permissions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateRolePermissions = async (req, res) => {
  try {
    const { userType } = req.params;
    const { permissions } = req.body;

    if (!ALLOWED_ROLES.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "Permissions array required" });
    }

    await permissionService.updateRolePermissions(userType, permissions);
    res.status(200).json({ status: true, message: "Permissions updated successfully" });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { getRolePermissions, updateRolePermissions };

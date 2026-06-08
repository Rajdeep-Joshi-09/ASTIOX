const express = require("express");
const {
  getRolePermissions,
  updateRolePermissions,
} = require("../controllers/permission.controller");
const { loadUser, requireSuperAdmin } = require("../../middleware/role.middleware");

const router = express.Router();

router.use(loadUser, requireSuperAdmin);

router.get("/:userType", getRolePermissions);
router.put("/:userType", updateRolePermissions);

module.exports = router;

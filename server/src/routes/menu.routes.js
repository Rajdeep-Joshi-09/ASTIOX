const express = require("express");
const {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu.controller");
const { loadUser, requireSuperAdmin } = require("../../middleware/role.middleware");

const router = express.Router();

router.use(loadUser, requireSuperAdmin);

router.get("/", getMenus);
router.get("/:id", getMenuById);
router.post("/", createMenu);
router.put("/:id", updateMenu);
router.delete("/:id", deleteMenu);

module.exports = router;

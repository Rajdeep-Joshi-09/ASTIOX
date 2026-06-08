const menuService = require("../services/menu.service");

function validateMenu(body) {
  const menu_name = body.menuName?.trim();
  const menu_key = body.menuKey?.trim().toLowerCase();
  const menu_path = body.menuPath?.trim();

  if (!menu_name || menu_name.length < 2) {
    const err = new Error("Menu name is required");
    err.statusCode = 400;
    throw err;
  }
  if (!menu_key || !/^[a-z0-9-]+$/.test(menu_key)) {
    const err = new Error("Menu key must be lowercase alphanumeric with hyphens");
    err.statusCode = 400;
    throw err;
  }
  if (!menu_path || !menu_path.startsWith("/admin")) {
    const err = new Error("Menu path must start with /admin");
    err.statusCode = 400;
    throw err;
  }

  return {
    menu_name,
    menu_key,
    menu_path,
    icon: body.icon?.trim() || null,
    sort_order: Number(body.sortOrder) || 0,
    is_developer_only: body.isDeveloperOnly ? 1 : 0,
    is_status: body.isStatus !== undefined ? Number(body.isStatus) : 1,
  };
}

const mapMenu = (m) => ({
  id: m.id,
  menuName: m.menu_name,
  menuKey: m.menu_key,
  menuPath: m.menu_path,
  icon: m.icon,
  sortOrder: m.sort_order,
  isDeveloperOnly: m.is_developer_only === 1,
  isStatus: m.is_status === 1 ? "Active" : "Inactive",
});

const createMenu = async (req, res) => {
  try {
    const menu = await menuService.createMenu(validateMenu(req.body));
    res.status(201).json({
      status: true,
      message: "Menu created successfully",
      data: mapMenu(menu),
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getMenus = async (req, res) => {
  try {
    const menus = await menuService.getAllMenus();
    res.status(200).json({
      status: true,
      data: menus.map(mapMenu),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMenuById = async (req, res) => {
  try {
    const menu = await menuService.getOneMenu(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.status(200).json({
      status: true,
      data: { ...mapMenu(menu), isStatus: menu.is_status },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    await menuService.updateMenu({
      id: Number(req.params.id),
      ...validateMenu(req.body),
    });
    res.status(200).json({ status: true, message: "Menu updated successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    await menuService.deleteMenu(req.params.id);
    res.status(200).json({ status: true, message: "Menu deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Menu not found" });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createMenu, getMenus, getMenuById, updateMenu, deleteMenu };

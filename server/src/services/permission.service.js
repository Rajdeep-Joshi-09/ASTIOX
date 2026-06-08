const prisma = require("../prisma/prismaClient");

const getMenusForUserType = async (userType) => {
  if (userType === "super_admin") {
    return prisma.Menu.findMany({
      where: { is_delete: 0, is_status: 1 },
      orderBy: [{ sort_order: "asc" }, { id: "asc" }],
    });
  }

  const permissions = await prisma.RoleMenuPermission.findMany({
    where: { user_type: userType, can_access: 1 },
    include: { menu: true },
  });

  return permissions
    .map((p) => p.menu)
    .filter((m) => m && m.is_delete === 0 && m.is_status === 1)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
};

const getPermissionsByRole = async (userType) => {
  const menus = await prisma.Menu.findMany({
    where: { is_delete: 0, is_status: 1 },
    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
  });

  if (userType === "super_admin") {
    return menus.map((m) => ({
      menuId: m.id,
      menuName: m.menu_name,
      menuKey: m.menu_key,
      menuPath: m.menu_path,
      isDeveloperOnly: m.is_developer_only === 1,
      canAccess: true,
    }));
  }

  const permissions = await prisma.RoleMenuPermission.findMany({
    where: { user_type: userType },
  });
  const permMap = Object.fromEntries(
    permissions.map((p) => [p.menu_id, p.can_access === 1])
  );

  return menus.map((m) => ({
    menuId: m.id,
    menuName: m.menu_name,
    menuKey: m.menu_key,
    menuPath: m.menu_path,
    isDeveloperOnly: m.is_developer_only === 1,
    canAccess: Boolean(permMap[m.id]),
  }));
};

const updateRolePermissions = async (userType, menuPermissions) => {
  if (userType === "super_admin") {
    const err = new Error("Cannot modify super admin permissions");
    err.statusCode = 400;
    throw err;
  }

  await prisma.$transaction(
    menuPermissions.map(({ menuId, canAccess }) =>
      prisma.RoleMenuPermission.upsert({
        where: {
          user_type_menu_id: { user_type: userType, menu_id: Number(menuId) },
        },
        update: { can_access: canAccess ? 1 : 0 },
        create: {
          user_type: userType,
          menu_id: Number(menuId),
          can_access: canAccess ? 1 : 0,
        },
      })
    )
  );
};

const hasMenuAccess = async (userType, menuKey) => {
  if (userType === "super_admin") return true;

  const menu = await prisma.Menu.findFirst({
    where: { menu_key: menuKey, is_delete: 0, is_status: 1 },
  });
  if (!menu) return false;

  const perm = await prisma.RoleMenuPermission.findUnique({
    where: {
      user_type_menu_id: { user_type: userType, menu_id: menu.id },
    },
  });
  return perm?.can_access === 1;
};

module.exports = {
  getMenusForUserType,
  getPermissionsByRole,
  updateRolePermissions,
  hasMenuAccess,
};

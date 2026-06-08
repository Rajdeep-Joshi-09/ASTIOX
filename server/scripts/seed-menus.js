const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MENUS = [
  { menu_name: "Dashboard", menu_key: "dashboard", menu_path: "/admin", icon: "layout-dashboard", sort_order: 1, is_developer_only: 0 },
  { menu_name: "Users", menu_key: "users", menu_path: "/admin/users", icon: "users", sort_order: 2, is_developer_only: 0 },
  { menu_name: "Category", menu_key: "category", menu_path: "/admin/category", icon: "folder", sort_order: 3, is_developer_only: 0 },
  { menu_name: "Collection", menu_key: "collection", menu_path: "/admin/collection", icon: "layers", sort_order: 4, is_developer_only: 0 },
  { menu_name: "Products", menu_key: "products", menu_path: "/admin/products", icon: "package", sort_order: 5, is_developer_only: 0 },
  { menu_name: "Menu Master", menu_key: "menu-master", menu_path: "/admin/menu-master", icon: "menu", sort_order: 6, is_developer_only: 1 },
  { menu_name: "Role Rights", menu_key: "role-rights", menu_path: "/admin/role-rights", icon: "shield", sort_order: 7, is_developer_only: 1 },
];

const ROLE_DEFAULTS = {
  sub_admin: ["dashboard", "users", "category", "collection", "products"],
  admin: ["dashboard", "category", "collection", "products"],
};

async function main() {
  for (const menu of MENUS) {
    await prisma.Menu.upsert({
      where: { menu_key: menu.menu_key },
      update: menu,
      create: { ...menu, is_status: 1, is_delete: 0 },
    });
  }

  const allMenus = await prisma.Menu.findMany({ where: { is_delete: 0 } });
  const menuByKey = Object.fromEntries(allMenus.map((m) => [m.menu_key, m]));

  for (const [role, keys] of Object.entries(ROLE_DEFAULTS)) {
    for (const menu of allMenus) {
      const canAccess = keys.includes(menu.menu_key) ? 1 : 0;
      await prisma.RoleMenuPermission.upsert({
        where: {
          user_type_menu_id: { user_type: role, menu_id: menu.id },
        },
        update: { can_access: canAccess },
        create: { user_type: role, menu_id: menu.id, can_access: canAccess },
      });
    }
  }

  console.log("Seeded", allMenus.length, "menus and role permissions");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

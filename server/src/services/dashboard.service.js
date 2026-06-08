const prisma = require("../prisma/prismaClient");

const getDashboardStats = async (userType) => {
  const baseWhere = { is_delete: 0 };

  if (userType === "super_admin") {
    const [users, categories, collections, products, menus, permissions] =
      await Promise.all([
        prisma.User.count({ where: baseWhere }),
        prisma.Category.count({ where: baseWhere }),
        prisma.Collection.count({ where: baseWhere }),
        prisma.Product.count({ where: baseWhere }),
        prisma.Menu.count({ where: baseWhere }),
        prisma.RoleMenuPermission.count({ where: { can_access: 1 } }),
      ]);

    return {
      role: "super_admin",
      stats: [
        { key: "users", label: "Total Users", value: users, icon: "users" },
        { key: "categories", label: "Categories", value: categories, icon: "folder" },
        { key: "collections", label: "Collections", value: collections, icon: "layers" },
        { key: "products", label: "Products", value: products, icon: "package" },
        { key: "menus", label: "Menu Items", value: menus, icon: "menu" },
        { key: "permissions", label: "Active Rights", value: permissions, icon: "shield" },
      ],
    };
  }

  if (userType === "sub_admin") {
    const [users, categories, collections, products] = await Promise.all([
      prisma.User.count({
        where: { ...baseWhere, user_type: { not: "super_admin" } },
      }),
      prisma.Category.count({ where: baseWhere }),
      prisma.Collection.count({ where: baseWhere }),
      prisma.Product.count({ where: baseWhere }),
    ]);

    return {
      role: "sub_admin",
      stats: [
        { key: "users", label: "Managed Users", value: users, icon: "users" },
        { key: "categories", label: "Categories", value: categories, icon: "folder" },
        { key: "collections", label: "Collections", value: collections, icon: "layers" },
        { key: "products", label: "Products", value: products, icon: "package" },
      ],
    };
  }

  const [categories, collections, products] = await Promise.all([
    prisma.Category.count({ where: baseWhere }),
    prisma.Collection.count({ where: baseWhere }),
    prisma.Product.count({ where: baseWhere }),
  ]);

  return {
    role: "admin",
    stats: [
      { key: "categories", label: "Categories", value: categories, icon: "folder" },
      { key: "collections", label: "Collections", value: collections, icon: "layers" },
      { key: "products", label: "Products", value: products, icon: "package" },
    ],
  };
};

module.exports = { getDashboardStats };

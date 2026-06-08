const prisma = require("../prisma/prismaClient");

const createMenu = async (data) => prisma.Menu.create({ data });

const getAllMenus = async () =>
  prisma.Menu.findMany({
    where: { is_delete: 0 },
    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
  });

const getOneMenu = async (id) =>
  prisma.Menu.findFirst({ where: { id: Number(id), is_delete: 0 } });

const updateMenu = async (payload) => {
  const { id, ...data } = payload;
  return prisma.Menu.update({
    where: { id: Number(id), is_delete: 0 },
    data: { ...data, modify_date: new Date() },
  });
};

const deleteMenu = async (id) =>
  prisma.Menu.update({
    where: { id: Number(id) },
    data: { is_delete: 1, is_status: 0, delete_date: new Date() },
  });

module.exports = { createMenu, getAllMenus, getOneMenu, updateMenu, deleteMenu };

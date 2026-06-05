const prisma = require("../prisma/prismaClient");

const createCategory = async (data) => {
  return await prisma.Category.create({ data });
};

const getAllCategory = async () => {
  return await prisma.Category.findMany({
    where: {
      is_delete: 0,
    },
    orderBy: {
      id: "desc",
    },
  });
};

const getOneCategory = async (id) => {
  return await prisma.Category.findUnique({
    where: {
      id: id,
      is_delete: Number(0),
    },
  });
};

const deleteCategory = async (id) => {
  return await prisma.Category.update({
    where: {
      id: Number(id),
      is_status: 1,
    },
    data: {
      is_delete: 1,
      is_status: 0,
      delete_date: new Date(),
    },
  });
};

const updateCategory = async (payload) => {
  const { id, ...updateData } = payload;
  return await prisma.category.update({
    where: {
      id: id,
      is_delete: Number(0),
    },
    data: {
      ...updateData,
      modify_date: new Date(),
    },
  });
};

module.exports = {
  createCategory,
  getAllCategory,
  getOneCategory,
  deleteCategory,
  updateCategory,
};

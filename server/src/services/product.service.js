const prisma = require("../prisma/prismaClient");

const productInclude = {
  category: { select: { id: true, category_name: true } },
  collection: { select: { id: true, collection_type: true } },
};

const createProduct = async (data) => {
  return await prisma.Product.create({ data, include: productInclude });
};

const getAllProducts = async () => {
  return await prisma.Product.findMany({
    where: { is_delete: 0 },
    include: productInclude,
    orderBy: { id: "desc" },
  });
};

const getOneProduct = async (id) => {
  return await prisma.Product.findUnique({
    where: { id: Number(id), is_delete: 0 },
    include: productInclude,
  });
};

const updateProduct = async (payload) => {
  const { id, ...updateData } = payload;
  return await prisma.Product.update({
    where: { id: Number(id), is_delete: 0 },
    data: { ...updateData, modify_date: new Date() },
    include: productInclude,
  });
};

const deleteProduct = async (id) => {
  return await prisma.Product.update({
    where: { id: Number(id) },
    data: { is_delete: 1, is_status: 0, delete_date: new Date() },
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};

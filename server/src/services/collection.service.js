const prisma = require("../prisma/prismaClient");

const createCollection = async (data) => {
  return await prisma.Collection.create({ data });
};

const getAllCollections = async () => {
  return await prisma.Collection.findMany({
    where: { is_delete: 0 },
    orderBy: { id: "desc" },
  });
};

const getOneCollection = async (id) => {
  return await prisma.Collection.findUnique({
    where: { id: Number(id), is_delete: 0 },
  });
};

const updateCollection = async (payload) => {
  const { id, ...updateData } = payload;
  return await prisma.Collection.update({
    where: { id: Number(id), is_delete: 0 },
    data: { ...updateData, modify_date: new Date() },
  });
};

const deleteCollection = async (id) => {
  return await prisma.Collection.update({
    where: { id: Number(id) },
    data: { is_delete: 1, is_status: 0, delete_date: new Date() },
  });
};

module.exports = {
  createCollection,
  getAllCollections,
  getOneCollection,
  updateCollection,
  deleteCollection,
};

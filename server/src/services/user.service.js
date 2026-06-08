const prisma = require("../prisma/prismaClient");

const createUser = async (data) => {
  return await prisma.User.create({ data });
};

const getAllUsers = async (viewerType) => {
  const where = { is_delete: 0 };
  if (viewerType && viewerType !== "super_admin") {
    where.user_type = { not: "super_admin" };
  }
  return await prisma.User.findMany({
    where,
    orderBy: { id: "desc" },
  });
};

const getOneUser = async (id) => {
  return await prisma.User.findUnique({
    where: { id: id, is_delete: 0 },
  });
};

const findUserByEmail = async (email) => {
  return await prisma.User.findFirst({
    where: { user_email: email, is_delete: 0 },
  });
};

const updateUser = async (payload) => {
  const { id, ...updateData } = payload;
  return await prisma.User.update({
    where: { id: id, is_delete: 0 },
    data: { ...updateData, modify_date: new Date() },
  });
};

const deleteUser = async (id) => {
  return await prisma.User.update({
    where: { id: Number(id), is_status: 1 },
    data: { is_delete: 1, is_status: 0, delete_date: new Date() },
  });
};

module.exports = {
  createUser,
  getAllUsers,
  getOneUser,
  findUserByEmail,
  updateUser,
  deleteUser,
};

const prisma = require("../prisma/prismaClient");

const findUserByEmail = async (email) => {
  return await prisma.User.findFirst({
    where: { user_email: email, is_delete: 0, is_status: 1 },
  });
};

const findAnyUserByEmail = async (email) => {
  return await prisma.User.findFirst({
    where: { user_email: email, is_delete: 0 },
  });
};

const createAuthUser = async (data) => {
  return await prisma.User.create({ data });
};

const getUserById = async (id) => {
  return await prisma.User.findFirst({
    where: { id: Number(id), is_delete: 0 },
    select: {
      id: true,
      user_name: true,
      user_email: true,
      user_type: true,
      is_status: true,
    },
  });
};

module.exports = { findUserByEmail, findAnyUserByEmail, createAuthUser, getUserById };

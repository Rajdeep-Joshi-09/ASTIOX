const prisma = require("../prisma/prismaClient");

const findAdminByEmail = async (email) => {
  return await prisma.admin.findUnique({ where: { email } });
};

const createAdmin = async (email, hashedPassword) => {
  return await prisma.admin.create({
    data: { email, password: hashedPassword },
  });
};

module.exports = { findAdminByEmail, createAdmin };

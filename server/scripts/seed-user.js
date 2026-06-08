const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);
  const user = await prisma.User.upsert({
    where: { user_email: "admin@astoix.com" },
    update: {},
    create: {
      user_name: "Admin",
      user_email: "admin@astoix.com",
      user_type: "super_admin",
      password: hashed,
      is_status: 1,
      is_delete: 0,
    },
  });
  console.log("Seeded user:", user.user_email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

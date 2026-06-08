const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const USERS = [
  { user_name: "Sub Admin", user_email: "subadmin@astoix.com", user_type: "sub_admin", password: "subadmin123" },
  { user_name: "Admin User", user_email: "staff@astoix.com", user_type: "admin", password: "admin123" },
];

async function main() {
  for (const u of USERS) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.User.upsert({
      where: { user_email: u.user_email },
      update: {},
      create: {
        user_name: u.user_name,
        user_email: u.user_email,
        user_type: u.user_type,
        password: hashed,
        is_status: 1,
        is_delete: 0,
      },
    });
    console.log("Seeded:", u.user_email, `(${u.user_type})`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

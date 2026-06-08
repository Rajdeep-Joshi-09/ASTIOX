const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.Product.findMany({
    where: { product_image: { not: null } },
    include: { images: true },
  });

  for (const p of products) {
    if (p.images.length > 0) continue;
    await prisma.ProductImage.create({
      data: {
        product_id: p.id,
        image_path: p.product_image,
        sort_order: 0,
      },
    });
    console.log("Migrated image for product", p.id);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

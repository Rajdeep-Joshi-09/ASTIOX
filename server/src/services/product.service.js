const prisma = require("../prisma/prismaClient");

const productInclude = {
  category: { select: { id: true, category_name: true } },
  collection: { select: { id: true, collection_type: true } },
  images: {
    where: { is_delete: 0 },
    orderBy: { sort_order: "asc" },
  },
};

const syncPrimaryImage = async (productId) => {
  const first = await prisma.ProductImage.findFirst({
    where: { product_id: productId, is_delete: 0 },
    orderBy: { sort_order: "asc" },
  });
  await prisma.Product.update({
    where: { id: productId },
    data: { product_image: first?.image_path || null },
  });
};

const createProduct = async (data, imagePaths = []) => {
  const { images, ...productData } = data;
  const product = await prisma.Product.create({
    data: productData,
    include: productInclude,
  });

  if (imagePaths.length) {
    await prisma.ProductImage.createMany({
      data: imagePaths.map((path, i) => ({
        product_id: product.id,
        image_path: path,
        sort_order: i,
      })),
    });
    await syncPrimaryImage(product.id);
  }

  return getOneProduct(product.id);
};

const getAllProducts = async () =>
  prisma.Product.findMany({
    where: { is_delete: 0 },
    include: productInclude,
    orderBy: { id: "desc" },
  });

const getOneProduct = async (id) =>
  prisma.Product.findUnique({
    where: { id: Number(id), is_delete: 0 },
    include: productInclude,
  });

const updateProduct = async (payload, { newImagePaths = [], removeImageIds = [] } = {}) => {
  const { id, ...updateData } = payload;

  if (removeImageIds.length) {
    await prisma.ProductImage.updateMany({
      where: { id: { in: removeImageIds }, product_id: Number(id) },
      data: { is_delete: 1 },
    });
  }

  if (newImagePaths.length) {
    const existingCount = await prisma.ProductImage.count({
      where: { product_id: Number(id), is_delete: 0 },
    });
    await prisma.ProductImage.createMany({
      data: newImagePaths.map((path, i) => ({
        product_id: Number(id),
        image_path: path,
        sort_order: existingCount + i,
      })),
    });
  }

  await prisma.Product.update({
    where: { id: Number(id), is_delete: 0 },
    data: { ...updateData, modify_date: new Date() },
  });

  await syncPrimaryImage(Number(id));
  return getOneProduct(id);
};

const deleteProduct = async (id) => {
  await prisma.ProductImage.updateMany({
    where: { product_id: Number(id) },
    data: { is_delete: 1 },
  });
  return prisma.Product.update({
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
  syncPrimaryImage,
};

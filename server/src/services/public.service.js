const prisma = require("../prisma/prismaClient");

const activeWhere = { is_delete: 0, is_status: 1 };

const productInclude = {
  category: { select: { id: true, category_name: true } },
  collection: { select: { id: true, collection_type: true, input_field: true } },
  images: {
    where: { is_delete: 0 },
    orderBy: { sort_order: "asc" },
  },
};

const getPublicCategories = async () =>
  prisma.Category.findMany({
    where: activeWhere,
    orderBy: { category_name: "asc" },
    select: { id: true, category_name: true },
  });

const getPublicCollections = async () =>
  prisma.Collection.findMany({
    where: activeWhere,
    orderBy: { collection_type: "asc" },
    select: { id: true, collection_type: true, input_field: true },
  });

const getPublicProducts = async ({ categoryId, collectionId } = {}) => {
  const where = { ...activeWhere };
  if (categoryId) where.category_id = Number(categoryId);
  if (collectionId) where.collection_id = Number(collectionId);

  return prisma.Product.findMany({
    where,
    include: productInclude,
    orderBy: { id: "desc" },
  });
};

const getPublicProductById = async (id) =>
  prisma.Product.findFirst({
    where: { id: Number(id), ...activeWhere },
    include: productInclude,
  });

const getRecommendations = async (id, limit = 6) => {
  const product = await getPublicProductById(id);
  if (!product) return [];

  return prisma.Product.findMany({
    where: {
      ...activeWhere,
      id: { not: product.id },
      OR: [
        { category_id: product.category_id },
        { collection_id: product.collection_id },
      ],
    },
    include: productInclude,
    orderBy: { id: "desc" },
    take: limit,
  });
};

module.exports = {
  getPublicCategories,
  getPublicCollections,
  getPublicProducts,
  getPublicProductById,
  getRecommendations,
};

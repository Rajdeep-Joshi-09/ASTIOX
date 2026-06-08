const publicService = require("../services/public.service");

const mapProduct = (item, { includeDescription = true } = {}) => {
  const images = (item.images || []).map((img) => ({
    id: img.id,
    imagePath: img.image_path,
  }));

  const primary =
    images[0]?.imagePath || item.product_image || null;

  const base = {
    id: item.id,
    productName: item.product_name,
    productImage: primary,
    images,
    categoryId: item.category_id,
    categoryName: item.category?.category_name,
    collectionId: item.collection_id,
    collectionType: item.collection?.collection_type,
    collectionLabel: item.collection?.input_field,
  };

  if (includeDescription) {
    base.productDescription = item.product_description;
  }

  return base;
};

const getCategories = async (_req, res) => {
  try {
    const data = await publicService.getPublicCategories();
    res.status(200).json({
      status: true,
      data: data.map((c) => ({ id: c.id, categoryName: c.category_name })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCollections = async (_req, res) => {
  try {
    const data = await publicService.getPublicCollections();
    res.status(200).json({
      status: true,
      data: data.map((c) => ({
        id: c.id,
        collectionType: c.collection_type,
        inputField: c.input_field,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const { categoryId, collectionId } = req.query;
    const data = await publicService.getPublicProducts({ categoryId, collectionId });
    res.status(200).json({
      status: true,
      data: data.map((p) => mapProduct(p, { includeDescription: false })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await publicService.getPublicProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const recommendations = await publicService.getRecommendations(req.params.id);
    res.status(200).json({
      status: true,
      data: mapProduct(product),
      recommendations: recommendations.map((p) =>
        mapProduct(p, { includeDescription: false })
      ),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCategories, getCollections, getProducts, getProductById };

const productService = require("../services/product.service");

function validateProductName(name) {
  if (!name?.trim()) {
    const err = new Error("Product name is required");
    err.statusCode = 400;
    throw err;
  }
  const value = name.trim();
  if (value.length < 2 || value.length > 150) {
    const err = new Error("Product name must be between 2 to 150 characters");
    err.statusCode = 400;
    throw err;
  }
  return value;
}

function validateId(value, label) {
  const id = Number(value);
  if (!id || Number.isNaN(id)) {
    const err = new Error(`${label} is required`);
    err.statusCode = 400;
    throw err;
  }
  return id;
}

const mapProduct = (item) => ({
  id: item.id,
  productName: item.product_name,
  productDescription: item.product_description,
  productImage: item.product_image,
  categoryId: item.category_id,
  categoryName: item.category?.category_name,
  collectionId: item.collection_id,
  collectionType: item.collection?.collection_type,
  isStatus: item.is_status === 1 ? "Active" : "Inactive",
  createdDate: item.created_date,
});

const createProduct = async (req, res) => {
  try {
    const { productName, productDescription, categoryId, collectionId, isStatus } =
      req.body;

    const product_name = validateProductName(productName);
    const category_id = validateId(categoryId, "Category");
    const collection_id = validateId(collectionId, "Collection");
    const product_image = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const product = await productService.createProduct({
      product_name,
      product_description: productDescription?.trim() || null,
      product_image,
      category_id,
      collection_id,
      is_status: isStatus !== undefined ? Number(isStatus) : 1,
    });

    res.status(201).json({
      status: true,
      message: "Product created successfully",
      data: mapProduct(product),
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const data = await productService.getAllProducts();
    res.status(200).json({
      status: true,
      message: "Products retrieved successfully",
      data: data.map(mapProduct),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getOneProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      status: true,
      message: "Product found",
      data: {
        ...mapProduct(product),
        isStatus: product.is_status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productName, productDescription, categoryId, collectionId, isStatus } =
      req.body;

    const updateData = {
      id: Number(req.params.id),
      product_name: validateProductName(productName),
      product_description: productDescription?.trim() || null,
      category_id: validateId(categoryId, "Category"),
      collection_id: validateId(collectionId, "Collection"),
      is_status: Number(isStatus),
    };

    if (req.file) {
      updateData.product_image = req.file.path.replace(/\\/g, "/");
    }

    const product = await productService.updateProduct(updateData);

    res.status(200).json({
      status: true,
      message: "Product updated successfully",
      data: mapProduct(product),
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ status: true, message: "Product deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

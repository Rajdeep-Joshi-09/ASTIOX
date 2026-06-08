const categoryService = require("../services/category.service");

function validateCategory(category) {
  if (!category) {
    const err = new Error("Category required");
    err.statusCode = 400;
    throw err;
  }

  const categoryName = category.trim();

  if (!categoryName.length) {
    const err = new Error("Category required");
    err.statusCode = 400;
    throw err;
  }

  if (categoryName.length < 5 || categoryName.length > 50) {
    const err = new Error("Category length must be between 5 to 50");
    err.statusCode = 400;
    throw err;
  }

  return categoryName;
}

function transformDate(isoDate) {
  if (!isoDate) return;
  const date = new Date(isoDate);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

const createCategory = async (req, res) => {
  try {
    const { categoryName, isStatus } = req.body;
    let category_name = validateCategory(categoryName);
    const category = await categoryService.createCategory({
      category_name,
      is_status: isStatus,
    });
    const { id, is_status } = category;
    res.status(201).json({
      status: true,
      message: "Category created successfully",
      data: {
        id,
        categoryCreated: category_name,
        isStatus: is_status === 1 ? "Active" : "Inactive",
      },
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const categoryData = await categoryService.getAllCategory();
    const category = categoryData.map((itm) => {
      return {
        id: itm.id,
        categoryName: itm.category_name,
        isStatus: itm.is_status == 1 ? "Active" : "Inactive",
        createdDate: transformDate(itm.created_date),
        updateDate: transformDate(itm.modify_date),
      };
    });
    res.status(200).json({
      status: true,
      message: "Category retrived successfully",
      data: category,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    const categoryData = await categoryService.getOneCategory(Number(id));
    if (!categoryData) {
      return res.status(404).json({
        message: "There is no such a category found on this Id",
      });
    }
    const { category_name, is_status } = categoryData;
    res.status(200).json({
      status: true,
      message: "Category found",
      data: {
        id,
        categoryName: category_name,
        isStatus: is_status,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        message: "Id not found",
      });
    }
    const result = await categoryService.deleteCategory(id);
    if (!result) {
      res.status(404).json({
        message: "There is no such a category found on this Id",
      });
    }
    res.status(200).json({
      status: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "There is no such a category found on this Id",
      });
    }
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Id not found",
      });
    }
    const { categoryName, isStatus } = req.body;
    let category_name = validateCategory(categoryName);
    const updateCategoryById = await categoryService.updateCategory({
      id: Number(id),
      category_name,
      is_status: Number(isStatus),
    });
    res.status(200).json({
      status: true,
      message: "Category updated successfully",
    });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({
        message: "No record found on this Id",
      });
    }
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
  updateCategoryController,
};

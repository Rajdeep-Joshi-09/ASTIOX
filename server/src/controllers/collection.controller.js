const collectionService = require("../services/collection.service");

function validateCollectionType(value) {
  if (!value?.trim()) {
    const err = new Error("Collection type is required");
    err.statusCode = 400;
    throw err;
  }
  const type = value.trim();
  if (type.length < 2 || type.length > 100) {
    const err = new Error("Collection type must be between 2 to 100 characters");
    err.statusCode = 400;
    throw err;
  }
  return type;
}

function validateInputField(value) {
  if (!value?.trim()) {
    const err = new Error("Input field is required");
    err.statusCode = 400;
    throw err;
  }
  const field = value.trim();
  if (field.length < 2 || field.length > 200) {
    const err = new Error("Input field must be between 2 to 200 characters");
    err.statusCode = 400;
    throw err;
  }
  return field;
}

const mapCollection = (item) => ({
  id: item.id,
  collectionType: item.collection_type,
  inputField: item.input_field,
  isStatus: item.is_status === 1 ? "Active" : "Inactive",
  createdDate: item.created_date,
});

const createCollection = async (req, res) => {
  try {
    const { collectionType, inputField, isStatus } = req.body;
    const collection_type = validateCollectionType(collectionType);
    const input_field = validateInputField(inputField);

    const collection = await collectionService.createCollection({
      collection_type,
      input_field,
      is_status: isStatus !== undefined ? Number(isStatus) : 1,
    });

    res.status(201).json({
      status: true,
      message: "Collection created successfully",
      data: mapCollection(collection),
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getCollections = async (req, res) => {
  try {
    const data = await collectionService.getAllCollections();
    res.status(200).json({
      status: true,
      message: "Collections retrieved successfully",
      data: data.map(mapCollection),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCollectionById = async (req, res) => {
  try {
    const collection = await collectionService.getOneCollection(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.status(200).json({
      status: true,
      message: "Collection found",
      data: {
        ...mapCollection(collection),
        isStatus: collection.is_status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { collectionType, inputField, isStatus } = req.body;
    await collectionService.updateCollection({
      id: Number(req.params.id),
      collection_type: validateCollectionType(collectionType),
      input_field: validateInputField(inputField),
      is_status: Number(isStatus),
    });
    res.status(200).json({ status: true, message: "Collection updated successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    await collectionService.deleteCollection(req.params.id);
    res.status(200).json({ status: true, message: "Collection deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Collection not found" });
    }
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};

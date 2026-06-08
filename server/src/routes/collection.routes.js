const express = require("express");
const {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/collection.controller");

const router = express.Router();

router.get("/", getCollections);
router.get("/:id", getCollectionById);
router.post("/", createCollection);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);

module.exports = router;

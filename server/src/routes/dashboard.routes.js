const express = require("express");
const { getStats } = require("../controllers/dashboard.controller");
const { loadUser } = require("../../middleware/role.middleware");

const router = express.Router();

router.get("/stats", loadUser, getStats);

module.exports = router;

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const collectionRoutes = require("./routes/collection.routes");
const productRoutes = require("./routes/product.routes");
const menuRoutes = require("./routes/menu.routes");
const permissionRoutes = require("./routes/permission.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const { protect } = require("../middleware/auth.middleware");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads/products", express.static("D:/ASTIOX/uploads/products"));

app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/category", protect, categoryRoutes);
app.use("/api/collection", protect, collectionRoutes);
app.use("/api/product", protect, productRoutes);
app.use("/api/menu", protect, menuRoutes);
app.use("/api/permissions", protect, permissionRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);

module.exports = app;

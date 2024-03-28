const express = require("express");
const routers = express.Router();
const authRoutes = require("./auth");
const userRoutes = require("./user");

routers.use("/user", userRoutes);
routers.use("/auth", authRoutes);

module.exports = routers;
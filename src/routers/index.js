const express = require("express");
const routers = express.Router();
const authRoutes = require("./auth");
const userRoutes = require("./user");

const phoneRoutes = require("./phone");
const transRoutes = require("./transaction");

routers.use("/user", userRoutes);
routers.use("/auth", authRoutes);

routers.use("/phone", phoneRoutes);
routers.use("/transaction", transRoutes);

module.exports = routers;

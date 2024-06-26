const express = require("express");
const routers = express.Router();
const authRoutes = require("./auth");
const userRoutes = require("./user");
const transRoutes = require("./transaction");
const phoneRoutes = require("./phone");

routers.use("/auth", authRoutes);
routers.use("/user", userRoutes);
routers.use("/transaction", transRoutes);

module.exports = routers;

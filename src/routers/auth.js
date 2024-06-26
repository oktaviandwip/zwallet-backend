const express = require("express");
const routers = express.Router();
const controllers = require("../controllers/auth.js");

routers.post("/", controllers.login);

module.exports = routers;

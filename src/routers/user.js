const express = require("express");
const routers = express.Router();
const userController = require("../controllers/user.js");
const authMiddleware = require("../middleware/auth.js");
const uploadMiddleware = require("../middleware/upload.js");

routers.patch(
  "/image",
  authMiddleware.authentication,
  uploadMiddleware.uploadUser,
  userController.updateImageUser
);

routers.use("/image", express.static("./public/upload/user"));

module.exports = routers;

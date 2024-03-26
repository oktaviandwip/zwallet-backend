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
routers.get("/", authMiddleware.authentication, userController.getProfile);

routers.use("/image", express.static("./public/upload/user"));

routers.get("/all", authMiddleware.authentication, userController.getAllUser);
routers.post(
  "/checkpin",
  authMiddleware.authentication,
  userController.checkPin
);

module.exports = routers;

const express = require("express");
const routers = express.Router();
const controllers = require("../controllers/user.js");
const authMiddleware = require("../middleware/auth.js");
const uploadMiddleware = require("../middleware/upload.js");

routers.post("/email", controllers.checkEmail);
routers.post("/", controllers.createUser);
routers.get("/", controllers.getAllReceivers);
routers.get("/:id", controllers.getUser);
routers.get("/search", controllers.searchReceivers);
routers.get("/profile", authMiddleware.authentication, controllers.getProfile);
routers.patch(
  "/profile",
  authMiddleware.authentication,
  controllers.updateProfile
);

routers.patch(
  "/updatepass",
  authMiddleware.authentication,
  controllers.updatePass
);

routers.patch(
  "/updatepin",
  authMiddleware.authentication,
  controllers.updatePin
);

routers.patch(
  "/photo-profile",
  authMiddleware.authentication,
  uploadMiddleware.uploadUser,
  controllers.updatePhoto
);

routers.post(
  "/receiver",
  authMiddleware.authentication,
  controllers.addReceiver
);

routers.delete(
  "/receiver",
  authMiddleware.authentication,
  controllers.deleteReceiver
);

module.exports = routers;

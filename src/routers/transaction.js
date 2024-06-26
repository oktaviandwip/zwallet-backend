const express = require("express");
const routers = express.Router();
const transController = require("../controllers/transaction.js");
const authMiddleware = require("../middleware/auth.js");

routers.post(
  "/",
  authMiddleware.authentication,
  transController.newTransaction
);

routers.get(
  "/balance",
  authMiddleware.authentication,
  transController.getBalance
);

routers.get(
  "/history/:type",
  authMiddleware.authentication,
  transController.getHistory
);

// routers.post(
//   "/history",
//   authMiddleware.authentication,
//   transController.getHistory
// );

module.exports = routers;

const model = require("../models/transaction");
const response = require("../utils/response");
const controllers = {};

// Transfer
controllers.newTransaction = async (req, res) => {
  try {
    const data = await model.newTransaction(req.body);
    return response(res, 201, data);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

// Get Balance
controllers.getBalance = async (req, res) => {
  try {
    const { rows } = await model.getBalance(req.decodeToken.id);
    if (rows.length === 0) {
      return response(res, 500, "Data not found");
    }
    return response(res, 200, rows);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

// Get History
controllers.getHistory = async (req, res) => {
  try {
    const { type } = req.params;

    // All Transaction
    if (type === "all") {
      const weekly = await model.getHistory(req.decodeToken.id, "weekly");
      const monthly = await model.getHistory(req.decodeToken.id, "monthly");
      return response(res, 200, [{ weekly, monthly }]);
    }

    // Income/Expense Transaction
    else if (type === "income" || type === "expense") {
      const weekly = await model.getHistory(req.decodeToken.id, "weekly", type);
      const monthly = await model.getHistory(
        req.decodeToken.id,
        "monthly",
        type
      );
      return response(res, 200, [{ weekly, monthly }]);
    }

    // Transaction by Date Range
    else if (type.includes("&")) {
      const result = await model.getHistory(req.decodeToken.id, "date", type);
      return response(res, 200, result);
    }

    // Transaction for Notification
    else if (type === "notif") {
      const today = await model.getHistory(req.decodeToken.id, "today", type);
      const weekly = await model.getHistory(req.decodeToken.id, "weekly", type);
      return response(res, 200, [{ today, weekly }]);
    }

    // Latest Transaction for Home
    else {
      const result = await model.getHistory(req.decodeToken.id);
      return response(res, 200, result);
    }
  } catch (error) {
    return response(res, 500, error.message);
  }
};

module.exports = controllers;

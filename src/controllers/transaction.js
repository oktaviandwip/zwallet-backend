const model = require("../models/transaction");

const response = require("../utils/response");
const controller = {
  transfer: async (req, res) => {
    try {
      const amount = req.body.amount ? req.body.amount : "";
      const notes = req.body.notes ? req.body.notes : "";
      const data = await model.transfer(
        req.decodeToken.id,
        req.params.id,
        amount,
        notes
      );

      return response(res, 201, data);
    } catch (error) {
      return response(res, 500, error.message);
    }
  },
};

module.exports = controller;

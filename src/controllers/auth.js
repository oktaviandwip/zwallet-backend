const models = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const response = require("../utils/response");

const genToken = (id) => {
  const payload = {
    id,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "2w" });
  return token;
};

const controller = {
  login: async (req, res) => {
    try {
      const result = await models.getPassByEmail(req.body.email);
      if (result.rowCount === 0) {
        return response(res, 401, "Email not found!");
      }

      const { id } = result.rows[0];
      const password = result.rows[0].password;
      const passwordUser = req.body.password;

      let check;
      if (id === 1) {
        if (password === passwordUser) {
          check = true;
        } else {
          return response(res, 401, "Incorrect password!");
        }
      } else {
        check = await bcrypt.compare(passwordUser, password);
      }

      if (check) {
        const tokenJwt = genToken(id);
        return response(res, 200, {
          message: "Login succesful!",
          token: tokenJwt,
          profile: result.rows[0],
        });
      } else {
        return response(res, 401, "Incorrect password!");
      }
    } catch (error) {
      return response(res, 500, error.message);
    }
  },
};

module.exports = controller;

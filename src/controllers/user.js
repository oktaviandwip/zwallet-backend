const model = require("../models/user");
const controller = {};
const response = require("../utils/response");
const hashing = require("../utils/hash");
const fs = require("fs");

controller.updateImageUser = async (req, res) => {
  try {
    console.log(req.file);
    const image = `http://localhost:3001/user/image/${req.file.filename}`;
    const dataExist = await model.getUserById(req.decodeToken.id);
    if (dataExist === false) {
      return response(res, 404, "Data not found");
    }
    const result = await model.updateImageUser(image, req.decodeToken.id);
    console.log(req.file);
    // cek apakah update mengirim file dan value db user.image tidak null
    if (image && dataExist[0].image) {
      const imageName = dataExist[0].image.replace(
        "http://localhost:3001/user/image/",
        ""
      );
      const path = `./public/upload/user/${imageName}`;
      fs.unlinkSync(path);
    }
    return response(res, 200, result);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

controller.getProfile = async (req, res) => {
  try {
    const result = await model.getProfile(req.decodeToken.id);
    return response(res, 200, result);
  } catch (error) {
    return response(res, 500, error.message);
  }
};
controller.getAllUser = async (req, res) => {
  try {
    const result = await model.getBy(req.query.search, req.decodeToken.id);
    return response(res, 200, result);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

controller.checkPin = async (req, res) => {
  try {
    const result = await model.getProfile(req.decodeToken.id);
    const pin = result[0].pin;
    if (pin != req.body.pin) {
      return response(res, 401, "Incorrect Pin");
    }
    return response(res, 200, "Pin Verified Successfully");
  } catch (error) {
    return response(res, 500, error.message);
  }
};

module.exports = controller;

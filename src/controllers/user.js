const models = require("../models/user");
const response = require("../utils/response");
const hashing = require("../utils/hash");
const fs = require("fs");
const controllers = {};
const bcrypt = require("bcrypt");

// Check Email or Username
controllers.checkEmail = async (req, res) => {
  try {
    const result = await models.checkEmail(req.body);

    // Email or Username Available
    if (result.rowCount === 0) {
      return response(res, 200, "OK");
    }

    // Email or Username not Available
    const data = result.rows[0];
    if (data.username === req.body.username) {
      return response(res, 400, "Username has been used!");
    } else if (data.email === req.body.email) {
      return response(res, 400, "Email has been used!");
    }
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Create User
controllers.createUser = async (req, res) => {
  try {
    req.body.password = await hashing(req.body.password);
    const result = await models.createUser(req.body);
    return response(res, 200, result);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Get Profile
controllers.getProfile = async (req, res) => {
  try {
    const result = await models.getUserById(req.decodeToken.id);
    return response(res, 200, result);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Update Profile
controllers.updateProfile = async (req, res) => {
  try {
    req.body.username = req.body.username.toLowerCase();
    const result = await models.updateData(req.body);
    if (result.rowCount === 0) {
      return response(res, 404, "User not found!");
    } else {
      return response(res, 200, "Profile update successful!");
    }
  } catch (err) {
    if (err.message.includes("username")) {
      return response(res, 500, "Username has been used!");
    } else if (err.message.includes("email")) {
      return response(res, 500, "Email has been used!");
    } else if (err.message.includes("phone_number")) {
      return response(res, 500, "Phone number has been used!");
    } else {
      return response(res, 500, err.message);
    }
  }
};

// Update Password
controllers.updatePass = async (req, res) => {
  try {
    const { rows } = await models.getPassByEmail(req.body.email);
    const check = await bcrypt.compare(req.body.password, rows[0].password);

    if (check) {
      req.body.newpassword = await hashing(req.body.newpassword);
    } else {
      return response(res, 401, "Incorrect current password!");
    }

    const result = await models.updatePass(req.body);
    if (result.rowCount === 0) {
      return response(res, 404, "User not found!");
    } else {
      return response(res, 200, result.rows[0].password);
    }
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Update Pin
controllers.updatePin = async (req, res) => {
  try {
    const result = await models.updatePin(req.body);
    if (result.rowCount === 0) {
      return response(res, 404, "User not found!");
    } else {
      return response(res, 200, result.rows[0].pin);
    }
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Update Photo Profile
controllers.updatePhoto = async (req, res) => {
  try {
    // const image = `https://zwallet-backend-production.up.railway.app/image/${req.file.filename}`;
    const { rows } = await models.getPassByEmail(req.body.email);
    if (rows.length === 0) {
      return response(res, 404, "Data not found");
    }
    const result = await models.updatePhotoProfile(
      req.body.photo_profile,
      req.body.email
    );
    return response(res, 404, { error: "Sampai sini" });

    // // Cek apakah update mengirim file dan value db user.photo_profile tidak null
    // if (image && rows[0].photo_profile) {
    //   const imageName = rows[0].photo_profile.replace(
    //     "https://zwallet-backend-production.up.railway.app/image/",
    //     ""
    //   );

    //   const path = `./public/upload/${imageName}`;
    //   fs.unlinkSync(path);
    // }
    return response(res, 200, result);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Get All Receivers
controllers.getAllReceivers = async (req, res) => {
  try {
    const { rows } = await models.fetchAllReceivers(req.query.id);
    return response(res, 200, rows);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Get User
controllers.getUser = async (req, res) => {
  try {
    const { rows } = await models.fetchUser(req.params.id);
    return response(res, 200, rows);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Search Receivers
controllers.searchReceivers = async (req, res) => {
  try {
    const { rows } = await models.searchReceivers(req.query.name);
    return response(res, 200, rows);
  } catch (err) {
    return response(res, 500, err.message);
  }
};

// Add Receiver
controllers.addReceiver = async (req, res) => {
  try {
    const result = await models.addReceiver(req.body);
    return response(res, 200, result);
  } catch (err) {
    if (err.message.includes("unique constraint")) {
      return response(res, 500, "Receiver already exists!");
    } else {
      return response(res, 500, err.message);
    }
  }
};

//Delete Receiver
controllers.deleteReceiver = async (req, res) => {
  try {
    const { rowCount } = await models.deleteReceiver(req.query.id);
    if (rowCount === 0) {
      return response(res, 404, "User not Found");
    } else {
      return response(res, 200, "1 receiver deleted successfully!");
    }
  } catch (err) {
    return response(res, 500, err.message);
  }
};

module.exports = controllers;

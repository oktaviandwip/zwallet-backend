const model = require('../models/user')
const controller = {}
const response = require('../utils/response')
const hashing = require('../utils/hash')
const fs = require('fs')

controller.addUser = async (req, res) => {
  try {
    const { email, username, password } = req.body

    const hashedPassword = await hashing.hashPassword(password)

    const userData = {
      email,
      username,
      password: hashedPassword,
      pin,
      balance,
      image,
    }

    const userId = await userModel.addUser(userData)

    return response(res, 201, 'User created successfully', { userId })
  } catch (error) {
    return response(res, 500, 'Internal Server Error', error)
  }
}

controller.updateImageUser = async (req, res) => {
  try {
    console.log(req.file)
    const image = `http://localhost:3001/user/image/${req.file.filename}`
    const dataExist = await model.getUserById(req.decodeToken.id)
    if (dataExist === false) {
      return response(res, 404, 'Data not found')
    }
    const result = await model.updateImageUser(image, req.decodeToken.id)
    console.log(req.file)
    // cek apakah update mengirim file dan value db user.image tidak null
    if (image && dataExist[0].image) {
      const imageName = dataExist[0].image.replace(
        'http://localhost:3001/user/image/',
        ''
      )
      const path = `./public/upload/user/${imageName}`
      fs.unlinkSync(path)
    }
    return response(res, 200, result)
  } catch (error) {
    return response(res, 500, error.message)
  }
}

controller.getProfile = async (req, res) => {
  try {
    const result = await model.getProfile(req.decodeToken.id)
    return response(res, 200, result)
  } catch (error) {
    return response(res, 500, error.message)
  }
}
controller.getAllUser = async (req, res) => {
  try {
    const result = await model.getBy(req.query.search, req.decodeToken.id)
    return response(res, 200, result)
  } catch (error) {
    return response(res, 500, error.message)
  }
}

controller.getAllUsers = async (req, res) => {
  try {
    const searchTerm = req.query.search || ''
    const users = await model.getAllUsers(searchTerm)
    return response(res, 200, users)
  } catch (error) {
    return response(res, 500, 'Internal Server Error', error)
  }
}

controller.checkPin = async (req, res) => {
  try {
    const result = await model.getProfile(req.decodeToken.id)
    const pin = result[0].pin
    if (pin != req.body.pin) {
      return response(res, 401, 'Incorrect Pin')
    }
    return response(res, 200, 'Pin Verified Successfully')
  } catch (error) {
    return response(res, 500, error.message)
  }
}

controller.updatePass = async (req, res) => {
  try {
    const password = req.body.password ? req.body.password : true
    const newPassword = req.body.newpassword ? req.body.newpassword : true
    const confirmNewPassword = req.body.confirmnewpassword
      ? req.body.confirmnewpassword
      : false

    const result = await model.getProfile(req.decodeToken.id)
    const currenPass = result[0].password
    if (password != currenPass) {
      return response(res, 401, 'Incorrect Password')
    }
    if (newPassword !== confirmNewPassword) {
      return response(
        res,
        401,
        'New Password and Comfirm Password do not match'
      )
    }

    const data = await model.updatePass(newPassword, req.decodeToken.id)

    return response(res, 200, data)
  } catch (error) {
    return response(res, 500, error.message)
  }
}
controller.updatePin = async (req, res) => {
  try {
    console.log('yo')
    const pin = req.body.pin ? req.body.pin : null
    console.log(pin)
    if (!pin) {
      return response(res, 401, 'Please Input Pin')
    }
    const data = await model.updatePin(pin, req.decodeToken.id)

    return response(res, 200, data)
  } catch (error) {
    return response(res, 500, error.message)
  }
}

controller.getUserById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await model.getUserById(id)
    if (!user) {
      return response(res, 404, 'User not found')
    }
    return response(res, 200, { user })
  } catch (error) {
    return response(res, 500, 'Internal Server Error', error)
  }
}

module.exports = controller

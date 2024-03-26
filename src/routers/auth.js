const express = require('express')
const routers = express.Router()
const userController = require('../controllers/auth.js')

routers.post('/signup', userController.register)
routers.post('/', userController.login)

module.exports = routers

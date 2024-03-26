const model = require('../models/user')
const response = require('../utils/response')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// tidak mempunyai model karena akan memakai model user

const genToken = (id) => {
  const payload = {
    id: id,
  }
  const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1d' })
  return token
}
const controller = {
  login: async (req, res) => {
    try {
      const { password, id } = await model.getPassByEmail(req.body.email)
      if (!password) {
        return response(res, 401, 'Invalid Email')
      }
      const passwordUser = req.body.password

      const check = passwordUser == password

      if (id && (await bcrypt.compare(passwordUser, password))) {
        const tokenJwt = genToken(id)
        return response(res, 200, {
          message: 'Login Succesful',
          token: tokenJwt,
        })
      } else {
        return response(res, 401, 'Incorrect Password')
      }
    } catch (error) {
      response(res, 200, error.message)
    }
  },
  register: async (req, res) => {
    try {
      const { email, username, password, pin, balance, image } = req.body

      const existingUser = await model.getPassByEmail(email)
      if (existingUser) {
        return response(res, 400, 'Email already registered')
      }
      const hashedPassword = await bcrypt.hash(password, 10)

      const userData = {
        email,
        username,
        password: hashedPassword,
        pin,
        balance,
        image,
      }

      const userId = await model.addUser(userData)

      return response(res, 201, 'User registered successfully', { userId })
    } catch (error) {
      return response(res, 500, 'Internal Server Error', error)
    }
  },
}

module.exports = controller

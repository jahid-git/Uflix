const express = require('express')
const { login, register, subscription, logout, getAllUsers, updateUser } = require('../controllers/user.controllers.js')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/subscription', subscription)
router.post('/logout', logout)
router.post('/update', updateUser)
router.post('/all', getAllUsers)

module.exports = router
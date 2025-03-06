const express = require('express')
const router = express.Router()
const wechatController = require('../controllers/wechatController')

router.post('/user-info', wechatController.getUserInfo)

module.exports = router 
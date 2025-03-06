const express = require('express')
const router = express.Router()
const safetyController = require('../controllers/safetyController')

// 提交申请
router.post('/applications', safetyController.submitApplication)

// 获取用户历史记录
router.get('/applications/user/:userId', safetyController.getHistoricalRecords)

// 获取申请详情
router.get('/applications/:id', safetyController.getApplicationDetail)

// 更新申请状态
router.patch('/applications/:id/status', safetyController.updateApplicationStatus)

// 添加微信授权路由
router.post('/auth', safetyController.handleWechatAuth)

module.exports = router
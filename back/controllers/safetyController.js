const SafetyApplication = require('../models/safetyApplication')
const AccompanyingPerson = require('../models/accompanyingPerson')

// 提交申请
exports.submitApplication = async (req, res) => {
  try {
    // 打印接收到的数据
    console.log('接收到的申请数据:', JSON.stringify(req.body, null, 2))
    
    // 创建主表记录
    const application = new SafetyApplication({
      ...req.body,
      accompaningCount: req.body.accompaningPersons?.length || 0
    })
    const savedApp = await application.save()
    
    // 创建随行人员记录
    if (req.body.accompaningPersons?.length > 0) {
      const accompaningPersons = req.body.accompaningPersons.map(person => ({
        ...person,
        applicationId: savedApp._id
      }))
      await AccompanyingPerson.insertMany(accompaningPersons)
    }
    
    // 查询完整的申请记录（包含随行人员）
    const fullApplication = await SafetyApplication.findById(savedApp._id)
      .populate('accompaningPersons')
    
    console.log('保存的申请数据:', JSON.stringify(fullApplication, null, 2))
    
    res.json({
      success: true,
      data: fullApplication
    })
  } catch (error) {
    console.error('保存申请失败:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// 获取用户的历史记录
exports.getHistoricalRecords = async (req, res) => {
  try {
    console.log('获取历史记录请求:', req.params)
    const applications = await SafetyApplication.find({ userId: req.params.userId })
      .populate('accompaningPersons')  // 确保关联查询随行人员信息
      .sort({ submitTime: -1 })
    
    console.log('找到的历史记录:', JSON.stringify(applications, null, 2))
    
    res.json({
      success: true,
      data: applications
    })
  } catch (error) {
    console.error('获取历史记录失败:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// 获取申请详情
exports.getApplicationDetail = async (req, res) => {
  try {
    const application = await SafetyApplication.findById(req.params.id)
    if (!application) {
      return res.status(404).json({
        success: false,
        message: '未找到该申请'
      })
    }
    res.json({
      success: true,
      data: application
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// 更新申请状态
exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await SafetyApplication.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!application) {
      return res.status(404).json({
        success: false,
        message: '未找到该申请'
      })
    }
    res.json({
      success: true,
      data: application
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// 处理微信授权
exports.handleWechatAuth = async (req, res) => {
  try {
    const { code } = req.body
    // 实际项目中，这里需要调用微信接口获取用户信息
    // 现在返回模拟数据
    const userInfo = {
      wxId: 'wx_' + Math.random().toString(36).substr(2, 9),
      nickname: '测试用户',
      avatar: ''
    }
    res.json({
      success: true,
      data: userInfo
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

// 获取用户历史记录
exports.getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params
    // 确保查询时包含随行人员信息
    const applications = await SafetyApplication.find({ userId })
      .select('+accompaningPersons')  // 显式包含随行人员字段
      .sort({ submitTime: -1 })
    
    res.json({
      success: true,
      data: applications
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
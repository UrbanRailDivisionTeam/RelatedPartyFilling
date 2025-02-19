const axios = require('axios')

exports.getUserInfo = async (req, res) => {
  try {
    const { code } = req.body
    
    // 获取 access_token
    const tokenResponse = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
      params: {
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET,
        code,
        grant_type: 'authorization_code'
      }
    })
    
    const { access_token, openid } = tokenResponse.data
    
    // 获取用户信息
    const userInfoResponse = await axios.get('https://api.weixin.qq.com/sns/userinfo', {
      params: {
        access_token,
        openid,
        lang: 'zh_CN'
      }
    })
    
    // 返回用户信息
    res.json({
      success: true,
      data: {
        wxId: userInfoResponse.data.openid,
        nickname: userInfoResponse.data.nickname,
        avatar: userInfoResponse.data.headimgurl
      }
    })
  } catch (error) {
    console.error('获取微信用户信息失败:', error)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
} 
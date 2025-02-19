import axios from 'axios'

// 检查是否在微信环境中
export const isWechatBrowser = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.indexOf('micromessenger') !== -1
}

// 生成二维码链接
export const generateQRCode = (url) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
}

// 获取微信用户信息（简化版）
export const getWechatUserInfo = async () => {
  try {
    // 从 localStorage 获取已存在的测试用户 ID
    let testUserId = localStorage.getItem('testUserId')
    if (!testUserId) {
      // 如果没有，生成新的测试用户 ID 并保存
      testUserId = 'test_user_' + Math.random().toString(36).substr(2, 8)
      localStorage.setItem('testUserId', testUserId)
    }

    return {
      wxId: testUserId,
      nickname: '测试用户',
      avatar: ''
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    throw error
  }
}

// 实际项目中可能需要的其他微信相关函数
export const shareToWechat = async (shareData) => {
  try {
    // 实现微信分享功能
    console.log('分享数据:', shareData)
  } catch (error) {
    console.error('分享失败:', error)
    throw error
  }
}

// 获取当前页面完整URL
export const getCurrentUrl = () => {
  return window.location.href.split('#')[0]
}

// 生成微信授权链接
export const generateAuthUrl = (redirectUrl = window.location.href) => {
  const appId = import.meta.env.VITE_WECHAT_APPID
  const encodedRedirectUrl = encodeURIComponent(redirectUrl)
  return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodedRedirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
}
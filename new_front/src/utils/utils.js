// ------------------通用方法------------------
// 生成二维码链接
export const generateQRCode = (url) => {
  // 使用环境变量中的 URL
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`
}

// ------------------后端api------------------
import axios from 'axios'
// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 安全作业申请相关接口
export const safetyApi = {
  // 提交申请
  submitApplication() {
    return api.post('/safety/applications', store.from)
  },
  // 获取历史记录
  getHistoricalRecords() {
    return api.get(`/safety/applications/user/${store.userId}`)
  },
  // 用户登录
  UserLogin() {
    return api.get(`/safety/user/${store.userId}`)
  }
}

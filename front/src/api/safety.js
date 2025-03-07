import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器，打印请求信息
api.interceptors.request.use(
  config => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      baseURL: config.baseURL
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器添加更详细的错误信息
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    })
    const message = error.response?.data?.message || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

// 安全作业申请相关接口
export const safetyApi = {
  // 提交申请
  submitApplication(data) {
    return api.post('/safety/applications', data)
  },

  // 获取历史记录
  getHistoricalRecords(userId) {
    console.log('获取历史记录, userId:', userId)
    return api.get(`/safety/applications/user/${userId}`)
  },

  // 获取申请详情
  getApplicationDetail(applicationId) {
    return api.get(`/safety/applications/${applicationId}`)
  },

  // 更新申请状态
  updateApplicationStatus(applicationId, status) {
    return api.patch(`/safety/applications/${applicationId}/status`, { status })
  },

  // 获取用户信息
  getUserInfo(wxId) {
    return api.get(`/safety/user/${wxId}`)
  }
}
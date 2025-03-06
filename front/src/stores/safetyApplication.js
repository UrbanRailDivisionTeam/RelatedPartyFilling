import { defineStore } from 'pinia'
import { safetyApi } from '@/api/safety'
import axios from 'axios'

export const useSafetyApplicationStore = defineStore('safety-application', {
  state: () => ({
    userInfo: null,
    applicationForm: {
      name: '',
      idNumber: '',
      companyName: '',
      phoneNumber: '',
      workingTime: [],
      startDate: '',
      endDate: '',
      isProductWork: false,
      projectName: '',
      vehicleNumber: '',
      workLocation: '',
      trackPosition: '',
      workType: '',
      workContent: '',
      workBasis: '',
      basisNumber: '',
      dangerTypes: [],
      isDangerousWork: false,
      notifierName: '',
      notifierNumber: '',
      accompaningCount: 0,
      accompaningPersons: []
    },
    historicalRecords: []
  }),
  actions: {
    setUserInfo(info) {
      // 如果已经有相同 ID 的用户信息，不要覆盖
      const existingInfo = this.getUserInfo()
      if (existingInfo && existingInfo.wxId === info.wxId) {
        this.userInfo = existingInfo
        return
      }

      this.userInfo = info
      // 将用户信息保存到 localStorage
      localStorage.setItem('wxUserInfo', JSON.stringify(info))
    },

    // 获取用户信息
    getUserInfo() {
      if (this.userInfo) return this.userInfo

      // 从 localStorage 获取用户信息
      const savedInfo = localStorage.getItem('wxUserInfo')
      if (savedInfo) {
        try {
          this.userInfo = JSON.parse(savedInfo)
          return this.userInfo
        } catch (error) {
          console.error('解析用户信息失败:', error)
          localStorage.removeItem('wxUserInfo')
        }
      }
      return null
    },
    setApplicationForm(formData) {
      console.log('正在设置表单数据:', formData)

      // 确保所有字段都有默认值
      this.applicationForm = {
        name: '',
        idNumber: '',
        companyName: '',
        phoneNumber: '',
        workingTime: [],
        startDate: '',
        endDate: '',
        isProductWork: false,
        projectName: '',
        vehicleNumber: '',
        workLocation: formData.workLocation || '',  // 确保必填字段有值
        trackPosition: '',
        workType: formData.workType || '',         // 确保必填字段有值
        workContent: formData.workContent || '',    // 确保必填字段有值
        workBasis: '',
        basisNumber: '',
        dangerTypes: [],
        isDangerousWork: false,
        notifierName: formData.notifierName || '',  // 确保必填字段有值
        notifierNumber: formData.notifierNumber || '', // 确保必填字段有值
        accompaningCount: 0,
        accompaningPersons: [],
        ...formData
      }

      console.log('设置后的表单数据:', this.applicationForm)
    },
    async loadHistoricalRecord() {
      try {
        if (!this.userInfo?.wxId) {
          throw new Error('未获取到用户信息')
        }
        // 从后端 API 获取历史记录
        const response = await safetyApi.getHistoricalRecords(this.userInfo.wxId)
        this.historicalRecords = response.data || []

        // 保存到本地存储
        localStorage.setItem('safetyRecords', JSON.stringify(this.historicalRecords))
      } catch (error) {
        console.error('加载历史记录失败:', error)
        // 如果 API 调用失败，尝试从本地存储加载
        const records = localStorage.getItem('safetyRecords')
        this.historicalRecords = records ? JSON.parse(records) : []
      }
    },
    // 获取指定用户的最后一次申请记录
    getLastUserApplication(userId) {
      try {
        const records = this.historicalRecords
        if (!records || !records.length) return null

        // 查找该用户的所有记录并按时间排序
        const userRecords = records
          .filter(record => record.userId === userId)
          .sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime))

        // 返回最新的一条记录
        return userRecords[0] || null
      } catch (error) {
        console.error('获取用户最后申请记录失败:', error)
        return null
      }
    },
    async submitApplication(formData) {
      try {
        // 移除必填字段检查
        const newRecord = {
          applicationNumber: 'AP' + Date.now().toString().slice(-8),
          submitTime: new Date().toLocaleString(),
          userId: this.userInfo?.wxId || 'unknown',
          status: '审核中',
          ...formData
        }

        console.log('准备提交的完整数据:', newRecord)

        // 调用后端 API
        const response = await safetyApi.submitApplication(newRecord)
        console.log('提交响应:', response)

        if (!response.success) {
          throw new Error(response.message || '提交失败')
        }

        // 更新本地历史记录
        this.historicalRecords.unshift(response.data || newRecord)
        localStorage.setItem('safetyRecords', JSON.stringify(this.historicalRecords))

        return response.data || newRecord
      } catch (error) {
        console.error('提交申请失败:', error)
        throw error
      }
    },
    async getApplicationDetail(applicationId) {
      try {
        const response = await safetyApi.getApplicationDetail(applicationId)
        return response.data
      } catch (error) {
        console.error('获取申请详情失败:', error)
        throw error
      }
    },
    async getUserInfoByCode(code) {
      try {
        const response = await axios.post('/api/safety/auth', { code })
        return response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    }
  }
})
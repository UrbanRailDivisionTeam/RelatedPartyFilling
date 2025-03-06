<template>
  <div class="auth-container">
    <el-card class="auth-card">
      <template #header>
        <div class="auth-header">
          <h2>微信授权</h2>
        </div>
      </template>
      <div class="auth-content">
        <el-icon class="loading-icon" v-if="isLoading"><Loading /></el-icon>
        <p>{{ message }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSafetyApplicationStore } from '@/stores/safetyApplication'
import { getWechatUserInfo } from '@/utils/wechat'
import { Loading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useSafetyApplicationStore()
const isLoading = ref(true)
const message = ref('正在获取用户信息...')

onMounted(async () => {
  try {
    // 检查是否已有用户信息
    let userInfo = store.getUserInfo()
    
    if (!userInfo) {
      // 获取微信用户信息
      userInfo = await getWechatUserInfo()
      if (!userInfo) return // 如果正在重定向到微信授权页面，直接返回
      store.setUserInfo(userInfo)
    }
    
    console.log('当前用户信息:', userInfo)
    
    // 加载历史记录
    await store.loadHistoricalRecord()
    
    // 获取用户最后一次申请记录
    const lastRecord = store.getLastUserApplication(userInfo.wxId)
    console.log('找到的最后一次记录:', lastRecord)
    
    if (lastRecord) {
      // 清除时间相关字段
      const formData = { ...lastRecord }
      delete formData.submitTime
      delete formData.applicationNumber
      delete formData.status
      
      // 设置表单数据
      store.setApplicationForm(formData)
      console.log('设置的表单数据:', formData)
      ElMessage.success('已自动填充上次申请信息')
    }
    
    // 跳转到申请页面
    router.replace('/apply')
  } catch (error) {
    console.error('获取用户信息失败:', error)
    message.value = '获取用户信息失败，请重试'
    isLoading.value = false
  }
})
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
}

.auth-card {
  width: 100%;
  max-width: 400px;
}

.auth-header {
  text-align: center;
}

.auth-content {
  text-align: center;
  padding: 20px;
}

.loading-icon {
  font-size: 24px;
  color: #409EFF;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 
<script setup>
import { ref, onMounted } from 'vue'
import { generateQRCode, isWechatBrowser } from '@/utils/wechat'
import { Plus, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const qrCodeUrl = ref('')
const isWechat = ref(false)

onMounted(() => {
  isWechat.value = isWechatBrowser()
  
  if (!isWechat.value) {
    // 获取本机IP地址
    const networkUrl = import.meta.env.VITE_APP_URL || window.location.origin
    console.log('Network URL:', networkUrl) // 调试用
    qrCodeUrl.value = generateQRCode(networkUrl)
  }
})
</script>

<template>
  <div class="home-container">
    <h1>安全作业申请系统</h1>
    
    <!-- 根据环境显示不同内容 -->
    <template v-if="!isWechat">
      <div class="qr-container">
        <img :src="qrCodeUrl" alt="微信扫码登录" />
        <p>请使用微信扫码打开</p>
      </div>
    </template>
    
    <template v-else>
      <div class="action-cards">
        <el-card class="action-card" @click="$router.push('/apply')">
          <el-icon size="40"><Plus /></el-icon>
          <h2>新建申请</h2>
          <p>创建新的安全作业申请</p>
        </el-card>
        
        <el-card class="action-card" @click="$router.push('/records')">
          <el-icon size="40"><Document /></el-icon>
          <h2>申请记录</h2>
          <p>查看历史申请记录</p>
        </el-card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.qr-container {
  margin-top: 20px;
  text-align: center;
}

.qr-container img {
  width: 200px;
  height: 200px;
  margin-bottom: 10px;
}

.action-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
}

.action-card {
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
}

.el-icon {
  margin: 20px 0;
  color: #409EFF;
}

h1 {
  color: #303133;
  margin-bottom: 30px;
}

h2 {
  margin: 15px 0;
  color: #303133;
}

p {
  color: #606266;
  font-size: 14px;
}
</style>

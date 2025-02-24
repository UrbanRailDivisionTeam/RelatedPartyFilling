<script setup>
import { ref, onMounted } from 'vue'
import { isWechatBrowser } from '@/utils/wechat'
import { Plus, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const isWechat = ref(false)
const appUrl = ref('')

onMounted(() => {
  isWechat.value = isWechatBrowser()
  
  if (!isWechat.value) {
    // 获取应用访问地址
    appUrl.value = import.meta.env.VITE_APP_URL || window.location.origin
    console.log('App URL:', appUrl.value)
  }
})
</script>

<template>
  <div class="home-container">
    <h1>安全作业申请系统</h1>
    
    <!-- 根据环境显示不同内容 -->
    <template v-if="!isWechat">
      <div class="link-container">
        <p class="instruction">请使用手机微信访问以下链接：</p>
        <div class="link-box">
          <span class="link-text">{{ appUrl }}</span>
          <el-button 
            type="primary" 
            size="small"
            @click="() => {
              navigator.clipboard.writeText(appUrl);
              ElMessage.success('链接已复制');
            }"
          >
            复制链接
          </el-button>
        </div>
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

.link-container {
  margin-top: 40px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.instruction {
  color: #606266;
  margin-bottom: 20px;
  font-size: 16px;
}

.link-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.link-text {
  padding: 8px 15px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  color: #409EFF;
  font-size: 14px;
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

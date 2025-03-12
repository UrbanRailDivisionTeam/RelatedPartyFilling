<template>
  <div class="success-container">
    <h1>申请提交成功</h1>
    <div class="success-content">
      <el-icon class="success-icon">
        <CircleCheckFilled />
      </el-icon>
      <p class="title-style">您的安全作业申请已成功提交</p>
      <p class="reference-number">申请编号：{{ applicationNumber }}</p>
    </div>
    <div class="action-buttons">
      <el-button type="primary" @click="$router.push('/records')">查看申请记录</el-button>
      <el-button @click="$router.push('/apply')">继续申请</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { CircleCheckFilled } from '@element-plus/icons-vue'

const route = useRoute()
const applicationNumber = ref(route.query.applicationNumber || '')
</script>

<style scoped>
.success-container {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  padding: 20px;
}

.success-content {
  margin: 40px 0;
}

.success-icon {
  font-size: 80px;
  color: #67C23A;
  margin-bottom: 20px;
}

.reference-number {
  color: #666;
  margin: 20px 0;
}

.action-buttons {
  margin-top: 30px;
}

.action-buttons .el-button {
  margin: 0 10px;
}

.title-style{
  color: #303133;
}
</style>
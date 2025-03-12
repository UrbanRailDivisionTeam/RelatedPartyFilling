<script setup>
import { Plus, Document, User} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/counter';

const store = useAppStore()
</script>

<template>
  <div class="home-container">
    <h1>安全作业申请系统</h1>
    <div class="action-cards">
      <el-card class="action-card" @click="$router.push('/apply')">
        <el-icon size="40">
          <Plus />
        </el-icon>
        <h2>新建申请</h2>
        <p>创建新的安全作业申请</p>
      </el-card>
      <template v-if="store.userId === null">
        <el-card class="action-card" @click="$router.push('/login')">
          <el-icon size="40">
            <User />
          </el-icon>
          <h2>登录系统</h2>
          <p>输入必要信息以查看历史提交</p>
        </el-card>
      </template>
      <template v-else>
        <el-card class="action-card" @click="$router.push('/records')">
          <el-icon size="40">
            <Document />
          </el-icon>
          <h2>申请记录</h2>
          <p>查看历史申请记录</p>
        </el-card>
      </template>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
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

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <el-container class="layout-container">
    <el-header>
      <div class="header-content">
        <h1 v-if="$route.path !== '/'" @click="$router.push('/')" style="cursor: pointer">
          安全作业申请系统
        </h1>
        <el-menu
          mode="horizontal"
          :router="true"
          :default-active="$route.path"
          class="nav-menu"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/apply">新建申请</el-menu-item>
          <el-menu-item index="/records">申请记录</el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <el-main>
      <router-view />
    </el-main>

    <el-footer>
      <p>© 2024 安全作业申请系统 - All Rights Reserved</p>
    </el-footer>
  </el-container>
</template>

<style scoped>
.layout-container {
  min-height: 100vh;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #eee;
  padding: 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  height: auto;
  flex-direction: column;
  align-items: center;
}

.header-content h1 {
  margin: 10px 0;
  font-size: 20px;
  color: #303133;
  text-align: center;
}

.nav-menu {
  width: 100%;
  justify-content: center;
}

@media (min-width: 768px) {
  .header-content {
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
  }
  
  .header-content h1 {
    margin: 0;
  }
  
  .nav-menu {
    width: auto;
  }
}

.el-main {
  background-color: #f5f7fa;
  padding: 20px;
}

.el-footer {
  text-align: center;
  color: #909399;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #eee;
}
</style>

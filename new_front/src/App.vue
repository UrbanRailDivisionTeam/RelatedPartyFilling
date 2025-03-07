<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <el-container class="layout-container">
    <el-header>
        <el-menu mode="horizontal" :router="true" :default-active="$route.path" class="nav-menu">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/apply">新建申请</el-menu-item>
          <el-menu-item index="/records">申请记录</el-menu-item>
        </el-menu>
    </el-header>
    <el-main>
      <RouterView />
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

.nav-menu {
  width: 100%;
  justify-content: center;
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

<script setup>
import { ref, onMounted } from 'vue'
import { generateQRCode } from '@/utils/utils'

const qrCodeUrl = ref('')
onMounted(() => {
  // 生成二维码
  qrCodeUrl.value = generateQRCode()
})

</script>

<template>
  <div class="home-container">
    <h1>安全作业申请系统</h1>
    <div class="qrcode-container">
      <p class="instruction">若想在手机上提交，请使用手机扫描下方二维码：</p>
      <img :src="qrCodeUrl" alt="扫码" class="qrcode" />
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

.qrcode-container {
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

.qrcode {
  width: 200px;
  height: 200px;
  margin: 20px auto;
  display: block;
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
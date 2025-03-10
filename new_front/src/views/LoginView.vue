<template>
  <el-form ref="formRef" :model="userId" :rules="rules" @submit.prevent="handleSubmit" class="safety-form">
    <!-- 基本信息部分 -->
    <div class="form-section">
      <el-text class="mx-1" size="large">
        输入电话即可获取历史提交
        <span class="required">*</span>
      </el-text>
      <el-input v-model="userId.id" placeholder="联系电话" :maxlength="11" @blur="validatePhoneNumber" />
    </div>
    <div class="form-actions">
      <el-button type="primary" native-type="submit">提交</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/counter';
import { ElMessage } from 'element-plus'

const store = useAppStore()
const router = useRouter()
const userId = ref({ id: '' })
const isCheck = ref(true)
const rules = { id: [{ required: true, trigger: 'blur' }] };

// 验证手机号
const validatePhoneNumber = async () => {
  const phoneReg = /^1[3-9]\d{9}$/
  isCheck.value = phoneReg.test(userId.value.id)
  if (!isCheck.value) {
    ElMessage.error('请输入正确的手机号')
  }
}

const handleSubmit = async () => {
  if (isCheck.value) { 
    store.userId = userId.value.id
    ElMessage.success('登陆成功，正在跳转......') 
    router.push('/')
  }
}
</script>

<style scoped>
.safety-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 4px;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.required {
  color: #F56C6C;
  margin-left: 4px;
}
</style>
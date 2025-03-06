<template>
  <div class="apply-container">
    <h1>安全作业申请</h1>
    <safety-application-form />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSafetyApplicationStore } from '@/stores/safetyApplication'
import { ElMessage } from 'element-plus'
import SafetyApplicationForm from '@/components/SafetyApplicationForm.vue'

const store = useSafetyApplicationStore()
const form = ref({ ...store.applicationForm })

onMounted(async () => {
  try {
    // 获取用户信息
    const userInfo = store.getUserInfo()
    if (!userInfo) {
      ElMessage.error('未获取到用户信息')
      return
    }

    console.log('当前用户信息:', userInfo)

    // 加载历史记录
    await store.loadHistoricalRecord()

    // 获取最后一次申请记录
    const lastRecord = store.getLastUserApplication(userInfo.wxId)
    console.log('最后一次申请记录:', lastRecord)

    if (lastRecord) {
      // 清除时间相关字段
      const formData = { ...lastRecord }
      delete formData.submitTime
      delete formData.applicationNumber
      delete formData.status

      // 更新表单数据
      form.value = { ...form.value, ...formData }
      console.log('设置的表单数据:', form.value)
    }
  } catch (error) {
    console.error('加载历史记录失败:', error)
    ElMessage.error('加载历史记录失败')
  }
})
</script>
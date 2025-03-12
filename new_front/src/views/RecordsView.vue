<template>
  <div class="records-container">
    <h1>申请记录</h1>

    <!-- 移动端记录列表 -->
    <div class="mobile-records">
      <el-card v-for="record in store.historicalRecords" :key="record.applicationNumber" class="record-card">
        <div class="record-header">
          <span class="application-number">{{ record.applicationNumber }}</span>
          <span class="submit-time">{{ formatDate(record.submitTime) }}</span>
        </div>
        <div class="record-content">
          <p><strong>作业类型：</strong>{{ record.workType }}</p>
          <p><strong>作业内容：</strong>{{ record.workContent }}</p>
          <p><strong>作业地点：</strong>{{ record.workLocation }}</p>
          <p><strong>计划时间：</strong>{{ formatDate(record.startDate) }} 至 {{ formatDate(record.endDate) }}</p>
          <el-button type="primary" link @click="viewDetail(record)">查看详情</el-button>
        </div>
      </el-card>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="申请详情" width="95%" :fullscreen="true" custom-class="mobile-dialog">
      <div v-if="currentRecord" class="detail-content">
        <div class="detail-section">
          <h3>基本信息</h3>
          <div class="info-item">
            <label>申请编号：</label>
            <span>{{ currentRecord.applicationNumber }}</span>
          </div>
          <div class="info-item">
            <label>提交时间：</label>
            <span>{{ formatDate(currentRecord.submitTime) }}</span>
          </div>
          <div class="info-item">
            <label>申请人：</label>
            <span>{{ currentRecord.name }}</span>
          </div>
          <div class="info-item">
            <label>联系电话：</label>
            <span>{{ currentRecord.phoneNumber }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>作业信息</h3>
          <div class="info-item">
            <label>开工日期</label>
            <span>{{ formatDate(currentRecord.startDate) }} 的 {{ currentRecord.startTime }}</span>
          </div>
          <div class="info-item">
            <label>开工时长</label>
            <span>{{ currentRecord.workingHours}}</span>
          </div>
          <div class="info-item">
            <label>作业地点：</label>
            <span>{{ currentRecord.workLocation }}</span>
          </div>
          <div class="info-item">
            <label>作业类型：</label>
            <span>{{ currentRecord.workType }}</span>
          </div>
          <div class="info-item">
            <label>作业内容：</label>
            <span>{{ currentRecord.workContent }}</span>
          </div>
          <div class="info-item">
            <label>是否产品类作业：</label>
            <span>{{ currentRecord.isProductWork ? '是' : '否' }}</span>
          </div>

          <!-- 产品类作业相关信息 -->
          <template v-if="currentRecord.isProductWork">
            <div class="info-item">
              <label>项目名称：</label>
              <span>{{ currentRecord.projectName }}</span>
            </div>
            <div class="info-item">
              <label>车号：</label>
              <span>{{ currentRecord.vehicleNumber }}</span>
            </div>
            <div class="info-item">
              <label>车道/台位：</label>
              <span>{{ currentRecord.trackPosition }}</span>
            </div>
          </template>

          <!-- 质量返工相关信息 -->
          <template v-if="currentRecord.workType === '质量返工'">
            <div class="info-item">
              <label>作业依据：</label>
              <span>{{ currentRecord.workBasis }}</span>
            </div>
            <div class="info-item">
              <label>编号：</label>
              <span>{{ currentRecord.basisNumber }}</span>
            </div>
          </template>
        </div>

        <div class="detail-section">
          <h3>危险作业信息</h3>
          <div class="info-item">
            <label>危险作业类型：</label>
            <span>{{ currentRecord.dangerTypes.join('、') || '无' }}</span>
          </div>
          <div class="info-item">
            <label>是否危险作业：</label>
            <span>{{ currentRecord.isDangerousWork ? '是' : '否' }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>通知人信息</h3>
          <div class="info-item">
            <label>通知人姓名：</label>
            <span>{{ currentRecord.notifierName }}</span>
          </div>
          <div class="info-item">
            <label>通知人工号：</label>
            <span>{{ currentRecord.notifierNumber }}</span>
          </div>
        </div>

        <template v-if="currentRecord.accompaningPersons?.length">
          <div class="detail-section">
            <h3>随行人员信息</h3>
            <el-table :data="currentRecord.accompaningPersons" border style="width: 100%">
              <el-table-column prop="name" label="姓名" />
              <el-table-column prop="idNumber" label="身份证号" />
              <el-table-column prop="phoneNumber" label="联系电话" />
            </el-table>
          </div>
        </template>

        <div class="dialog-footer">
          <el-button type="primary" class="close-btn" @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/counter'
import { safetyApi } from '@/utils/utils'

const store = useAppStore()
const detailDialogVisible = ref(false)
const currentRecord = ref(null)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const viewDetail = (row) => {
  currentRecord.value = row
  detailDialogVisible.value = true
}

onMounted(async () => {
  try {
    // 从后端获取历史记录
    store.historicalRecords = await safetyApi.getHistoricalRecords()
  } catch (error) {
    console.error('加载记录失败:', error)
    ElMessage.error({
        message: '加载记录失败:' || error,
        duration: 0,
        showClose: true
      })
    
  }
})
</script>

<style scoped>
.records-container {
  padding: 15px;
}

.mobile-records {
  margin-top: 15px;
}

.record-card {
  margin-bottom: 15px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.application-number {
  color: #409EFF;
  font-weight: bold;
}

.submit-time {
  color: #909399;
}

.record-content {
  font-size: 14px;
}

.record-content p {
  margin: 8px 0;
  line-height: 1.4;
  /* 超出两行显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-content strong {
  color: #606266;
  display: inline-block;
  width: 75px;
}

.mobile-dialog {
  margin: 0;
  padding: 0;
}

.detail-content {
  padding: 15px;
}

.detail-section {
  margin-bottom: 20px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.detail-section h3 {
  margin: 0 0 15px;
  color: #303133;
  font-size: 16px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
}

.info-item label {
  color: #606266;
  width: 100px;
  flex-shrink: 0;
}

.info-item span {
  color: #303133;
  flex: 1;
}

.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.close-btn {
  width: 120px;
  /* 设置固定宽度 */
}

@media (max-width: 768px) {
  .dialog-footer {
    justify-content: center;
  }

  .close-btn {
    width: 160px;
    /* 在移动端设置更大的宽度 */
  }
}

h1 {
  color: #303133;
}
</style>
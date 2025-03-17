<template>
  <div class="apply-container">
    <div style="display: grid; place-items: center;">
      <h1>安全作业申请</h1>
    </div>
    <el-form ref="formRef" :model="store.applicationForm" :rules="rules" @submit.prevent="handleSubmit"
      class="safety-form">
      <!-- 基本信息部分 -->
      <div class="form-section">
        <h2>基本信息 <span class="required">*</span></h2>
        <el-input v-model="store.applicationForm.name" placeholder="姓名" required />
        <el-input v-model="store.applicationForm.idNumber" placeholder="身份证号" required :maxlength="18"
          @blur="validateIdNumber" />
        <el-input v-model="store.applicationForm.companyName" placeholder="公司名称" required />
        <el-input v-model="store.applicationForm.phoneNumber" placeholder="联系电话" required :maxlength="11"
          :disabled="numberDisable" @blur="validatePhoneNumber" />
      </div>

      <!-- 作业信息部分 -->
      <div class="form-section">
        <h2>作业信息 <span class="required">*</span></h2>
        <div class="date-range form-item">
          <el-date-picker v-model="store.applicationForm.startDate" type="date" placeholder="计划开工日期" required
            value-format="YYYY-MM-DD" format="YYYY/M/D" :disabled-date="disabledDate" :style="{ width: '100%' }" />
        </div>
        <el-select v-model="store.applicationForm.startTime" placeholder="开工开始时间" required clearable>
          <el-option label="上午" value="上午" />
          <el-option label="下午" value="下午" />
        </el-select>

        <el-select v-model="store.applicationForm.workingHours" placeholder="工作时长" required clearable>
          <el-option label="半天" value="半天" />
          <el-option label="一天" value="一天" />
          <el-option label="一天半" value="一天半" />
          <el-option label="两天" value="两天" />
          <el-option label="两天半" value="两天半" />
          <el-option label="三天" value="三天" />
        </el-select>


        <!-- 作业地点 -->
        <el-select v-model="store.applicationForm.workLocation" placeholder="作业地点" required multiple clearable>
          <el-option label="总成车间" value="总成车间" />
          <el-option label="老调试" value="老调试" />
          <el-option label="新调试" value="新调试" />
          <el-option label="动车组调试基地" value="动车组调试基地" />
          <el-option label="磁浮厂房" value="磁浮厂房" />
          <el-option label="库外" value="库外" />
        </el-select>

        <!-- 作业类型 -->
        <el-select v-model="store.applicationForm.workType" placeholder="作业类型" required @change="handleWorkTypeChange">
          <el-option label="质量返工" value="质量返工" />
          <el-option label="家具维修及活动策划" value="家具维修及活动策划" />
          <el-option label="工装工具相关作业" value="工装工具相关作业" />
          <el-option label="现场调研" value="现场调研" />
          <el-option label="基建施工" value="基建施工" />
          <el-option label="生产设备维修" value="生产设备维修" />
          <el-option label="办公设备设施维修" value="办公设备设施维修" />
        </el-select>

        <!-- 产品类作业相关字段 -->
        <template v-if="store.applicationForm.workType === '质量返工'">
          <el-input v-model="store.applicationForm.projectName" placeholder="项目名称" required />
          <el-input v-model="store.applicationForm.vehicleNumber" placeholder="车号" required />
          <el-input v-model="store.applicationForm.trackPosition" placeholder="车道/台位" required />
        </template>

        <!-- 作业内容 -->
        <el-select v-model="store.applicationForm.workContent" placeholder="具体作业内容" required
          :disabled="!store.applicationForm.workType">
          <el-option
            v-for="option in store.applicationForm.workType ? workContentMap[store.applicationForm.workType] : []"
            :key="option" :label="option" :value="option" />
        </el-select>

        <!-- 质量返工相关字段 -->
        <template v-if="store.applicationForm.workType === '质量返工'">
          <el-select v-model="store.applicationForm.workBasis" placeholder="作业依据" required>
            <el-option label="NCR" value="NCR" />
            <el-option label="开口项" value="开口项" />
            <el-option label="设计变更" value="设计变更" />
          </el-select>

          <el-input v-model="store.applicationForm.basisNumber" placeholder="NCR/开口项/设计变更编号" required />
        </template>
      </div>

      <!-- 危险作业信息 -->
      <div class="form-section">
        <h2>危险作业信息 <span class="required">*</span></h2>
        <el-checkbox-group v-model="store.applicationForm.dangerTypes">
          <el-checkbox label="配合车辆静、动态调试作业" value="配合车辆静、动态调试作业">配合车辆静、动态调试作业</el-checkbox>
          <el-checkbox label="登高作业" value="登高作业">登高作业</el-checkbox>
          <el-checkbox label="动火作业" value="动火作业">动火作业</el-checkbox>
          <el-checkbox label="危化品使用" value="危化品使用">危化品使用</el-checkbox>
          <el-checkbox label="金属切割作业" value="金属切割作业">金属切割作业</el-checkbox>
          <el-checkbox label="吊装作业" value="吊装作业">吊装作业</el-checkbox>
          <el-checkbox label="临时用电作业" value="临时用电作业">临时用电作业</el-checkbox>
          <el-checkbox label="有限空间作业" value="有限空间作业">有限空间作业</el-checkbox>
          <el-checkbox label="交叉作业" value="交叉作业">交叉作业</el-checkbox>
          <el-checkbox label="临边作业" value="临边作业">临边作业</el-checkbox>
        </el-checkbox-group>
      </div>

      <!-- 事业部对接人信息 -->
      <div class="form-section">
        <h2>事业部对接人信息 <span class="required">*</span></h2>
        <el-input v-model="store.applicationForm.notifierName" placeholder="对接人姓名" required />
        <el-input v-model="store.applicationForm.notifierNumber" placeholder="对接人工号（选填，12位工号）" :maxlength="12"
          @blur="validateNotifierNumber" />
        <el-input v-model="store.applicationForm.notifierDepartment" placeholder="所属部门" required />
      </div>

      <!-- 随行人员信息 -->
      <div class="form-section">
        <h2>随行人员信息</h2>
        <el-input-number v-model="store.applicationForm.accompaningCount" :min="0" placeholder="随行人数"
          @change="handleAccompaningCountChange" />
        <div v-for="(person, index) in store.applicationForm.accompaningPersons" :key="index"
          class="accompanying-person">
          <h3>随行人员 {{ index + 1 }} <span class="required">*</span></h3>
          <el-input v-model="person.name" placeholder="姓名" required />
          <el-input v-model="person.idNumber" placeholder="身份证号" required :maxlength="18"
            @blur="(e) => validateAccompaningIdNumber(e, index)" />
          <el-input v-model="person.phoneNumber" placeholder="联系电话" required :maxlength="11"
            @blur="(e) => validateAccompaningPhoneNumber(e, index)" />
        </div>
      </div>

      <div class="form-actions">
        <el-button type="primary" native-type="submit">提交申请</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/counter'
import { safetyApi } from '@/utils/utils'
import dayjs from 'dayjs';

const store = useAppStore()
const router = useRouter()
const numberDisable = ref(false)

// 作业内容选项映射
const workContentMap = {
  '家具维修及活动策划': ['家具维修', '活动策划安排'],
  '工装工具相关作业': [
    '工具送货',
    '工具维修',
    '工具计量',
    '工装送货',
    '工装验证',
    '工装改造维修',
    '工装售后维护'
  ],
  '现场调研': [
    '参观调研',
    '采访调研',
    '工艺技术调研',
    '质量技术调研',
    '设备设施调研'
  ],
  '质量返工': [
    '来料开口项返工',
    'Q30开口项返工',
    'Q40开口项返工',
    'PSI开口项返工',
    '业主开口项返工',
    'NCR开口项返工'
  ],
  '基建施工': ['建筑物及附属设施维护维修'],
  '生产设备维修': ['设备常规维护保养及故障维修'],
  '办公设备设施维修': ['电脑', '打印机', '音响']
}
// 用于验证的正则
const idNumberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
const phoneReg = /^1[3-9]\d{9}$/
const notifierNumberReg = /^\d{12}$/

// 修改作业类型变更处理函数
const handleWorkTypeChange = (values) => {
  // 清空作业内容
  store.applicationForm.workContent = ''
  // 根据作业类型自动设置是否为产品类作业（后台仍保存该字段）
  store.applicationForm.isProductWork = store.applicationForm.workType === '质量返工'
  // 如果不是产品类作业，清空产品相关字段
  if (!store.applicationForm.isProductWork) {
    store.applicationForm.projectName = ''
    store.applicationForm.vehicleNumber = ''
    store.applicationForm.trackPosition = ''
  }
}

// 验证身份证号
const validateIdNumber = () => {
  if (!idNumberReg.test(store.applicationForm.idNumber)) {
    ElMessage.warning({
      message: '请输入正确的身份证号',
      duration: 1500,
      showClose: true
    })
    store.applicationForm.idNumber = ''
  }
}

// 验证手机号
const validatePhoneNumber = () => {
  if (!phoneReg.test(store.applicationForm.phoneNumber)) {
    ElMessage.warning({
      message: '请输入正确的手机号',
      duration: 1500,
      showClose: true
    })
    store.applicationForm.phoneNumber = ''
  }
}

// 验证工号
const validateNotifierNumber = () => {
  if (store.applicationForm.notifierNumber !== '' && !notifierNumberReg.test(store.applicationForm.notifierNumber)) {
    ElMessage.warning({
      message: '请输入12位数字工号',
      duration: 1500,
      showClose: true
    })
    store.applicationForm.notifierNumber = ''
  }
}

// 处理随行人数变更
const handleAccompaningCountChange = (currentValue, oldValue) => {
  const currentLength = store.applicationForm.accompaningPersons.length
  if (store.applicationForm.accompaningCount > currentLength) {
    // 添加新的随行人员
    for (let i = currentLength; i < store.applicationForm.accompaningCount; i++) {
      store.applicationForm.accompaningPersons.push({
        name: '',
        idNumber: '',
        phoneNumber: ''
      })
    }
  } else if (store.applicationForm.accompaningCount < currentLength) {
    // 移除多余的随行人员
    store.applicationForm.accompaningPersons.splice(store.applicationForm.accompaningCount)
  }
}

// 验证随行人员身份证号
const validateAccompaningIdNumber = (e, index) => {
  if (!idNumberReg.test(store.applicationForm.accompaningPersons[index].idNumber)) {
    ElMessage.warning({
      message: `随行人员 ${index + 1} 的身份证号格式不正确`,
      duration: 1500,
      showClose: true
    })
    store.applicationForm.accompaningPersons[index].idNumber = ''
  }
}

// 验证随行人员手机号
const validateAccompaningPhoneNumber = (e, index) => {
  if (!phoneReg.test(store.applicationForm.accompaningPersons[index].phoneNumber)) {
    ElMessage.warning({
      message: `随行人员 ${index + 1} 的手机号格式不正确`,
      duration: 1500,
      showClose: true
    })
    store.applicationForm.accompaningPersons[index].phoneNumber = ''
  }
}

// 修改表单验证规则
const rules = {
  // 基本信息
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idNumber: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  phoneNumber: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],

  // 作业信息
  startDate: [{ required: true, message: '请选择开工日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开工时间', trigger: 'change' }],
  workingHours: [{ required: true, message: '请选择作业时长', trigger: 'change' }],

  workLocation: [{ required: true, message: '请选择作业地点', trigger: 'change' }],
  workType: [{ required: true, message: '请选择作业类型', trigger: 'change' }],
  workContent: [{ required: true, message: '请选择作业内容', trigger: 'change' }],

  // 通知人信息
  notifierName: [{ required: true, message: '请输入对接人姓名', trigger: 'blur' }],
  notifierDepartment: [{ required: true, message: '请输入所属部门', trigger: 'blur' }]
}

// 添加日期禁用函数
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

const formRef = ref(null)

// 修改表单验证函数
const validateForm = () => {
  // 基本信息验证
  if (!store.applicationForm.name?.trim()) throw new Error('请填写姓名')
  if (!store.applicationForm.idNumber?.trim()) throw new Error('请填写身份证号')
  if (!store.applicationForm.companyName?.trim()) throw new Error('请填写公司名称')
  if (!store.applicationForm.phoneNumber?.trim()) throw new Error('请填写联系电话')

  // 作业信息验证
  if (!store.applicationForm.startDate) throw new Error('请选择开工日期')
  if (!store.applicationForm.startTime) throw new Error('请选择开工时间时是上午还是下午')
  if (!store.applicationForm.workingHours) throw new Error('请选择工作时长')

  if (!store.applicationForm.workLocation?.length) throw new Error('请选择作业地点')
  if (!store.applicationForm.workType?.trim()) throw new Error('请选择作业类型')
  if (!store.applicationForm.workContent?.trim()) throw new Error('请选择作业内容')

  // 产品类作业验证
  if (store.applicationForm.isProductWork) {
    if (!store.applicationForm.projectName?.trim()) throw new Error('请填写项目名称')
    if (!store.applicationForm.vehicleNumber?.trim()) throw new Error('请填写车号')
    if (!store.applicationForm.trackPosition?.trim()) throw new Error('请填写车道/台位')
  }

  // 质量返工验证
  if (store.applicationForm.workType === '质量返工') {
    if (!store.applicationForm.workBasis?.trim()) throw new Error('请选择作业依据')
    if (!store.applicationForm.basisNumber?.trim()) throw new Error('请填写编号')
  }

  // 通知人信息验证
  if (!store.applicationForm.notifierName?.trim()) throw new Error('请填写对接人姓名')
  if (!store.applicationForm.notifierDepartment?.trim()) throw new Error('请填写所属部门')

  // 随行人员验证
  if (store.applicationForm.accompaningCount > 0) {
    if (!store.applicationForm.accompaningPersons?.length) {
      throw new Error('请添加随行人员信息')
    }
    store.applicationForm.accompaningPersons.forEach((person, index) => {
      if (!person.name?.trim()) throw new Error(`请填写随行人员${index + 1}的姓名`)
      if (!person.idNumber?.trim()) throw new Error(`请填写随行人员${index + 1}的身份证号`)
      if (!person.phoneNumber?.trim()) throw new Error(`请填写随行人员${index + 1}的联系电话`)
    })
  }
}

// 修改提交处理函数
const handleSubmit = async () => {
  try {
    // 进行表单验证
    const valid = await formRef.value.validate()
    if (!valid) {
      throw new Error('表单验证失败')
    }
    // 进行自定义验证
    validateForm()
    // 如果没有登陆，自动根据电话号登录
    if (store.userId === null) {
      store.userId = store.applicationForm.phoneNumber
    }
    // 添加提交相关的信息
    store.applicationForm.submitTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    store.applicationForm.applicationNumber = store.applicationForm.idNumber + store.applicationForm.phoneNumber + store.applicationForm.submitTime
    // 提交申请
    await safetyApi.submitApplication()
    // 获取历史数据
    store.historicalRecords = (await safetyApi.getHistoricalRecords()).data
    // 提交成功后跳转
    router.push('/success')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error({
      message: error.message || '提交失败',
      duration: 0,
      showClose: true
    })
  }
}

onMounted(async () => {
  try {
    if (store.userId === null) {
      ElMessage.warning({
        message: '用户未登录，无法获取历史提交',
        duration: 1500,
        showClose: true
      })
    }
    else if (!store.applicationForm) {
      // 没有当前提交，就更新历史提交，并从历史提交中抽取最近的
      store.historicalRecords = (await safetyApi.getHistoricalRecords()).data
      if (store.historicalRecords.length) {
        store.applicationForm = store.historicalRecords[0]
      }
      else {
        ElMessage.warning({
          message: '没有历史数据，无法自动填充',
          duration: 1500,
          showClose: true
        })
      }
    }
    // 自动填充电话号
    if (store.userId !== null && store.applicationForm.phoneNumber === '') {
      store.applicationForm.phoneNumber = store.userId
      numberDisable.value = true
    }
  }
  catch (error) {
    console.error('初始化失败:', error)
    ElMessage.error({
      message: '获取用户信息失败',
      duration: 0,
      showClose: true
    })
  }
})


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

.form-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.el-input,
.el-select,
.el-date-picker {
  margin-bottom: 15px;
  width: 100%;
}

.accompanying-person {
  border: 1px solid #eee;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.el-checkbox-group {
  margin-bottom: 15px;
}

.form-item {
  margin-bottom: 20px;
  width: 100%;
}

.form-label {
  margin-right: 15px;
  color: #606266;
  font-size: 14px;
  width: 120px;
  text-align: right;
}

.required {
  color: #F56C6C;
  margin-left: 4px;
}

.accompanying-person h3 {
  margin-bottom: 15px;
  color: #606266;
  font-size: 16px;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: #909399;
  font-size: 16px;
  padding: 0 4px;
}

h1 {
  color: #303133;
}
</style>
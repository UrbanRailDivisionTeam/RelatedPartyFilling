<template>
  <el-form 
    ref="formRef"
    :model="form"
    :rules="rules"
    @submit.prevent="handleSubmit"
    class="safety-form"
  >
    <!-- 基本信息部分 -->
    <div class="form-section">
      <h2>基本信息 <span class="required">*</span></h2>
      <el-input 
        v-model="form.name" 
        placeholder="姓名" 
        required 
      />
      <el-input 
        v-model="form.idNumber" 
        placeholder="身份证号" 
        required
        :maxlength="18"
        @blur="validateIdNumber"
      />
      <el-input 
        v-model="form.companyName" 
        placeholder="公司名称" 
        required 
      />
      <el-input 
        v-model="form.phoneNumber" 
        placeholder="联系电话" 
        required
        :maxlength="11"
        @blur="validatePhoneNumber"
      />
    </div>

    <!-- 作业信息部分 -->
    <div class="form-section">
      <h2>作业信息 <span class="required">*</span></h2>
      
      <!-- 作业时间和日期选择 -->
      <el-select 
        v-model="form.workingTime" 
        placeholder="申请作业时间" 
        required
        class="form-item"
        @change="handleWorkingTimeChange"
      >
        <el-option label="上午" value="morning" />
        <el-option label="下午" value="afternoon" />
        <el-option label="全天" value="fullDay" />
        <el-option label="两天" value="twoDays" />
        <el-option label="三天" value="threeDays" />
      </el-select>
      
      <!-- 日期选择器 -->
      <div class="date-range form-item">
        <el-date-picker 
          v-model="form.startDate" 
          type="date" 
          placeholder="计划开工日期"
          required
          value-format="YYYY-MM-DD"
          format="YYYY/M/D"
          :disabled-date="disabledDate"
          class="date-picker"
          @change="validateDateRange"
        />
        <span class="date-separator" v-if="needsEndDate">~</span>
        <el-date-picker 
          v-if="needsEndDate"
          v-model="form.endDate" 
          type="date" 
          placeholder="计划完工日期"
          value-format="YYYY-MM-DD"
          format="YYYY/M/D"
          :disabled-date="disabledEndDate"
          class="date-picker"
          @change="validateDateRange"
        />
      </div>
      
      <!-- 作业地点 -->
      <el-select 
        v-model="form.workLocation" 
        placeholder="作业地点" 
        required
        multiple
        clearable
        @change="handleWorkLocationChange"
      >
        <el-option label="总成车间" value="总成车间" />
        <el-option label="老调试" value="老调试" />
        <el-option label="新调试" value="新调试" />
        <el-option label="动车组调试基地" value="动车组调试基地" />
        <el-option label="磁浮厂房" value="磁浮厂房" />
        <el-option label="库外" value="库外" />
      </el-select>

      <!-- 作业类型 -->
      <el-select 
        v-model="form.workType" 
        placeholder="作业类型" 
        required
        @change="handleWorkTypeChange"
      >
        <el-option label="质量返工" value="质量返工" />
        <el-option label="家具维修及活动策划" value="家具维修及活动策划" />
        <el-option label="工装工具相关作业" value="工装工具相关作业" />
        <el-option label="现场调研" value="现场调研" />
        <el-option label="基建施工" value="基建施工" />
        <el-option label="生产设备维修" value="生产设备维修" />
        <el-option label="办公设备设施维修" value="办公设备设施维修" />
      </el-select>

      <!-- 产品类作业相关字段 -->
      <template v-if="isProductWork">
        <el-input 
          v-model="form.projectName" 
          placeholder="项目名称" 
          required 
        />
        <el-input 
          v-model="form.vehicleNumber" 
          placeholder="车号" 
          required 
        />
        <el-input 
          v-model="form.trackPosition" 
          placeholder="车道/台位" 
          required 
        />
      </template>

      <!-- 作业内容 -->
      <el-select 
        v-model="form.workContent" 
        placeholder="具体作业内容"
        required
        :disabled="!form.workType"
      >
        <el-option 
          v-for="option in workContentOptions" 
          :key="option" 
          :label="option" 
          :value="option" 
        />
      </el-select>

      <!-- 质量返工相关字段 -->
      <template v-if="form.workType === '质量返工'">
        <el-select 
          v-model="form.workBasis" 
          placeholder="作业依据" 
          required
        >
          <el-option label="NCR" value="NCR" />
          <el-option label="开口项" value="开口项" />
          <el-option label="设计变更" value="设计变更" />
        </el-select>

        <el-input 
          v-model="form.basisNumber" 
          placeholder="NCR/开口项/设计变更编号"
          required 
        />
      </template>
    </div>

    <!-- 危险作业信息 -->
    <div class="form-section">
      <h2>危险作业信息 <span class="required">*</span></h2>
      <el-checkbox-group 
        v-model="form.dangerTypes"
        @change="handleDangerTypesChange"
      >
        <el-checkbox label="动火">动火作业</el-checkbox>
        <el-checkbox label="登高临边">登高临边作业</el-checkbox>
        <el-checkbox label="起重">起重作业</el-checkbox>
        <el-checkbox label="受限空间">受限空间作业</el-checkbox>
      </el-checkbox-group>

      <div class="form-item">
        <label class="form-label">是否危险作业：<span class="required">*</span></label>
        <el-radio-group 
          v-model="form.isDangerousWork"
          :disabled="form.workLocation.includes('库外') || form.dangerTypes.length > 0"
        >
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </div>
    </div>

    <!-- 事业部对接人信息 -->
    <div class="form-section">
      <h2>事业部对接人信息 <span class="required">*</span></h2>
      <el-input 
        v-model="form.notifierName" 
        placeholder="对接人姓名" 
        required 
      />
      <el-input 
        v-model="form.notifierNumber" 
        placeholder="对接人工号（选填，12位工号）" 
        :maxlength="12"
        @blur="validateNotifierNumber"
      />
      <el-input 
        v-model="form.notifierDepartment" 
        placeholder="所属部门" 
        required 
      />
    </div>

    <!-- 随行人员信息 -->
    <div class="form-section">
      <h2>随行人员信息</h2>
      <el-input-number 
        v-model="form.accompaningCount" 
        :min="0" 
        placeholder="随行人数"
        @change="handleAccompaningCountChange"
      />
      <div v-for="(person, index) in form.accompaningPersons" :key="index" class="accompanying-person">
        <h3>随行人员 {{index + 1}} <span class="required">*</span></h3>
        <el-input 
          v-model="person.name" 
          placeholder="姓名" 
          required 
        />
        <el-input 
          v-model="person.idNumber" 
          placeholder="身份证号" 
          required
          :maxlength="18"
          @blur="(e) => validateAccompaningIdNumber(e, index)"
        />
        <el-input 
          v-model="person.phoneNumber" 
          placeholder="联系电话" 
          required
          :maxlength="11"
          @blur="(e) => validateAccompaningPhoneNumber(e, index)"
        />
      </div>
    </div>

    <div class="form-actions">
      <el-button type="primary" native-type="submit">提交申请</el-button>
    </div>
  </el-form>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useSafetyApplicationStore } from '@/stores/safetyApplication'
import { getWechatUserInfo } from '@/utils/wechat'
// 导入中文语言包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const store = useSafetyApplicationStore()
const router = useRouter()
const route = useRoute()
const form = ref({
  // 基本信息
  name: '',
  idNumber: '',
  companyName: '',
  phoneNumber: '',
  
  // 作业信息
  workingTime: '',
  startDate: '',
  endDate: '',
  isProductWork: false,
  projectName: '',
  vehicleNumber: '',
  workLocation: [],
  trackPosition: '',
  workType: '',
  workContent: '',
  workBasis: '',
  basisNumber: '',
  
  // 危险作业信息
  dangerTypes: [],
  isDangerousWork: false,
  
  // 通知人信息
  notifierName: '',
  notifierNumber: '',
  notifierDepartment: '',
  
  // 随行人员信息
  accompaningCount: 0,
  accompaningPersons: []
})

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

// 根据作业类型计算作业内容选项
const workContentOptions = computed(() => {
  return form.value.workType ? workContentMap[form.value.workType] : []
})

// 添加计算属性判断是否为产品类作业
const isProductWork = computed(() => {
  return form.value.workType === '质量返工'
})

// 修改作业类型变更处理函数
const handleWorkTypeChange = () => {
  // 清空作业内容
  form.value.workContent = ''
  
  // 根据作业类型自动设置是否为产品类作业（后台仍保存该字段）
  form.value.isProductWork = form.value.workType === '质量返工'
  
  // 如果不是产品类作业，清空产品相关字段
  if (!form.value.isProductWork) {
    form.value.projectName = ''
    form.value.vehicleNumber = ''
    form.value.trackPosition = ''
  }
}

// 修改作业地点变更处理函数
const handleWorkLocationChange = (values) => {
  console.log('作业地点变更:', values)
  form.value.workLocation = values || []
  
  // 如果选择包含库外作业，自动设置为危险作业并锁定
  if (values.includes('库外')) {
    form.value.isDangerousWork = true
  } else if (form.value.dangerTypes.length === 0) {
    // 如果不包含库外且没有选择危险作业类型，则允许修改危险作业状态
    form.value.isDangerousWork = false
  }
}

// 修改危险作业类型变更处理函数
const handleDangerTypesChange = (values) => {
  if (values.length > 0) {
    form.value.isDangerousWork = true
  } else if (!form.value.workLocation.includes('库外')) {
    // 只有当没有选择库外作业时，才允许修改为非危险作业
    form.value.isDangerousWork = false
  }
}

// 验证身份证号
const validateIdNumber = () => {
  const idNumberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!idNumberReg.test(form.value.idNumber)) {
    ElMessage.error('请输入正确的身份证号')
    form.value.idNumber = ''
  }
}

// 验证手机号
const validatePhoneNumber = () => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(form.value.phoneNumber)) {
    ElMessage.error('请输入正确的手机号')
    form.value.phoneNumber = ''
  }
}

// 验证工号
const validateNotifierNumber = () => {
  const notifierNumberReg = /^\d{12}$/
  if (!notifierNumberReg.test(form.value.notifierNumber)) {
    ElMessage.error('请输入12位数字工号')
    form.value.notifierNumber = ''
  }
}

// 处理随行人数变更
const handleAccompaningCountChange = (value) => {
  const currentLength = form.value.accompaningPersons.length
  if (value > currentLength) {
    // 添加新的随行人员
    for (let i = currentLength; i < value; i++) {
      form.value.accompaningPersons.push({
        name: '',
        idNumber: '',
        phoneNumber: ''
      })
    }
  } else if (value < currentLength) {
    // 移除多余的随行人员
    form.value.accompaningPersons.splice(value)
  }
  console.log('随行人员数组:', form.value.accompaningPersons)
}

// 验证随行人员身份证号
const validateAccompaningIdNumber = (e, index) => {
  const idNumberReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!idNumberReg.test(form.value.accompaningPersons[index].idNumber)) {
    ElMessage.error(`随行人员 ${index + 1} 的身份证号格式不正确`)
    form.value.accompaningPersons[index].idNumber = ''
  }
}

// 验证随行人员手机号
const validateAccompaningPhoneNumber = (e, index) => {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!phoneReg.test(form.value.accompaningPersons[index].phoneNumber)) {
    ElMessage.error(`随行人员 ${index + 1} 的手机号格式不正确`)
    form.value.accompaningPersons[index].phoneNumber = ''
  }
}

// 计算是否需要结束日期
const needsEndDate = computed(() => {
  return ['twoDays', 'threeDays'].includes(form.value.workingTime)
})

// 处理作业时间变更
const handleWorkingTimeChange = () => {
  // 如果不需要结束日期，清空结束日期并触发验证
  if (!needsEndDate.value) {
    form.value.endDate = ''
    formRef.value?.clearValidate(['endDate'])
  }
}

// 验证日期范围
const validateDateRange = () => {
  // 如果不需要结束日期，直接返回
  if (!needsEndDate.value) {
    return
  }
  
  if (!form.value.startDate || !form.value.endDate) return
  
  const start = new Date(form.value.startDate)
  const end = new Date(form.value.endDate)
  const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1
  
  if (form.value.workingTime === 'twoDays' && daysDiff !== 2) {
    ElMessage.error('两天作业必须选择相邻的两天')
    form.value.endDate = ''
    return
  }
  
  if (form.value.workingTime === 'threeDays' && daysDiff !== 3) {
    ElMessage.error('三天作业必须选择连续的三天')
    form.value.endDate = ''
    return
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
  workingTime: [{ required: true, message: '请选择作业时间', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开工日期', trigger: 'change' }],
  workLocation: [{ required: true, message: '请选择作业地点', trigger: 'change' }],
  workType: [{ required: true, message: '请选择作业类型', trigger: 'change' }],
  workContent: [{ required: true, message: '请选择作业内容', trigger: 'change' }],
  
  // 通知人信息
  notifierName: [{ required: true, message: '请输入对接人姓名', trigger: 'blur' }],
  notifierDepartment: [{ required: true, message: '请输入所属部门', trigger: 'blur' }]
}

const formRef = ref(null)

// 修改表单验证函数
const validateForm = () => {
  // 基本信息验证
  if (!form.value.name?.trim()) throw new Error('请填写姓名')
  if (!form.value.idNumber?.trim()) throw new Error('请填写身份证号')
  if (!form.value.companyName?.trim()) throw new Error('请填写公司名称')
  if (!form.value.phoneNumber?.trim()) throw new Error('请填写联系电话')

  // 作业信息验证
  if (!form.value.workingTime) throw new Error('请选择作业时间')
  if (!form.value.startDate) throw new Error('请选择开工日期')
  
  // 只在选择两天或三天作业时验证完工日期
  if (['twoDays', 'threeDays'].includes(form.value.workingTime)) {
    if (!form.value.endDate) throw new Error('请选择完工日期')
  }
  
  if (!form.value.workLocation?.length) throw new Error('请选择作业地点')
  if (!form.value.workType?.trim()) throw new Error('请选择作业类型')
  if (!form.value.workContent?.trim()) throw new Error('请选择作业内容')

  // 产品类作业验证
  if (form.value.isProductWork) {
    if (!form.value.projectName?.trim()) throw new Error('请填写项目名称')
    if (!form.value.vehicleNumber?.trim()) throw new Error('请填写车号')
    if (!form.value.trackPosition?.trim()) throw new Error('请填写车道/台位')
  }

  // 质量返工验证
  if (form.value.workType === '质量返工') {
    if (!form.value.workBasis?.trim()) throw new Error('请选择作业依据')
    if (!form.value.basisNumber?.trim()) throw new Error('请填写编号')
  }

  // 通知人信息验证
  if (!form.value.notifierName?.trim()) throw new Error('请填写对接人姓名')
  if (!form.value.notifierDepartment?.trim()) throw new Error('请填写所属部门')

  // 随行人员验证
  if (form.value.accompaningCount > 0) {
    if (!form.value.accompaningPersons?.length) {
      throw new Error('请添加随行人员信息')
    }
    form.value.accompaningPersons.forEach((person, index) => {
      if (!person.name?.trim()) throw new Error(`请填写随行人员${index + 1}的姓名`)
      if (!person.idNumber?.trim()) throw new Error(`请填写随行人员${index + 1}的身份证号`)
      if (!person.phoneNumber?.trim()) throw new Error(`请填写随行人员${index + 1}的联系电话`)
    })
  }
}

// 修改提交处理函数
const handleSubmit = async () => {
  try {
    // 如果不是两天或三天作业，清空完工日期
    if (!['twoDays', 'threeDays'].includes(form.value.workingTime)) {
      form.value.endDate = ''
    }
    
    // 进行表单验证
    const valid = await formRef.value.validate()
    if (!valid) {
      throw new Error('表单验证失败')
    }
    
    // 进行自定义验证
    validateForm()
    
    // 准备提交数据
    const submitData = {
      ...form.value,
      userId: store.userInfo?.wxId,
      // 确保 workLocation 是数组
      workLocation: Array.isArray(form.value.workLocation) ? form.value.workLocation : []
    }
    
    // 提交申请
    const result = await store.submitApplication(submitData)
    
    // 提交成功后跳转
    router.push({
      path: '/success',
      query: { applicationNumber: result.applicationNumber }
    })
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
  }
}

// 监听表单数据变化
watch(form, (newValue) => {
  console.log('表单数据变化:', newValue)
  // 确保必填字段有值
  const formData = {
    ...newValue,
    workLocation: newValue.workLocation || [],
    workType: newValue.workType || '',
    workContent: newValue.workContent || '',
    notifierName: newValue.notifierName || '',
    notifierNumber: newValue.notifierNumber || '',
    notifierDepartment: newValue.notifierDepartment || '',
    notifierPhone: newValue.notifierPhone || ''
  }
  store.setApplicationForm(formData)
}, { deep: true })

// 获取上次申请记录
const getLastApplication = () => {
  try {
    const userId = store.userInfo?.wxId
    if (!userId) {
      console.warn('未获取到用户ID')
      return
    }

    const lastRecord = store.getLastUserApplication(userId)
    if (lastRecord) {
      console.log('获取到的上次申请记录:', lastRecord)
      
      // 填充表单数据，但不包括时间相关字段
      form.value = {
        // 基本信息
        name: lastRecord.name || '',
        idNumber: lastRecord.idNumber || '',
        companyName: lastRecord.companyName || '',
        phoneNumber: lastRecord.phoneNumber || '',
        
        // 作业信息
        workingTime: '', // 清空作业时间
        startDate: '', // 清空开始日期
        endDate: '', // 清空结束日期
        isProductWork: lastRecord.isProductWork || false,
        projectName: lastRecord.projectName || '',
        vehicleNumber: lastRecord.vehicleNumber || '',
        workLocation: Array.isArray(lastRecord.workLocation) ? 
          [...lastRecord.workLocation] : [],
        trackPosition: lastRecord.trackPosition || '',
        workType: lastRecord.workType || '',
        workContent: lastRecord.workContent || '',
        workBasis: lastRecord.workBasis || '',
        basisNumber: lastRecord.basisNumber || '',
        
        // 危险作业信息
        dangerTypes: Array.isArray(lastRecord.dangerTypes) ? 
          [...lastRecord.dangerTypes] : [],
        isDangerousWork: lastRecord.isDangerousWork || false,
        
        // 通知人信息
        notifierName: lastRecord.notifierName || '',
        notifierNumber: lastRecord.notifierNumber || '',
        notifierDepartment: lastRecord.notifierDepartment || '',
        notifierPhone: lastRecord.notifierPhone || '',
        
        // 随行人员信息
        accompaningCount: lastRecord.accompaningCount || 0,
        accompaningPersons: Array.isArray(lastRecord.accompaningPersons) ? 
          lastRecord.accompaningPersons.map(person => ({
            name: person.name || '',
            idNumber: person.idNumber || '',
            phoneNumber: person.phoneNumber || ''
          })) : []
      }

      // 确保随行人员数组长度与计数一致
      if (form.value.accompaningCount > 0 && form.value.accompaningPersons.length === 0) {
        // 如果有计数但没有数据，创建空对象
        for (let i = 0; i < form.value.accompaningCount; i++) {
          form.value.accompaningPersons.push({
            name: '',
            idNumber: '',
            phoneNumber: ''
          })
        }
      }
      
      console.log('填充后的表单数据:', form.value)
      ElMessage.success('已自动填充您的上次申请信息')
    }
  } catch (error) {
    console.error('获取上次申请记录失败:', error)
  }
}

// 从 store 加载数据
onMounted(() => {
  const storeForm = store.applicationForm
  if (storeForm) {
    Object.keys(form.value).forEach(key => {
      if (storeForm[key] !== undefined) {
        form.value[key] = storeForm[key]
      }
    })
  }
})

onMounted(async () => {
  try {
    const userInfo = await getWechatUserInfo()
    if (!userInfo || !userInfo.wxId) {
      throw new Error('未获取到用户信息')
    }
    store.setUserInfo(userInfo)
    // 加载历史记录
    await store.loadHistoricalRecord()
    // 获取并填充上次申请记录
    getLastApplication()
  } catch (error) {
    console.error('初始化失败:', error)
    ElMessage({
      message: '获取用户信息失败，使用测试模式继续',
      type: 'warning',
      duration: 3000
    })
    // 使用测试数据继续
    store.setUserInfo({
      wxId: 'test_user',
      nickname: '测试用户',
      avatar: ''
    })
  }
})

// 添加日期禁用函数
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用今天之前的日期
}

// 添加结束日期禁用函数
const disabledEndDate = (time) => {
  if (!form.value.startDate) return true
  const startTime = new Date(form.value.startDate).getTime()
  return time.getTime() < startTime // 禁用开始日期之前的日期
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

.form-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.el-input, .el-select, .el-date-picker {
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

/* 确保日期选择器和其他输入框宽度一致 */
:deep(.el-date-picker) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-picker {
  flex: 1;
}

.date-separator {
  color: #909399;
  font-size: 16px;
  padding: 0 4px;
}
</style>
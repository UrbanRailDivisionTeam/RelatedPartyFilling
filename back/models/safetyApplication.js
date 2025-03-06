const mongoose = require('mongoose')

const safetyApplicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  applicationNumber: {
    type: String,
    required: true,
    unique: true
  },
  submitTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['审核中', '已通过', '已拒绝'],
    default: '审核中'
  },
  // 基本信息
  name: String,
  idNumber: String,
  companyName: String,
  phoneNumber: String,
  
  // 作业信息
  workingTime: [String],
  startDate: Date,
  endDate: Date,
  isProductWork: Boolean,
  projectName: String,
  vehicleNumber: String,
  workLocation: {
    type: [String],
    required: true
  },
  trackPosition: String,
  workType: String,
  workContent: String,
  workBasis: String,
  basisNumber: String,
  
  // 危险作业信息
  dangerTypes: [String],
  isDangerousWork: Boolean,
  
  // 通知人信息
  notifierName: String,
  notifierNumber: String,
  notifierDepartment: String,
  
  // 随行人员信息
  accompaningCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// 添加虚拟字段关联随行人员
safetyApplicationSchema.virtual('accompaningPersons', {
  ref: 'AccompanyingPerson',
  localField: '_id',
  foreignField: 'applicationId'
})

module.exports = mongoose.model('SafetyApplication', safetyApplicationSchema) 
const mongoose = require('mongoose')

const accompanyingPersonSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SafetyApplication',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('AccompanyingPerson', accompanyingPersonSchema) 
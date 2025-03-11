import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('counter', () => {
  const userId = ref(null)
  const from = ref({
    applicationForm: {
      name: '',
      idNumber: '',
      companyName: '',
      phoneNumber: '',

      workingTime: [],
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

      dangerTypes: [],
      isDangerousWork: false,

      notifierName: '',
      notifierNumber: '',
      notifierDepartment: '',

      accompaningCount: 0,
      accompaningPersons: []
    },
    historicalRecords: []
  })

  return { userId, from }
})

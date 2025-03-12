import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('counter', () => {
  const userId = ref(null)
  const applicationForm = ref({
    applicationNumber: '',
    name: '',
    idNumber: '',
    companyName: '',
    phoneNumber: '',

    submitTime: '',
    startDate: '',
    startTime: '',
    workingHours: '',
    workLocation: [],
    workType: '',

    isProductWork: false,
    projectName: '',
    vehicleNumber: '',
    trackPosition: '',

    workContent: '',
    workBasis: '',
    basisNumber: '',

    isDangerousWork: false,
    dangerTypes: [],

    notifierName: '',
    notifierNumber: '',
    notifierDepartment: '',

    accompaningCount: 0,
    accompaningPersons: []
  })
  const historicalRecords = ref([])
  return { userId, applicationForm, historicalRecords }
})

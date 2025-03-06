import { createRouter, createWebHistory } from 'vue-router'
import { isWechatBrowser } from '@/utils/wechat'
import { ElMessage } from 'element-plus'
import { useSafetyApplicationStore } from '@/stores/safetyApplication'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/WechatAuth.vue'),
      meta: { title: '微信授权' }
    },
    {
      path: '/apply',
      name: 'apply',
      component: () => import('../views/ApplyView.vue'),
      meta: { title: '新建申请' }
    },
    {
      path: '/success',
      name: 'success',
      component: () => import('../views/SuccessView.vue'),
      meta: { title: '提交成功' }
    },
    {
      path: '/records',
      name: 'records',
      component: () => import('../views/RecordsView.vue'),
      meta: { title: '申请记录' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 安全作业申请系统` : '安全作业申请系统'
  
  // 首页不需要检查微信环境
  if (to.path === '/') {
    next()
    return
  }

  // 检查是否在微信环境中
  if (!isWechatBrowser()) {
    ElMessage.error('请在微信客户端打开链接')
    next('/')
    return
  }
  
  // 检查是否需要微信授权
  const store = useSafetyApplicationStore()
  const userInfo = store.getUserInfo()
  
  if (!userInfo && to.path !== '/auth') {
    next('/auth')
  } else {
    next()
  }
})

export default router

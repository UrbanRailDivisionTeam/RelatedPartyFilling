import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/counter';
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '主页' }
    },
    {
      path: '/scan',
      name: 'scan',
      component: () => import('../views/ScanCodeView.vue'),
      meta: { title: '扫码页面' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: '登陆页面' }
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
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 安全作业申请系统` : '安全作业申请系统'

  const store = useAppStore()
  // 检查是否在微信环境中
  if (store.userId === null && to.path === '/records') {
    ElMessage.error('需要登录后才能查询历史提交')
    next('/login')
    return
  }

  // 其他的跳转路径检查
  if (from.path !== '/apply' && to.path === '/success') {
    ElMessage.error('非法访问')
    next('/')
    return
  }

  // 已经登陆后重新登录
  if (store.userId !== null && to.path === '/login') {
    ElMessage.warning('目前已是登陆状态，再次登录会覆盖上次登录')
  }

  next()
})

export default router

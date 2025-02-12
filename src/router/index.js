import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'
// 配路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },

    {
      path: '/', component: () => import('@/views/layout/LayoutPage.vue'),
      redirect: '/home',
      children: [

        {
          path: '/category',
          component: () => import('@/views/layout/CategoryPage.vue')
        },
        {
          path: '/home',
          component: () => import('@/views/layout/HomePage.vue')
        },
        {
          path: '/cart',
          component: () => import('@/views/layout/CartPage.vue')
        },
        {
          path: '/user',
          component: () => import('@/views/layout/UserPage.vue')
        },
      ],
    },
    { path: '/prodetail/:id', component: () => import('@/views/prodetail/ProdetailPage.vue') },
    { path: '/myorder', component: () => import('@/views/myorder/MyOrderPage.vue') },
    { path: '/pay', component: () => import('@/views/pay/PayPage.vue') },
    { path: '/search', component: () => import('@/views/search/SearchPage.vue') },
    { path: '/searchlist', component: () => import('@/views/search/SearchListPage.vue') },
    { path: '/service', component: () => import('@/views/service/ServicePage.vue') },
  ]
})

// 导航守卫
const authUrls = ['/myorder', '/pay', '/user']
router.beforeEach((to) => {
  // 获取token
  const useStore = useUserStore()
  const token = useStore.token
  // 判断是否权限页面
  if (!authUrls.includes(to.path)) {
    return
  }
  else {

    if (!token && to.path !== '/login') {
      return '/login'
    }
  }
})
export default router
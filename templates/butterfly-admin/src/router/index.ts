import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: $BF.env('BF_ROUTER_TYPE') === 'web-history' ? createWebHistory($BF.env('BF_ROUTER_BASE')) : createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('@/pages/home/index.vue')
    }
  ]
})

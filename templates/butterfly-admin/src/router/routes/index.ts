import type { RouteRecordRaw } from 'vue-router'
import demoRoutes from './demo'
import { RoutePath } from '@/common/enums'

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: RoutePath.About.path,
    name: RoutePath.About.name,
    meta: {
      isMenu: true,
      authKey: 'About',
      title: '关于',
      icon: 'svg:about'
    },
    component: () => import('@/pages/home/index.vue')
  }
]

export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: RoutePath.Home.path,
    component: () => import('@/layouts/index.vue'),
    children: [
      {
        path: RoutePath.Home.path,
        name: RoutePath.Home.name,
        meta: { isMenu: true, title: '首页', icon: 'svg:home' },
        component: () => import('@/pages/home/index.vue')
      }
    ]
  },
  ...demoRoutes,
  {
    path: RoutePath.Login.path,
    name: RoutePath.Login.name,
    component: () => import('@/pages/auth/index.vue')
  }
]

import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: '/demo',
    name: 'Demo',
    meta: { isMenu: true, title: 'demo演示', icon: 'svg:home' },
    redirect: '/demo/transitionDemo',
    children: [
      {
        path: '/demo/transitionDemo',
        name: 'TransitionDemo',
        component: () => import('@/pages/demo/directives/transitionDemo.vue')
      },
      {
        path: '/demo/colors',
        name: 'Colors',
        component: () => import('@/pages/demo/colors/index.vue')
      }
    ]
  }
] as RouteRecordRaw[]

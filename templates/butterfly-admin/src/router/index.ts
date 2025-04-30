import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { staticRoutes } from './routes'

export const router = createRouter({
  history: $BF.env('BF_ROUTER_TYPE') === 'web-history' ? createWebHistory($BF.env('BF_ROUTER_BASE')) : createWebHashHistory(),
  routes: staticRoutes
})

export const getRouter = () => {
  return router
}

export const loadAsyncRoutes = () => {}

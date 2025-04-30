import type { AuthKeyType, RouteNameKey, RoutePathKey } from '@/common/enums'
declare module 'vue-router' {
  export interface RouteMeta {
    authKey?: AuthKeyType
    // 是否菜单
    isMenu?: boolean
    // 上级菜单路由的path
    parentKey?: string
    // 菜单标题
    title?: string
    // 菜单图标
    icon?: string
    // 菜单排序
    sort?: number
    // 是否缓存
    keepAlive?: boolean
  }

  type OverridenRouteLocationRaw =
    | RoutePathKey
    | {
        path: RoutePathKey
        name?: RouteNameKey
        force?: boolean
        hash?: string
        query?: LocationQueryRaw
        params?: RouteParamsRawGeneric
        replace?: boolean
        state?: HistoryState
      }
  interface Router {
    push(location: OverridenRouteLocationRaw): Promise<NavigationFailure | void | undefined>
    replace(location: OverridenRouteLocationRaw): Promise<NavigationFailure | void | undefined>
  }
}

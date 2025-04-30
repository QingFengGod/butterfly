/// <reference types="vite/client" />

interface BFImportMetaEnv {
  readonly BF_MODE: 'development' | 'production'
  // 路由模式
  readonly BF_ROUTER_TYPE: 'web-history' | 'web-hash-history'
  // 路由和vite打包的前缀
  readonly BF_ROUTER_BASE: string
  // 前缀
  readonly BF_PREFIX: string
  // api基础地址
  readonly BF_API_BASEURL: string
  // api代理地址
  readonly BF_PROXY_URL: string
  // 文件访问地址前缀
  readonly BF_FILE_BASEURL: string
  // 是否启用权限
  readonly BF_PERMISSION_ENABLED: boolean
}
interface ImportMeta {
  readonly env: BFImportMetaEnv
}

declare module 'virtual:svg-icons-register'

import type { PermissionKeyType } from '@/common/enums'
import { request } from '@/common/request'
import { getRouter } from '@/router'
import { tryExec } from '@qingfeng-butterfly/utils'
import { defineStore } from 'pinia'

type User = {
  id: string
  name: string
  avatar?: string
}
interface PermissionStoreState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  permissions: Partial<Record<PermissionKeyType, boolean>>
}

export const usePermissionStore = defineStore('permission', {
  state: () => {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      permissions: {}
    } as PermissionStoreState
  },
  actions: {
    setTokens(tokens: { accessToken: string; refreshToken: string }) {
      this.accessToken = tokens.accessToken
      this.refreshToken = tokens.refreshToken
    },
    async refreshUserInfo() {
      const [result, error] = await tryExec(() =>
        request<User>({
          url: '/user/info',
          method: 'GET'
        })
      )
      if (error) {
        this.logout()
      }
      if (result) {
        this.user = result
      }
    },
    logout() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.permissions = {}
      getRouter().replace('/login')
    }
  },
  persist: {
    pick: ['user', 'accessToken', 'refreshToken', 'permissions']
  }
})

export const getToken = () => {
  const permissionStore = usePermissionStore()
  return permissionStore.accessToken
}

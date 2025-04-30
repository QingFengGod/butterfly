import type { PermissionKeyType } from '../enums'
import { usePermissionStore } from '@/store/permission.store'

export const usePermission = (() => {
  if (!$BF.env('BF_PERMISSION_ENABLED')) {
    return () => () => true
  }
  return () => {
    const permissionStore = usePermissionStore()
    function hasPermission(permission: PermissionKeyType): boolean
    function hasPermission(permission: PermissionKeyType[], type?: 'or' | 'and'): boolean
    function hasPermission(permission: PermissionKeyType | PermissionKeyType[], type: 'or' | 'and' = 'and'): boolean {
      if (!$BF.env('BF_PERMISSION_ENABLED')) return true
      if (Array.isArray(permission)) {
        if (type === 'or') {
          return permission.some((p) => permissionStore.permissions[p])
        }
        return permission.every((p) => permissionStore.permissions[p])
      }
      return permissionStore.permissions[permission] || false
    }
    return hasPermission
  }
})()

import { request } from '@/common/request'
import { trycatchWrap } from '@qingfeng-butterfly/utils'

export const loginReq = trycatchWrap((data: { username: string; password: string }) => {
  return request<{ accessToken: string; refreshToken: string }>({
    url: '/auth/login',
    method: 'POST',
    data
  })
})

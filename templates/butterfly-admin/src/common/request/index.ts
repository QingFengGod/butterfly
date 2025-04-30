import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import { createOnHttpErrorHandler, createOnResponseHandler, createShowErrorMsg, onRequestBefore } from './util'

const showErrorMsg = createShowErrorMsg()

const instance = axios.create({
  baseURL: $BF.env('BF_API_BASEURL')
})
instance.interceptors.request.use(onRequestBefore)
instance.interceptors.response.use(
  createOnResponseHandler({
    default: (response) => {
      showErrorMsg(response.data.message)
      return Promise.reject(response.data)
    },
    200: (response) => {
      return response.data
    }
  }),
  createOnHttpErrorHandler({
    default: (error) => {
      if (error.response) {
        let msg = error.response.statusText
        if (error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
          msg = error.response.data.message as string
        }
        showErrorMsg(msg)
      }
    },
    401: () => {
      showErrorMsg('登录会话过期，请重新登录')
    }
  })
)

export async function request<Res>(config: AxiosRequestConfig & { alertErrorMsg?: boolean }): Promise<Res> {
  return instance
    .request(config)
    .then((res) => {
      return res.data
    })
    .catch((error) => {
      if (config.alertErrorMsg === false) {
        showErrorMsg(error.message)
      }
      return Promise.reject(error)
    })
}
export function downloadFile<T>(url: string, config: AxiosRequestConfig): Promise<T> {
  return instance.get(url, config)
}

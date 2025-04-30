import { getToken } from '@/store'
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const createShowErrorMsg = () => {
  let lastErrorMsg = '',
    lastTime = Date.now()
  return (msg: string) => {
    if (lastErrorMsg === msg && Date.now() - lastTime < 3000) {
      return
    }
    lastErrorMsg = msg
    lastTime = Date.now()
    $UI.msg.error(msg)
  }
}

export const onRequestBefore = (config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

export const createOnHttpErrorHandler = (handlerMap: Record<number | 'default', (error: AxiosError) => void>) => {
  return (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response
      if (handlerMap[status]) {
        handlerMap[status](error)
      } else if (handlerMap['default']) {
        handlerMap['default'](error)
      }
    }
    return Promise.reject(error)
  }
}

export const createOnResponseHandler = (
  codeHandlerMap: Record<number | 'default' | `${number}`, (response: AxiosResponse) => any>
) => {
  return (response: AxiosResponse) => {
    if (response.data && typeof response.data === 'object') {
      const { code } = response.data
      if (codeHandlerMap[code]) {
        return codeHandlerMap[code](response)
      } else if (codeHandlerMap['default']) {
        return codeHandlerMap['default'](response)
      }
    }
    return response
  }
}

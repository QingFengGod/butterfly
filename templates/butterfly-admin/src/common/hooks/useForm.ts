import type { FormInst, FormItemRule, FormValidationError } from 'naive-ui'
import { isObject } from '@qingfeng-butterfly/utils'
import { ref, useTemplateRef } from 'vue'

export interface UseFormOptions<T extends Record<string, any>> {
  data?: Partial<T>
  rules?: Partial<Record<keyof T, FormItemRule | FormItemRule[]>>
  templateRef?: string
}

export const useForm = <T extends Record<string, any>>(options: UseFormOptions<T> = {}) => {
  const { data = {}, rules = {}, templateRef } = options
  const formRef = useTemplateRef<FormInst>(templateRef || 'formRef')
  const state = ref<T>({ ...data } as T)
  const validate = async () => {
    return new Promise<FormValidationError[] | undefined>((resolve) => {
      if (!formRef.value) return
      formRef.value.validate((errors) => {
        if (errors) {
          resolve(errors)
        } else {
          resolve(undefined)
        }
      })
    })
  }

  const reset = () => {
    if (!formRef.value) return
    state.value = { ...data }
  }

  const resetValidate = () => {
    if (!formRef.value) return
    formRef.value.restoreValidation()
  }

  function set(data: Partial<T>): void
  function set<Key extends keyof T>(key: Key, value: T[Key]): void
  function set(key: any, value?: any): void {
    if (typeof key === 'string') {
      state.value[key] = value
    } else if (isObject(key)) {
      state.value = { ...key }
    }
  }

  function get(): T
  function get<Key extends keyof T>(key: Key): T[Key]
  function get<Key extends keyof T>(key?: Key): T[Key] | T {
    return key ? state.value[key] : state.value
  }

  return [state, rules, { validate, reset, resetValidate, set, get }, formRef] as const
}

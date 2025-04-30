import type { InputProps, FormProps, GridProps, FormItemRule, FormInst } from 'naive-ui'
import type { Adapter } from './createUseForm'
import type { VNode } from 'vue'
import { computed, defineComponent, h, ref, resolveComponent, resolveDirective, useTemplateRef, withDirectives } from 'vue'
import { randomString } from '@qingfeng-butterfly/utils'

type BaseSchema = {
  path: string
  label?: string
  span?: number
  offset?: number
  show?: (data: any) => any
  if?: (data: any) => any
}

type InputSchema = BaseSchema & {
  type: 'input'
  props?: InputProps
}

export const naiveUiAdapter = () => {
  const adapter: Adapter<{
    formType: FormProps
    ruleType: FormItemRule
    gridType: GridProps
    inputType: InputSchema
  }> = {
    createComponent: (config, api) => {
      const formComponent = resolveComponent('NForm')
      const formItemGiComponent = resolveComponent('NFormItemGi')
      const gridComponent = resolveComponent('NGrid')
      const renderMap: Record<'input', (schema: InputSchema, data: any, api: any) => VNode> = {
        input: (schema, value, api) =>
          h(resolveComponent('NInput'), {
            placeholder: `请输入${schema.label}`,
            clearable: true,
            ...schema.props,
            value: value,
            onUpdateValue: (value: any) => api.set(schema.path, value)
          })
      }
      const Comp = defineComponent({
        setup(_, { expose }) {
          const { formConfig, gridConfig, schema, data } = config
          const formRef = useTemplateRef<FormInst>('formRef')
          const formData = ref<Record<string, any>>({})

          // const showSchema = computed(() => {
          //   return schema.filter((item) => {
          //     if (item.if && typeof item.if === 'function') {
          //       return item.if(formData.value)
          //     }
          //     if (item.show && typeof item.show === 'function') {
          //       return item.show(formData.value)
          //     }
          //     return true
          //   })
          // })

          function set(newData: any): void
          function set(key: string, value: any): void
          function set(key: string | any, value?: any) {
            if (typeof key === 'object') {
              formData.value = key
            } else {
              formData.value[key] = value
            }
          }

          function get(): any
          function get(key: string): any
          function get(key?: string) {
            if (key) {
              return formData.value[key]
            }
            return { ...formData.value }
          }
          api.set = set
          api.get = get
          api.validate = () => {
            return new Promise((resolve) => {
              formRef.value!.validate((errors) => {
                if (errors) {
                  resolve(errors)
                } else {
                  resolve(true)
                }
              })
            })
          }
          api.resetData = () => {
            formData.value = { ...data }
          }
          api.resetValidate = () => {
            formRef.value?.restoreValidation()
          }

          expose({
            api
          })
          return () =>
            h(
              formComponent,
              { ref: 'formRef', labelAlign: 'left', labelPlacement: 'left', ...formConfig },
              {
                default: () =>
                  h(
                    gridComponent,
                    { cols: 24, ...gridConfig },
                    {
                      default: () => {
                        return schema.map((item) => {
                          const vNode = h(
                            formItemGiComponent,
                            {
                              span: item.span || 24,
                              offset: item.offset || 0,
                              label: item.label,
                              path: item.path
                            },
                            { default: () => renderMap[item.type](item, formData.value[item.path], api) }
                          )
                          if (typeof item.show === 'function') {
                            return item.show(formData.value) ? vNode : undefined
                          }
                          return vNode
                        })
                      }
                    }
                  )
              }
            )
        }
      })
      return Comp
    }
  }

  return adapter
}

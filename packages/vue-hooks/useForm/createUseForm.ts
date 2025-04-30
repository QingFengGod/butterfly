import type { Component } from 'vue'

export type SchemaTypeKeys = 'formType' | 'ruleType' | 'gridType' | 'inputType'
// | 'inputNumber'
// | 'textarea'
// | 'select'
// | 'radioGroup'
// | 'checkboxGroup'
// | 'datePicker'
// | 'timePicker'
// | 'upload'
// | 'slot'

export interface Adapter<SchemaType extends Record<SchemaTypeKeys, any>> {
  createComponent: (config: UseFormOptions<SchemaType, any>, api: UseFormApi<any>) => Component
}

export type CreateUseFormOptions<SchemaType extends Record<SchemaTypeKeys, any>> = {
  adapter: Adapter<SchemaType>
}

interface UseFormApi<Data extends Record<string, any>> {
  set(data: NullPartial<Data>): void
  set(key: keyof Data, value: Data[keyof Data]): void
  get(): Data
  get(key: keyof Data): Data[keyof Data]
  validate(): Promise<true | any[]>
  resetData(): void
  resetValidate(): void
}

interface UseFormOptions<SchemaType extends Record<SchemaTypeKeys, any>, Data extends Record<string, any>> {
  formConfig?: Partial<SchemaType['formType']>
  gridConfig?: Partial<SchemaType['gridType']>
  data?: NullPartial<Data>
  schema: Array<SchemaType[keyof Omit<SchemaType, 'formType' | 'ruleType' | 'gridType'>]>
  rules?: Partial<Record<keyof Data, Array<SchemaType['ruleType']> | SchemaType['ruleType']>>
}

export const createUseForm = <SchemaType extends Record<SchemaTypeKeys, any>>(options: CreateUseFormOptions<SchemaType>) => {
  const { adapter } = options
  return <Data extends Record<string, any>>(config: UseFormOptions<SchemaType, Data>) => {
    let api: UseFormApi<Data> = {} as any

    const Comp = adapter.createComponent(config, api)

    return [Comp, api] as const
  }
}

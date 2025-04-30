import { createUseForm } from './createUseForm'
import { naiveUiAdapter } from './adapter'

export const useForm = createUseForm({
  adapter: naiveUiAdapter()
})

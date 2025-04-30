import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
export * from './config.store'
export * from './permission.store'
export * from './menu.store'

const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: (id) => `${id}`,
    storage: $BF.storage as any
  })
)
export { pinia }

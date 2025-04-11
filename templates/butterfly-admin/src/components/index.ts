import { create, NFlex } from 'naive-ui'
import type { App } from 'vue'
import Title from './title/index.vue'
import ConfigProvider from './ConfigProvider/index.vue'

export const registerComponents = (app: App) => {
  const naiveUi = create({
    components: [NFlex]
  })
  app.use(naiveUi)
  app.component(Title.name!, Title)
}

export { Title, ConfigProvider }

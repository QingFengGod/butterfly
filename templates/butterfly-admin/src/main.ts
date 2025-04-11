import 'uno.css'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import '@/assets/css/global.css'
import './common/globalApi'
import App from './App.vue'
import { pinia } from './store'
import { registerComponents } from './components'
import { router } from './router'
const bootstrap = () => {
  const app = createApp(App)
  registerComponents(app)
  app.use(router)
  app.use(pinia)
  app.mount('#app')
}

bootstrap()

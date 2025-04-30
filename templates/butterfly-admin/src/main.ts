import 'uno.css'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import '@/assets/css/global.css'
import './common/globalApi'
import App from './App.vue'
import { pinia } from './store'
import { butterflyComponents, NaiveUI } from './components'
import { router } from './router'
import { butterflyDirectives } from './common/directives'

const bootstrap = () => {
  const app = createApp(App)
  app.use(NaiveUI).use(butterflyComponents()).use(butterflyDirectives()).use(router).use(pinia).mount('#app')
}

bootstrap()

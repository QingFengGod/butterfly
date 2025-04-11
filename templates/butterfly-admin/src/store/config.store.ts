import { defineStore } from 'pinia'
import { themeConfig } from '@/config'
import { toSnakeCaseName } from '@qingfeng-butterfly/utils'
import type { ThemeConfig } from '@/config'

type ConfigStoreState = {
  themeMode: 'light' | 'dark'
  pageTranstaionClassName: 'slide-left' | 'slide-right'
  light: ThemeConfig
  dark: ThemeConfig
}

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      themeMode: 'light',
      light: themeConfig.light,
      dark: themeConfig.dark
    } as ConfigStoreState
  },

  getters: {
    theme(state) {
      return state.themeMode === 'light' ? state.light : state.dark
    }
  },
  actions: {
    init() {
      this.changeTheme('light')
    },

    changeTheme(themeMode: 'light' | 'dark') {
      document.documentElement.classList.replace(this.themeMode, themeMode)
      this.themeMode = themeMode
      localStorage.setItem('theme', themeMode)
      let cssVarText = ''
      let key: keyof ThemeConfig
      for (key in this.theme) {
        const cssVarKey = toSnakeCaseName(key).replace(/_/g, '-')
        cssVarText += `--bf-${cssVarKey}: ${this.theme[key]};\n`
      }
      let styleEl = document.head.querySelector(`style[style-id="bf-admin-global"]`)
      if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.setAttribute('style-id', 'bf-admin-global')
        styleEl.textContent = `:root{${cssVarText}}`
        document.head.appendChild(styleEl)
      } else {
        styleEl.textContent = `:root{${cssVarText}}`
      }
      console.log(cssVarText)
    }
  }
})

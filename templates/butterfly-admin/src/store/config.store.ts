import type { ThemeConfig } from '@/theme'
import { defineStore } from 'pinia'
import { createStatusColor, theme } from '@/theme'
import { toSnakeCaseName } from '@qingfeng-butterfly/utils'
export type TogglePageClassName =
  | 'bf-offset-left'
  | 'bf-offset-right'
  | 'bf-offset-top'
  | 'bf-offset-bottom'
  | 'bf-fade'
  | 'bf-scale'

export type LayoutKeys = 'bf-classic' | 'bf-horizontal'

type ConfigStoreState = {
  appTitle: string
  layoutKey: LayoutKeys
  themeMode: 'light' | 'dark'
  togglePageClassName: TogglePageClassName
  light: ThemeConfig
  dark: ThemeConfig
  testArr: Array<{
    name: string
    age: number
  }>
}

export const useConfigStore = defineStore('config', {
  state: () => {
    return {
      appTitle: 'Butterfly Admin',
      layoutKey: 'bf-classic',
      themeMode: 'light',
      light: theme.light,
      dark: theme.dark,
      togglePageClassName: 'bf-fade'
    } as ConfigStoreState
  },

  getters: {
    theme(state) {
      return state.themeMode === 'light' ? state.light : state.dark
    }
  },
  actions: {
    init() {
      document.title = this.appTitle
      this.changeTheme('light')
    },

    changeTheme(themeMode?: 'light' | 'dark') {
      if (!themeMode) {
        themeMode = this.themeMode === 'light' ? 'dark' : 'light'
      }
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
        document.head.insertBefore(styleEl, document.head.firstChild)
      } else {
        styleEl.textContent = `:root{${cssVarText}}`
      }
    },

    updatePrimaryColor(color: string) {
      this.light.primaryColor = color
      this.dark.primaryColor = color
      const statusColors: any = createStatusColor('primary', color, true)
      for (let key in statusColors) {
        this.light[key as keyof ThemeConfig] = statusColors[key]
        this.dark[key as keyof ThemeConfig] = statusColors[key]
      }
      this.changeTheme(this.themeMode)
    }
  },
  persist: {
    pick: ['themeMode', 'togglePageClassName', 'layoutKey']
  }
})

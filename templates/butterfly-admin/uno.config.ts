import { defineConfig } from 'unocss'
import { presetWind3 } from '@unocss/preset-wind3'
import { presetIcons } from '@unocss/preset-icons'

export default defineConfig({
  presets: [presetWind3(), presetIcons()],
  theme: {
    primary: 'var(--bf-primary-color)',
    success: 'var(--bf-success-color)',
    warning: 'var(--bf-warning-color)',
    error: 'var(--bf-error-color)'
  },
  shortcuts: {
    'text-title-1': 'text-20px font-bold',
    'text-title-2': 'text-18px font-bold',
    'text-title-3': 'text-16px font-bold'
  },
  rules: []
})

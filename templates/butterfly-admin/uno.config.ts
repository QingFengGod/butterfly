import { defineConfig } from 'unocss'
import { presetWind3 } from '@unocss/preset-wind3'
import { presetIcons } from '@unocss/preset-icons'

export default defineConfig({
  presets: [presetWind3(), presetIcons()],
  theme: {
    colors: {
      primary: 'var(--bf-primary-color)',
      primaryDeep1: 'var(--bf-primary-color-deep-1)',
      primaryDeep2: 'var(--bf-primary-color-deep-2)',
      primaryDeep3: 'var(--bf-primary-color-deep-3)',
      primaryDeep4: 'var(--bf-primary-color-deep-4)',
      primaryDeep5: 'var(--bf-primary-color-deep-5)',
      success: 'var(--bf-success-color)',
      warning: 'var(--bf-warning-color)',
      error: 'var(--bf-error-color)',
      page: 'var(--bf-page-bg-color)',
      container: 'var(--bf-container-color)'
    }
  },
  shortcuts: {
    'text-title1': 'text-5rem font-bold',
    'text-title2': 'text-3.8rem font-bold',
    'text-title3': 'text-2.6rem font-bold',
    'text-title4': 'text-1.8rem font-bold',
    'text-title5': 'text-1.6rem font-bold',
    'text-desc': 'text-1.3rem text-gray-500 dark:text-gray-400',
    'flex-center': 'flex items-center justify-center'
  },
  rules: [
    [
      /^b-(x|y|l|r|t|b|all)-?(\d+|.*)-?(solid|dashed|dotted|.*)-?(.*)$/,
      ([, side, borderWidth, borderStyle, borderColor]) => {
        const value = `${borderWidth || 1}px ${borderStyle || 'solid'} ${borderColor || 'var(--bf-border-color)'};`
        if (side === 'x') return { 'border-left': value, 'border-right': value }
        if (side === 'y') return { 'border-top': value, 'border-bottom': value }
        if (side === 'l') return { 'border-left': value }
        if (side === 'r') return { 'border-right': value }
        if (side === 't') return { 'border-top': value }
        if (side === 'b') return { 'border-bottom': value }
        if (side === 'all') return { border: value }
      }
    ],
    [
      /^(w|h)-(sub|add|mul|div)-(.*)-(.*)$/,
      ([, sizeType, calcType, val1, val2]) => {
        const attr = sizeType === 'w' ? 'width' : 'height'
        if (calcType === 'sub') return { [attr]: `calc(${val1} - ${val2})` }
        if (calcType === 'add') return { [attr]: `calc(${val1} + ${val2})` }
        if (calcType === 'mul') return { [attr]: `calc(${val1} * ${val2})` }
        if (calcType === 'div') return { [attr]: `calc(${val1} / ${val2})` }
      }
    ],
    [/^scroll$/, () => '.scroll { overflow: auto; }'],
    [/^scroll-hide$/, () => '.scroll-hide::-webkit-scrollbar { display: none; }'],
    [/^scroll-hover-show$/, () => '.scroll-hover-show:hover::-webkit-scrollbar { display: block; }'],
    [/^scroll-show$/, () => '.scroll-show::-webkit-scrollbar { display: block; }']
  ]
})

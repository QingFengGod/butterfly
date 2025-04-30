import type { ObjectDirective } from 'vue'
import { createDirective } from './util'

export type CreateShineOptions = {
  defaultDuration?: number
  defaultEasing?: string
}

interface ShineParams {
  text?: boolean
  gradient?: string
  duration?: number
  easing?: 'ease-in-out' | 'linear'
}

export type ShineDirective = ObjectDirective<HTMLElement, ShineParams>
export const createShineDirective = createDirective('shine', (options: CreateShineOptions = {}) => {
  const { defaultDuration = 2000, defaultEasing = 'linear' } = options
  return {
    mounted(el, binding) {
      const { gradient, duration, easing, text = true } = binding.value || {}

      const width = 30

      el.style.backgroundImage = gradient || `linear-gradient(to right, #fff0, #fff, #fff0)`
      el.style.backgroundSize = `${width}% 100%`
      el.style.backgroundRepeat = 'no-repeat'
      el.style.backgroundPosition = `-${width * 2}% -${width * 2}%`
      if (text) {
        const color = getComputedStyle(el).color
        el.style.backgroundColor = color
        el.style.backgroundClip = 'text'
        el.style.webkitBackgroundClip = 'text'
        el.style.color = 'transparent'
      }

      el.animate(
        [
          { backgroundPosition: `-${width * 2}% -${width * 2}%` },
          { backgroundPosition: `-${width * 2}% -${width * 2}%` },
          { backgroundPosition: `${100 + width * 2}% ${100 + width * 2}%` }
        ],
        {
          duration: duration || defaultDuration,
          iterations: Infinity,
          easing: easing || defaultEasing
        }
      )
    }
  } as ShineDirective
})

import type { CSSProperties, ObjectDirective } from 'vue'
import { createDirective } from './util'
import { objOmit } from '@qingfeng-butterfly/utils'

export interface CreateAnimateOptions {
  defaultDuration?: number
  defaultEasing?: string
}

export interface AnimateItem extends KeyframeAnimationOptions {
  keyframes: Array<Keyframe & CSSProperties>
  controller?: (animation: Animation) => void
}

export type StringAnimateName = 'rotateX' | 'rotateY' | 'rotateZ'

type DAnimateParams = Array<AnimateItem> | AnimateItem | StringAnimateName

export type AnimateDirective = ObjectDirective<HTMLElement, DAnimateParams>
const animateMap: Record<StringAnimateName, AnimateItem> = {
  rotateX: {
    keyframes: [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(360deg)' }],
    duration: 2000,
    iterations: Infinity,
    easing: 'linear'
  },
  rotateY: {
    keyframes: [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(360deg)' }],
    duration: 2000,
    iterations: Infinity,
    easing: 'linear'
  },
  rotateZ: {
    keyframes: [{ transform: 'rotateZ(0deg)' }, { transform: 'rotateZ(360deg)' }],
    duration: 2000,
    iterations: Infinity,
    easing: 'linear'
  }
}

export const createAnimateDirective = createDirective('animate', (options: CreateAnimateOptions = {}) => {
  const { defaultDuration = 500, defaultEasing = 'ease-in-out' } = options
  return {
    beforeMount(el, binding) {
      if (typeof binding.value === 'string') {
        binding.value = animateMap[binding.value]
        if (!binding.value) {
          console.warn(`animate: ${binding.value} is not a valid animate name`)
          return
        }
      }
      const animateList = Array.isArray(binding.value) ? binding.value : [binding.value]
      animateList.forEach((item) => {
        const options = objOmit(item, 'keyframes', 'controller')
        options.duration = options.duration || defaultDuration
        options.easing = options.easing || defaultEasing
        const animation = el.animate(item.keyframes as any[], options)
        if (item.controller) {
          item.controller(animation)
        }
      })
    }
  } as AnimateDirective
})

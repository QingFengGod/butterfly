import type { CSSProperties, ObjectDirective, VNode } from 'vue'
import { createDirective } from './util'
import { objOmit } from '@qingfeng-butterfly/utils'

export type TransitionItem = KeyframeAnimationOptions & {
  enter: Array<CSSProperties & Keyframe>
  leave: Array<CSSProperties & Keyframe>
  controller?: (animation: Animation) => void
}

interface TransitionMap {
  fadeInOut: TransitionItem
  slideInOutLeft: TransitionItem
  slideInOutRight: TransitionItem
  slideInOutUp: TransitionItem
  slideInOutDown: TransitionItem
  scaleMaxInOut: TransitionItem
  scaleMinInOut: TransitionItem
}

export type StringTransition = keyof TransitionMap

export type DTransitionParams = TransitionItem | StringTransition

export type TransitionDirective = ObjectDirective<HTMLElement, DTransitionParams>

export interface CreateTransitionOptions {
  defaultDuration?: number
  defaultEasing?: string
}

export const createTransitionDirective = createDirective('transition', (options: CreateTransitionOptions = {}) => {
  const getVShowChangeType = (vnode: VNode): 'enter' | 'leave' | false => {
    if (!vnode.dirs) return false
    const vShowDir = vnode.dirs.find((dir: any) => dir.dir.name === 'show')
    if (!vShowDir) return false
    if (vShowDir.value === vShowDir.oldValue) return false
    return vShowDir.value ? 'enter' : 'leave'
  }

  const transitionMap: TransitionMap = {
    fadeInOut: {
      enter: [{ opacity: 0 }, { opacity: 1 }],
      leave: [{ opacity: 1 }, { opacity: 0 }]
    },
    slideInOutLeft: {
      enter: [
        { transform: 'translateX(-30%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ],
      leave: [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(-30%)', opacity: 0 }
      ]
    },
    slideInOutRight: {
      enter: [
        { transform: 'translateX(30%)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ],
      leave: [
        { transform: 'translateX(0)', opacity: 1 },
        { transform: 'translateX(30%)', opacity: 0 }
      ]
    },
    slideInOutUp: {
      enter: [
        { transform: 'translateY(-30%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      leave: [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-30%)', opacity: 0 }
      ]
    },
    slideInOutDown: {
      enter: [
        { transform: 'translateY(30%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      leave: [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(30%)', opacity: 0 }
      ]
    },
    scaleMaxInOut: {
      enter: [
        { transform: 'scale(1.5)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      leave: [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.5)', opacity: 0 }
      ]
    },
    scaleMinInOut: {
      enter: [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      leave: [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(0)', opacity: 0 }
      ]
    }
  }

  const { defaultDuration = 500, defaultEasing = 'ease-in-out' } = options

  return {
    beforeMount(el, binding) {
      if (typeof binding.value === 'string') {
        binding.value = transitionMap[binding.value as StringTransition] as TransitionItem
      }
      if (typeof binding.value === 'object') {
        const options = objOmit(binding.value, 'leave', 'enter', 'controller')
        options.duration = options.duration || defaultDuration
        options.easing = options.easing || defaultEasing
        const animation = el.animate(binding.value.enter as any[], options)
        if (binding.value.controller) {
          binding.value.controller(animation)
        }
      }
    },
    beforeUpdate(el, binding, vnode) {
      const changeType = getVShowChangeType(vnode)
      if (!changeType) return
      if (typeof binding.value === 'string') {
        binding.value = transitionMap[binding.value as StringTransition] as TransitionItem
      }
      if (typeof binding.value === 'object') {
        if (changeType === 'leave') {
          setTimeout(() => {
            el.style.display = ''
          }, 0)
        }
        const options = objOmit(binding.value, 'leave', 'enter', 'controller')
        options.duration = options.duration || defaultDuration
        options.easing = options.easing || defaultEasing
        const animation = el.animate(binding.value[changeType] as any[], options)
        animation.onfinish = () => {
          if (changeType === 'leave') {
            el.style.display = 'none'
          }
        }
        if (binding.value.controller) {
          binding.value.controller(animation)
        }
      }
    },
    beforeUnmount(el, binding) {
      const cloneEl = el.cloneNode(true) as HTMLElement
      el.parentElement!.replaceChild(cloneEl, el)
      if (typeof binding.value === 'string') {
        binding.value = transitionMap[binding.value as StringTransition] as TransitionItem
      }
      if (typeof binding.value === 'object') {
        const options = objOmit(binding.value, 'leave', 'enter', 'controller')
        options.duration = options.duration || defaultDuration
        options.easing = options.easing || defaultEasing
        const animation = cloneEl.animate(binding.value.leave as any[], options)
        animation.onfinish = () => {
          cloneEl.remove()
        }
        if (binding.value.controller) {
          binding.value.controller(animation)
        }
      }
    }
  } as TransitionDirective
})

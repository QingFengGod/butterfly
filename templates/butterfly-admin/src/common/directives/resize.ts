import { throttle } from '@qingfeng-butterfly/utils'
import type { Directive } from 'vue'
import { createDirective } from './util'

export type ResizeDirective = Directive<Element, DResizeFn>

export type DResizeSize = {
  contentBoxSize: { width: number; height: number }
  borderBoxSize: { width: number; height: number }
}

export type DResizeFn = (size: DResizeSize) => void

export interface CreateResizeOptions {
  throttleInterval?: number
}

export const createResizeDirective = createDirective('resize', (options: CreateResizeOptions = {}) => {
  const weakMap = new WeakMap<Element, DResizeFn>()
  const { throttleInterval = 380 } = options

  const resizeFn = throttle((entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
      const callback = weakMap.get(entry.target as Element)
      if (callback) {
        callback({
          contentBoxSize: {
            width: entry.borderBoxSize[0].inlineSize,
            height: entry.borderBoxSize[0].blockSize
          },
          borderBoxSize: {
            width: entry.borderBoxSize[0].inlineSize,
            height: entry.borderBoxSize[0].blockSize
          }
        })
      }
    })
  }, throttleInterval)

  const resizeObserver = new ResizeObserver(resizeFn)
  return {
    mounted(el, binding) {
      el.getBoundingClientRect()
      resizeObserver.observe(el)
      weakMap.set(el, binding.value)
    },
    beforeUnmount(el) {
      resizeObserver.unobserve(el)
      weakMap.delete(el)
    }
  } as ResizeDirective
})

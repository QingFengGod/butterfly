import type { Directive } from 'vue'

export const createDirective = <Func extends (...args: any[]) => Directive>(directiveName: string, fn: Func) => {
  return (...args: Parameters<Func>) => {
    return {
      directiveName,
      directive: fn(...args)
    }
  }
}

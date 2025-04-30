import type { ArrayLast, Fn, Includes, PickPromise, AsyncFn } from './util.type'
import { isAsyncFunction, isFunction } from './validator.util'
import { assert } from './common.util'

type TryCatchWrapReturn<T extends Fn> =
  ReturnType<T> extends void | never
    ? (...args: Parameters<T>) => [null, Error | null]
    : ReturnType<T> extends Promise<void | never>
      ? (...args: Parameters<T>) => Promise<[PickPromise<ReturnType<T>> | null, Error | null]>
      : ReturnType<T> extends Promise<any>
        ? (...args: Parameters<T>) => Promise<[PickPromise<ReturnType<T>> | null, Error | null]>
        : (...args: Parameters<T>) => [ReturnType<T> | null, Error | null]

/**
 * 捕获函数执行过程中的错误
 * @param {AnyFunction} fn 需要捕获的函数
 * @returns { TryCatchWrapReturn<T>} 返回一个函数, 函数返回 [result, error]
 * @example
 * const fn = trycatchWrap(async () => {
 *   return 1
 * })
 * const [result, error] = await fn()
 * // 如果函数执行过程中有错误, 则返回 [null, error]
 * // 如果函数执行过程中没有错误, 则返回 [result, null]
 */
export function trycatchWrap<T extends Fn>(fn: T): TryCatchWrapReturn<T> {
  const isAsync = isAsyncFunction(fn)
  if (isAsync) {
    return async function (...args: Parameters<T>) {
      try {
        const result = await fn.call(this, ...args)
        return [result, null]
      } catch (error: any) {
        return [null, error]
      }
    } as TryCatchWrapReturn<T>
  }
  return function (...args: Parameters<T>) {
    try {
      const result = fn.call(this, ...args)
      return [result, null]
    } catch (error: any) {
      return [null, error]
    }
  } as TryCatchWrapReturn<T>
}

/**
 * 执行函数并捕获错误
 * @param fn 需要执行的函数
 * @param args 函数的参数
 * @returns 返回一个函数, 函数返回 [result, error]
 * @example
 * const fn = tryExec(async () => {
 *   return 1
 * })
 * const [result, error] = await fn()
 */
export function tryExec<T extends Fn>(fn: T, ...args: Parameters<T>): ReturnType<TryCatchWrapReturn<T>> {
  return trycatchWrap(fn)(...args) as ReturnType<TryCatchWrapReturn<T>>
}

type DebounceFn = (...args: any[]) => any
type DebounceOptions = {
  maxWait?: number
  invokeType?: 'leading' | 'trailing'
}
interface DebounceReturn<T extends DebounceFn> {
  (...args: Parameters<T>): ReturnType<T> | undefined
  cancel: () => void
  flush: (...args: Parameters<T>) => ReturnType<T>
}
/**
 * 防抖
 * @param { DebounceFn } fn 函数
 * @param { number } wait 等待时间
 * @param { DebounceOptions } [options] 选项
 * @param { number } [options.maxWait] 最大等待时间
 * @param { 'leading' | 'trailing' } [options.invokeType = 'trailing'] 执行类型
 * @returns { DebounceReturn<T> } 防抖后的函数
 * @example
 * const fn = (a: number, label: string) => {
 *   console.log(`【${label}】`)
 *   return a
 * }
 * const debouncedFn = debounce(fn, 1000, { leading: true })
 * console.log(debouncedFn(1, 'call1'))  // 1
 * console.log(debouncedFn(2, 'call2'))  // 1
 * await sleep(1100)
 * console.log(debouncedFn(3, 'call3'))  // 3
 * await sleep(500)
 * console.log(debouncedFn(4, 'call4'))  // 3
 */
export function debounce<T extends DebounceFn>(fn: T, wait = 500, options: DebounceOptions = {}): DebounceReturn<T> {
  assert(typeof fn === 'function', 'fn must be a function')
  assert(typeof wait === 'number', 'wait must be a number')
  let { invokeType = 'trailing', maxWait } = options
  assert(
    ['leading', 'trailing'].includes(invokeType),
    `Expected options.invokeType to be 'leading' or 'trailing' but received a ${invokeType}`
  )
  let result: any // 函数执行结果
  let lastArgs: any = null // 最后一次参数
  let lastThis: any = null // 最后一次this
  let lastInvokeTime = 0 // 最后一次执行时间
  let timerId: Timer | undefined = undefined
  // 执行函数
  const invokeFn = () => {
    result = fn.apply(lastThis, lastArgs)
    lastArgs = null
    lastThis = null
    return result
  }

  // 是否执行函数
  const shouldInvoke = (time: number) => {
    if (maxWait && time - lastInvokeTime >= maxWait) {
      return true
    }
    if (time - lastInvokeTime >= wait) {
      return true
    }
    return false
  }

  const trailingInvoke = () => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      invokeFn()
    }, wait)
  }

  // 防抖函数
  function debounced(...args: any[]) {
    let time = Date.now()
    lastArgs = args
    lastThis = this as any
    if (shouldInvoke(time)) {
      invokeType === 'leading' ? invokeFn() : trailingInvoke()
    } else {
      invokeType === 'trailing' && trailingInvoke()
    }
    lastInvokeTime = time
    return result
  }
  debounced.flush = (...args: any[]) => {
    lastArgs = args
    return invokeFn()
  }

  debounced.cancel = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastArgs = lastThis = timerId = undefined
    lastInvokeTime = 0
  }

  return debounced as DebounceReturn<T>
}

type ThrottleFn = (...args: any[]) => any
type ThrottleOptions = {
  immediate?: boolean
}
interface ThrottleReturn<T extends ThrottleFn> {
  (...args: Parameters<T>): ReturnType<T>
  flush: (...args: Parameters<T>) => ReturnType<T>
}
/**
 * 节流
 */
export function throttle<T extends ThrottleFn>(
  fn: T,
  interval = 300,
  options: ThrottleOptions = {}
): ThrottleReturn<T> {
  assert(typeof fn === 'function', 'fn must be a function')
  assert(typeof interval === 'number', 'interval must be a number')
  let { immediate = true } = options
  let lastArgs: any = null
  let lastThis: any = null
  let lastInvokeTime = 0
  let result: any // 函数执行结果
  // 执行函数
  const invokeFn = () => {
    lastInvokeTime = Date.now()
    result = fn.apply(lastThis, lastArgs)
    lastArgs = null
    lastThis = null
    return result
  }
  // 节流函数
  function throttled(...args: any[]) {
    lastArgs = args
    lastThis = this as any
    if (immediate == false && lastInvokeTime == 0) lastInvokeTime = Date.now()
    if (Date.now() - lastInvokeTime >= interval) {
      return invokeFn()
    }

    return result
  }
  throttled.flush = (...args: any[]) => {
    lastArgs = args
    return invokeFn()
  }
  return throttled as ThrottleReturn<T>
}

export type ComposeFn<BeforeFn extends Fn> = (args: PickPromise<ReturnType<BeforeFn>>) => any
export type ComposeReturn<Fns extends Array<Fn>> =
  Includes<Fns, AsyncFn> extends true
    ? AsyncFn<Parameters<Fns[0]>, ReturnType<ArrayLast<Fns>>>
    : Fn<Parameters<Fns[0]>, ReturnType<ArrayLast<Fns>>>

/**
 * 组合函数
 * @param { ComposeFn<any>[] } fns 需要组合的函数
 * @returns { ComposeReturn<Fns> } 组合后的函数
 * @example
 * const fn1 = (a: number, b: number) => a + b
 * const fn2 = (reslut: number) => 'a + b = ' + reslut
 * const fn3 = (reslut: string) =>  `[${reslut}]`
 * const fn = compose(fn1, fn2, fn3)
 * console.log(fn(1, 2)) // '[a + b = 3]'
 */
export function compose<Fn1 extends Fn>(fn1: Fn1): ComposeReturn<[Fn1]>
export function compose<Fn1 extends Fn, Fn2 extends ComposeFn<Fn1>>(fn1: Fn1, fn2: Fn2): ComposeReturn<[Fn1, Fn2]>
export function compose<Fn1 extends Fn, Fn2 extends ComposeFn<Fn1>, Fn3 extends ComposeFn<Fn2>>(
  fn1: Fn1,
  fn2: Fn2,
  fn3: Fn3
): ComposeReturn<[Fn1, Fn2, Fn3]>
export function compose<
  Fn1 extends Fn,
  Fn2 extends ComposeFn<Fn1>,
  Fn3 extends ComposeFn<Fn2>,
  Fn4 extends ComposeFn<Fn3>
>(fn1: Fn1, fn2: Fn2, fn3: Fn3, fn4: Fn4): ComposeReturn<[Fn1, Fn2, Fn3, Fn4]>
export function compose<
  Fn1 extends Fn,
  Fn2 extends ComposeFn<Fn1>,
  Fn3 extends ComposeFn<Fn2>,
  Fn4 extends ComposeFn<Fn3>,
  Fn5 extends ComposeFn<Fn4>
>(fn1: Fn1, fn2: Fn2, fn3: Fn3, fn4: Fn4, fn5: Fn5): ComposeReturn<[Fn1, Fn2, Fn3, Fn4, Fn5]>
export function compose<
  Fn1 extends Fn,
  Fn2 extends ComposeFn<Fn1>,
  Fn3 extends ComposeFn<Fn2>,
  Fn4 extends ComposeFn<Fn3>,
  Fn5 extends ComposeFn<Fn4>,
  Fn6 extends ComposeFn<Fn5>
>(fn1: Fn1, fn2: Fn2, fn3: Fn3, fn4: Fn4, fn5: Fn5, fn6: Fn6): ComposeReturn<[Fn1, Fn2, Fn3, Fn4, Fn5, Fn6]>
export function compose<
  Fn1 extends Fn,
  Fn2 extends ComposeFn<Fn1>,
  Fn3 extends ComposeFn<Fn2>,
  Fn4 extends ComposeFn<Fn3>,
  Fn5 extends ComposeFn<Fn4>,
  Fn6 extends ComposeFn<Fn5>,
  Fn7 extends ComposeFn<Fn6>,
  Fn8 extends ComposeFn<Fn7>
>(
  fn1: Fn1,
  fn2: Fn2,
  fn3: Fn3,
  fn4: Fn4,
  fn5: Fn5,
  fn6: Fn6,
  fn7: Fn7,
  fn8: Fn8
): ComposeReturn<[Fn1, Fn2, Fn3, Fn4, Fn5, Fn6, Fn7, Fn8]>
export function compose<
  Fn1 extends Fn,
  Fn2 extends ComposeFn<Fn1>,
  Fn3 extends ComposeFn<Fn2>,
  Fn4 extends ComposeFn<Fn3>,
  Fn5 extends ComposeFn<Fn4>,
  Fn6 extends ComposeFn<Fn5>,
  Fn7 extends ComposeFn<Fn6>,
  Fn8 extends ComposeFn<Fn7>,
  Fn9 extends ComposeFn<Fn8>
>(
  fn1: Fn1,
  fn2: Fn2,
  fn3: Fn3,
  fn4: Fn4,
  fn5: Fn5,
  fn6: Fn6,
  fn7: Fn7,
  fn8: Fn8,
  fn9: Fn9
): ComposeReturn<[Fn1, Fn2, Fn3, Fn4, Fn5, Fn6, Fn7, Fn8, Fn9]>
export function compose(...fns: ComposeFn<any>[]) {
  const filterFns = fns.filter(isFunction)
  const hasAsyncFn = filterFns.some(isAsyncFunction)
  assert(filterFns.length > 0, 'fns is empty')
  if (hasAsyncFn) {
    return async (...args: any[]) => {
      const firstFn: any = filterFns.shift()
      let result: any = await firstFn(...args)
      for (const fn of filterFns) {
        result = await fn(result)
      }
      return result
    }
  }
  return (...args: any[]) => {
    const firstFn: any = filterFns.shift()
    let result: any = firstFn(...args)
    for (const fn of filterFns) {
      result = fn(result)
    }
    return result
  }
}

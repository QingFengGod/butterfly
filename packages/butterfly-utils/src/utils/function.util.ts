import type { Fn, PickPromise } from './util.type'
import { isAsyncFunction } from './validator.util'

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
        const result = await fn(...args)
        return [result, null]
      } catch (error: any) {
        return [null, error]
      }
    } as TryCatchWrapReturn<T>
  }
  return function (...args: Parameters<T>) {
    try {
      const result = fn(...args)
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

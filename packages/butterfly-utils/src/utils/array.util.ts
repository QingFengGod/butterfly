import type { Fn } from './util.type'
import { assert } from './assert.util'
import { isEqual } from './common.util'
import { isBaseType, isFunction, isUndefined } from './validator.util'

/**
 * 数组去重
 * @param {T[]} arr 需要去重的数组
 * @param {((val: T, val2: T) => boolean)} [compareFn] 比较函数
 * @returns {T[]} 去重后的数组
 */
export function uniqueArray<T>(arr: T[]): T[]
export function uniqueArray<T>(arr: T[], compareFn: Fn<[T, T], boolean>): T[]
export function uniqueArray<T>(arr: T[], compareFn?: Fn<[T, T], boolean>): T[] {
  if (!Array.isArray(arr)) {
    throw new Error('arr must be an array')
  }
  if (isUndefined(compareFn)) compareFn = isEqual
  assert(isFunction(compareFn), 'compareFn must be a function')
  const cache = new Map<any, boolean>()
  const result: any[] = [arr[0]]
  for (let i = 0; i < arr.length; i++) {
    if (isBaseType(arr[i]) && cache.has(arr[i])) {
      continue
    }
    for (let j = 0; j < result.length; j++) {
      if (compareFn(arr[i], result[j])) {
        break
      }
      if (j === result.length - 1) {
        result.push(arr[i])
        isBaseType(arr[i]) && cache.set(arr[i], true)
      }
    }
  }
  return result
}

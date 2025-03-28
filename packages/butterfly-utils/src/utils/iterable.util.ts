import { assert } from 'ts-essentials'
import type { Fn, ObjectKey, PickIterable } from './util.type'
import { isFunction, isIterable, isNumber, isString, isSymbol, isUndefined } from './validator.util'
import { getType } from './common.util'

type GroupKeyReturn<
  T extends Iterable<any>,
  GroupCallBack extends Fn<[PickIterable<T>], { key: ObjectKey; value: any }>
> =
  GroupCallBack extends Fn<[PickIterable<T>], { key: ObjectKey; value: infer Val }>
    ? Record<ObjectKey, Val[]>
    : Record<ObjectKey, any[]>
/**
 * 将可迭代对象分组
 * @param { Iterable<any> } iterable 可迭代对象
 * @param { GroupCallBack } [groupCallback] 获取需要分组的 key 和 value
 * @returns { GroupKeyReturn<T, GroupCallBack> } 分组后的对象
 * @example
 * const grouped = groupBy('122333')
 * const grouped1 = groupBy([1, 2, 3, 4, 5])
 * const grouped2 = groupBy([1, 2, 3, 4, 5], (val) => val % 2)
 * const map = new Map<string, number>()
 * map.set('a', 1)
 * map.set('b', 2)
 * map.set('c', 2)
 * map.set('d', 3)
 * map.set('e', 3)
 * map.set('f', 3)
 * const grouped3 = groupBy(map, ([key, value]) => ({ key: value, value: { key, value } }))
 */
export function groupBy<
  T extends Iterable<any>,
  GroupCallBack extends Fn<[PickIterable<T>], { key: ObjectKey; value: any }>
>(iterable: T, groupCallback?: GroupCallBack): GroupKeyReturn<T, GroupCallBack> {
  if (isUndefined(groupCallback)) {
    const defaultFn = (val: any) => ({ key: val, value: val })
    groupCallback = defaultFn as any
  }
  assert(isIterable(iterable), 'iterable must be an iterable')
  assert(isFunction(groupCallback), 'groupCallback must be a function')
  const result: any = {}
  for (const item of iterable) {
    const { key, value } = groupCallback(item)
    if (isString(key) || isNumber(key) || isSymbol(key)) {
      if (!result[key]) result[key] = []
      result[key].push(value)
    } else {
      console.warn(`groupKey must return a string, number or symbol, but got ${getType(key)}`)
    }
  }
  return result
}

/**
 * 统计可迭代对象中每个元素出现的次数
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], ObjectKey> } callback 获取统计的 key
 * @returns { Record<ObjectKey, number> } 统计后的对象
 * @example
 */
export function count<T extends Iterable<any>>(iterable: T, callback?: Fn<[PickIterable<T>], ObjectKey>) {
  assert(isIterable(iterable), 'iterable must be an iterable')
  if (isUndefined(callback)) {
    callback = (val: any) => val
  }
  assert(isFunction(callback), 'callback must be a function')
  const result: Record<ObjectKey, number> = {}
  for (const item of iterable) {
    const key = callback(item)
    if (isString(key) || isNumber(key) || isSymbol(key)) {
      if (!result[key]) result[key] = 0
      result[key]++
    } else {
      console.warn(`countKey must return a string, number or symbol, but got ${getType(key)}`)
    }
  }
  return result
}

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
 * 创建一个获取可迭代对象中的最小值或最大值的函数
 * @param initVal 初始值
 * @param compare 比较函数
 * @returns 获取最小值或最大值的函数
 */
const createMinormax = (initVal: number, compare: (item: number, initVal: number) => boolean) => {
  return <T extends Iterable<any>>(
    iterable: T,
    getNum: Fn<[PickIterable<T>], number> = (val: any) => Number(val)
  ): PickIterable<T> | null => {
    assert(isIterable(iterable), 'iterable must be an iterable')
    assert(isFunction(getNum), 'getNum must be a function')
    let val = initVal,
      finalItem = null
    for (const item of iterable) {
      const num = Number(getNum(item))
      if (!Number.isNaN(num) && compare(num, val)) {
        val = num
        finalItem = item
      }
    }
    return finalItem
  }
}

/**
 * 获取可迭代对象中的最小值
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], number> } getNum 获取最小值的函数
 * @returns { PickIterable<T> } 最小的一项
 * @example
 * const min = min([1, 2, 3, 4, 5]) // 1
 * const min = min([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a) // { a: 1 }
 * const min = min('1234567890') // '0'
 * const min = min(new Set([1, 2, 3]), (val) => val * 2) // 1
 * const min = min(new Map([['a', 1], ['b', 2], ['c', 3]]), (val) => val[1]) // ['a', 1]
 */
export const min = createMinormax(Infinity, (item, minVal) => item < minVal)

/**
 * 获取可迭代对象中的最大值
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], number> } getNum 获取最大值的函数
 * @returns { PickIterable<T> } 最大的一项
 * @example
 * const max = max([1, 2, 3, 4, 5]) // 5
 * const max = max([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a) // { a: 3 }
 * const max = max('1234567890') // '9'
 * const max = max(new Set([1, 2, 3]), (val) => val * 2) // 3
 * const max = max(new Map([['a', 1], ['b', 2], ['c', 3]]), (val) => val[1]) // ['c', 3]
 */
export const max = createMinormax(-Infinity, (item, maxVal) => item > maxVal)

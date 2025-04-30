import { getType, assert } from './common.util'
import type { PickIterable } from './util.type'
import { isFunction, isIterable, isNumber, isUndefined } from './validator.util'

const _baseCalc = <RT extends 'ResultItem' | 'ResultValue'>(options: {
  initVal: number
  conditionFn?: (resultVal: number, itemVal: number) => boolean
  nextVal: (resultVal: number, itemVal: number) => number
  returnType?: (resultVal: number, itemVal: any, size: number) => any
}) => {
  const { initVal, conditionFn = () => true, nextVal, returnType = (resultVal) => resultVal } = options
  return <T extends Iterable<any>>(
    iterable: T,
    callback?: (itemVal: PickIterable<T>) => number
  ): RT extends 'ResultItem' ? PickIterable<T> : number => {
    assert(isIterable(iterable), 'iterable must be an iterable')
    if (isUndefined(callback)) {
      callback = (val: any) => val
    }
    assert(isFunction(callback), 'callback must be a function')
    let resultVal = initVal
    let resultItem = null
    let size = 0
    for (const item of iterable) {
      const itemVal = callback(item)
      const numberVal = Number(itemVal)
      if (Number.isNaN(numberVal)) {
        console.warn(`callback must return a number, but got ${getType(itemVal)}`)
        continue
      }
      if (conditionFn(resultVal, numberVal)) {
        resultVal = nextVal(resultVal, numberVal)
        resultItem = item
      }
      size++
    }
    return returnType(resultVal, resultItem, size)
  }
}

/**
 * 计算可迭代对象的和
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], number> } callback 获取和的函数
 * @returns { number } 结果
 * @example
 * sum([1, 2, 3]) // 6
 * sum([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a) // 6
 * sum('1234567890') // 45
 * sum(new Set([1, 2, 3])) // 6
 * sum(new Map([['a', 1], ['b', 2], ['c', 3]])) // 6
 */
export const sum = _baseCalc({
  initVal: 0,
  nextVal: (resultVal, itemVal) => resultVal + itemVal
})

/**
 * 计算可迭代对象的乘积
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], number> } callback 获取乘积的函数
 * @returns { number } 结果
 * @example
 * multiply([1, 2, 3]) // 6
 * multiply([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a) // 6
 * multiply('1234567890') // 45
 * multiply(new Set([1, 2, 3])) // 6
 * multiply(new Map([['a', 1], ['b', 2], ['c', 3]])) // 6
 */
export const multiply = _baseCalc({
  initVal: 1,
  nextVal: (resultVal, itemVal) => resultVal * itemVal
})

/**
 * 计算可迭代对象的最小值
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], number> } callback 获取最小值的函数
 * @returns { number } 最小的一项
 * @example
 * min([1, 2, 3]) // 1
 * min([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a) // { a: 1 }
 * min('1234567890') // '0'
 * min(new Set([1, 2, 3])) // 1
 * min(new Map([['a', 1], ['b', 2], ['c', 3]])) // ['a', 1]
 */
export const min = _baseCalc<'ResultItem'>({
  initVal: Infinity,
  conditionFn: (resultVal, itemVal) => itemVal < resultVal,
  nextVal: (resultVal, itemVal) => (itemVal < resultVal ? itemVal : resultVal),
  returnType: (_, resultItem) => resultItem
})

/**
 * 计算可迭代对象的最大值
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], number> } callback 获取最大值的函数
 * @returns { number } 最大的一项
 * @example
 * max([1, 2, 3]) // 3
 * max([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a) // { a: 3 }
 * max('1234567890') // '9'
 * max(new Set([1, 2, 3])) // 3
 * max(new Map([['a', 1], ['b', 2], ['c', 3]])) // ['c', 3]
 */
export const max = _baseCalc<'ResultItem'>({
  initVal: -Infinity,
  conditionFn: (resultVal, itemVal) => itemVal > resultVal,
  nextVal: (resultVal, itemVal) => (itemVal > resultVal ? itemVal : resultVal),
  returnType: (_, resultItem) => resultItem
})

/**
 * 计算可迭代对象的平均值
 * @param { T } iterable 可迭代对象
 * @param { Fn<[PickIterable<T>], number> } callback 获取平均值的函数
 * @returns { number } 平均值
 * @example
 * average([1, 2, 3]) // 2
 * average([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a) // 2
 * average('1234567890') // '5'
 * average(new Set([1, 2, 3])) // 2
 * average(new Map([['a', 1], ['b', 2], ['c', 3]])) // 2
 */
export const average = _baseCalc({
  initVal: 0,
  nextVal: (resultVal, itemVal) => resultVal + itemVal,
  returnType: (resultVal, _, size) => resultVal / size
})

const _createRound = (methodName: 'round' | 'ceil' | 'floor') => {
  const method = Math[methodName]
  return (num: number, precision: number = 0) => {
    assert(isNumber(num), 'num must be a number')
    precision = Math.trunc(precision)
    if (precision === 0) {
      return method(num)
    }
    let pair = (String(num) + 'e').split('e')
    const value = method((pair[0] + 'e' + (+pair[1] + precision)) as any)
    pair = (String(value) + 'e').split('e')
    return +(pair[0] + 'e' + (+pair[1] - precision))
  }
}
/**
 * 四舍五入同 loadsh 的 round 方法
 * @param { number } num 数字
 * @param { number } precision 精度
 * @returns { number } 结果
 * @example
 * round(1.23456, 2) // 1.23
 * round(1.23456, 0) // 1
 */
export const round = _createRound('round')

/**
 * 向上取整同 loadsh 的 ceil 方法
 * @param { number } num 数字
 * @param { number } precision 精度
 * @returns { number } 结果
 * @example
 * ceil(1.23456, 2) // 1.24
 * ceil(1.23456, 0) // 2
 */
export const ceil = _createRound('ceil')

/**
 * 向下取整同 loadsh 的 floor 方法
 * @param { number } num 数字
 * @param { number } precision 精度
 * @returns { number } 结果
 */
export const floor = _createRound('floor')

import { isBlob, isDate, isFunction, isIterable, isMap, isObject, isRegExp, isSet } from './validator.util'

type JsTypeMap = {
  Object: object
  Array: any[]
  String: string
  Number: number
  Boolean: boolean
  Undefined: undefined
  Null: null
  Symbol: symbol
  Error: Error
  BigInt: bigint
  Function: () => any
  Date: Date
  RegExp: RegExp
  Map: Map<any, any>
  Set: Set<any>
  WeakMap: WeakMap<any, any>
  WeakSet: WeakSet<any>
  Promise: Promise<any>
  AsyncFunction: () => Promise<any>
  Blob: Blob
  ArrayBuffer: ArrayBuffer
  Uint8Array: Uint8Array
  Uint16Array: Uint16Array
  Uint32Array: Uint32Array
  Int8Array: Int8Array
  Int16Array: Int16Array
  Int32Array: Int32Array
  Float32Array: Float32Array
  Float64Array: Float64Array
  DataView: DataView
  SharedArrayBuffer: SharedArrayBuffer
  BigInt64Array: BigInt64Array
  BigUint64Array: BigUint64Array
}
type JsType = keyof JsTypeMap

/**
 * 获取值的类型
 * @param { any } val 值
 * @returns { JsType } 类型
 * @example
 * getType(1) // 'Number'
 * getType('1') // 'String'
 * getType(true) // 'Boolean'
 * getType(null) // 'Null'
 * getType(undefined) // 'Undefined'
 * getType({}) // 'Object'
 * getType([]) // 'Array'
 * getType(() => {}) // 'Function'
 * getType(new Date()) // 'Date'
 * getType(/a/g) // 'RegExp'
 * getType(new Map()) // 'Map'
 * getType(new Set()) // 'Set'
 * getType(new Uint8Array()) // 'Uint8Array'
 * getType(new Uint16Array()) // 'Uint16Array'
 * getType(new Uint32Array()) // 'Uint32Array'
 * getType(new Int8Array()) // 'Int8Array'
 * getType(new Int16Array()) // 'Int16Array'
 * getType(new Int32Array()) // 'Int32Array'
 * getType(new Float32Array()) // 'Float32Array'
 * getType(new Float64Array()) // 'Float64Array'
 * getType(new Blob()) // 'Blob'
 * getType(new ArrayBuffer()) // 'ArrayBuffer'
 * getType(new DataView()) // 'DataView'
 * getType(new SharedArrayBuffer()) // 'SharedArrayBuffer'
 * getType(new BigInt64Array()) // 'BigInt64Array'
 * getType(new BigUint64Array()) // 'BigUint64Array'
 */
export function getType(val: any): JsType {
  const type = Object.prototype.toString.call(val).slice(8, -1)
  return type as JsType
}

/**
 * 克隆数据
 * @param { any } val 值
 * @param { boolean } deep 是否深度克隆
 * @returns { any } 克隆后的值
 * @example
 * const obj = {
 *   str: '张三',
 *   num: 18,
 *   arr: [1, 2, 3],
 *   undefined: undefined,
 *   null: null,
 *   deepObj: {
 *     first: {
 *       second: {
 *         third: {
 *           fourth: {
 *             fifth: {
 *               a: 1
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *   arrObj: [{ a: 1 }, { b: 2 }, { c: 3 }],
 *   map: new Map([['key', 'value']]),
 *   set: new Set([1, 2, 3]),
 *   date: new Date(),
 *   reg: /^\d+$/,
 *   symbol: Symbol('symbol'),
 *   [key]: 'key',
 *   func: (val: number) => val * 2
 *   blob: new Blob(['123'], { type: 'text/plain' })
 * }
 * obj.self = obj
 * const cloneObj = clone(obj)
 */
export function clone<T>(val: T, deep = true): T {
  const cache = new WeakMap()
  function _clone(data: any) {
    if (data === null || typeof data !== 'object') return data
    if (cache.has(data)) return cache.get(data)
    if (Array.isArray(data)) {
      const clonedArr = new Array(data.length)
      cache.set(data, clonedArr)
      for (let i = 0; i < data.length; i++) {
        clonedArr[i] = deep ? _clone(data[i]) : data[i]
      }
      return clonedArr
    } else if (getType(data) === 'Object') {
      const proto = Object.getPrototypeOf(data)
      const clonedObj = Object.create(proto)
      cache.set(data, clonedObj)
      const keys = Reflect.ownKeys(data)
      for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          clonedObj[key] = deep ? _clone(data[key]) : data[key]
        }
      }
      return clonedObj
    } else if (isMap(data)) {
      const clonedMap = new Map()
      data.forEach((value, key) => {
        clonedMap.set(key, deep ? _clone(value) : value)
      })
      return clonedMap as any
    } else if (isSet(data)) {
      const clonedSet = new Set()
      data.forEach((value) => {
        clonedSet.add(deep ? _clone(value) : value)
      })
      return clonedSet as any
    } else if (isDate(data) || isRegExp(data)) {
      return new (data as any).constructor(data)
    } else if (isFunction(data)) {
      return new Function('return ' + data.toString())()
    } else if (isBlob(data)) {
      return new Blob([data], { type: data.type })
    } else {
      return data
      const clonedObj: any = Array.isArray(data) ? [] : {}
      cache.set(data, clonedObj)
      const keys = Reflect.ownKeys(data)
      for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          clonedObj[key] = deep ? _clone(data[key]) : data[key]
        }
      }
      return clonedObj
    }
  }
  return _clone(val)
}

/**
 * 判断两个值是否相等
 * @param { any } val1 值1
 * @param { any } val2 值2
 * @returns { boolean } 是否相等
 * @example
 * equals(1, 1) // true
 * equals({ a: 1 }, { a: 1 }) // true
 * equals({ a: 1 }, { a: 2 }) // false
 * equals([1, 2, 3], [1, 2, 3]) // true
 * equals([1, 2, 3], [1, 2, 4]) // false
 * equals(new Map([['key', 'value']]), new Map([['key', 'value']])) // true
 * equal(new Map([['key', 'value']]), new Map([['key', 'value2']])) // false
 * equals(new Set([1, 2, 3]), new Set([1, 2, 3])) // true
 * equal(new Set([1, 2, 3]), new Set([1, 2, 4])) // false
 * equals(new Date('2021-01-01'), new Date('2021-01-01')) // true
 * equals(new Date('2021-01-01'), new Date('2021-01-02')) // false
 * equals(/a/g, /a/g) // true
 * equals(/a/g, /b/g) // false
 */
export function isEqual(val1: any, val2: any): boolean {
  if (Object.is(val1, val2)) return true
  if (typeof val1 !== 'object' || val1 === null || typeof val2 !== 'object' || val2 === null) return false
  if (isObject(val1)) {
    const keysA = Reflect.ownKeys(val1)
    const keysB = Reflect.ownKeys(val2)
    if (keysA.length !== keysB.length) {
      return false
    }
    for (const key of keysA) {
      if (!keysB.includes(key)) return false
      if (!isEqual((val1 as any)[key], (val2 as any)[key])) return false
    }
  }
  if (isIterable(val1) && isIterable(val2)) {
    const iterator1 = val1[Symbol.iterator]()
    const iterator2 = val2[Symbol.iterator]()
    while (true) {
      const data1 = iterator1.next()
      const data2 = iterator2.next()
      if (!isEqual(data1.value, data2.value)) {
        return false
      }
      if (data1.done && data2.done) {
        break
      }
    }
    return true
  }
  if (isDate(val1)) return val1.getTime() === val2.getTime()
  if (isRegExp(val1)) return val1.toString() === val2.toString()
  return true
}

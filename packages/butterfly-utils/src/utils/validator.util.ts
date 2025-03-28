import { getType } from './common.util'

export type BaseType = string | number | boolean | bigint | symbol | null | undefined
/**
 * 判断是否是基础类型
 * @param val
 * @returns true | false
 */
export function isBaseType(val: any): val is BaseType {
  return typeof val !== 'object' || val === null
}

/**
 * 判断是否是对象
 * @param val
 * @returns true | false
 */
export function isObject(val: any): val is object {
  return getType(val) === 'Object'
}

/**
 * 判断是否是数组
 * @param val
 * @returns true | false
 */
export function isArray(val: any): val is any[] {
  return Array.isArray(val)
}

/**
 * 判断是否是字符串
 * @param val
 * @returns true | false
 */
export function isString(val: any): val is string {
  return typeof val === 'string'
}

/**
 * 判断是否是数字
 * @param val
 * @param options
 * @param options.NaN 是否包含NaN 默认不包含
 * @param options.Infinity 是否包含Infinity 默认不包含
 * @param options 是否包含-Infinity 默认不包含
 * @returns true | false
 */
export function isNumber(
  val: any,
  options: { NaN?: boolean; Infinitys?: boolean } = {
    NaN: false,
    Infinitys: false
  }
): val is number {
  if (typeof val !== 'number') return false
  if (options.NaN == false && Number.isNaN(val)) return false
  if (options.Infinitys == false && (val === Infinity || val === -Infinity)) return false
  return true
}

/**
 * 判断是否是布尔值
 * @param val
 * @returns true | false
 */
export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean'
}

/**
 * 判断是否是函数
 * @param val
 * @returns true | false
 */
export function isFunction(val: any): val is Function {
  return typeof val === 'function'
}

/**
 * 判断是否是异步函数
 * @param val
 * @returns true | false
 */
export function isAsyncFunction(val: any): val is GCFunction {
  return getType(val) === 'AsyncFunction'
}

/**
 * 判断是否是BigInt
 * @param val
 * @returns true | false
 */
export function isBigInt(val: any): val is bigint {
  return typeof val === 'bigint'
}

/**
 * 判断是否是undefined
 * @param val
 * @returns true | false
 */
export function isUndefined(val: any): val is undefined {
  return typeof val === 'undefined'
}

/**
 * 判断是否是null
 * @param val
 * @returns true | false
 */
export function isNull(val: any): val is null {
  return val === null
}

/**
 * 判断是否是正则表达式
 * @param val
 * @returns true | false
 */
export function isRegExp(val: any): val is RegExp {
  return getType(val) === 'RegExp'
}

/**
 * 判断是否是日期
 * @param val
 * @returns true | false
 */
export function isDate(val: any): val is Date {
  return getType(val) === 'Date'
}

/**
 * 判断是否是Symbol
 * @param val
 * @returns true | false
 */
export function isSymbol(val: any): val is symbol {
  return getType(val) === 'Symbol'
}

/**
 * 判断是否是Promise
 * @param val
 * @returns true | false
 */
export function isPromise(val: any): val is Promise<any> {
  return getType(val) === 'Promise'
}

/**
 * 判断是否是Map
 * @param val
 * @returns true | false
 */
export function isMap(val: any): val is Map<any, any> {
  return getType(val) === 'Map'
}

/**
 * 判断是否是Set
 * @param val
 * @returns true | false
 */
export function isSet(val: any): val is Set<any> {
  return getType(val) === 'Set'
}

/**
 * 判断是否是WeakMap
 * @param val
 * @returns true | false
 */
export function isWeakMap(val: any): val is WeakMap<any, any> {
  return getType(val) === 'WeakMap'
}

/**
 * 判断是否是WeakSet
 * @param val
 * @returns true | false
 */
export function isWeakSet(val: any): val is WeakSet<any> {
  return getType(val) === 'WeakSet'
}

/**
 * 判断是否是Blob
 * @param val
 * @returns true | false
 */
export function isBlob(val: any): val is Blob {
  return getType(val) === 'Blob'
}

/**
 * 判断是否是ArrayBuffer
 * @param val
 * @returns true | false
 */
export function isArrayBuffer(val: any): val is ArrayBuffer {
  return getType(val) === 'ArrayBuffer'
}

/**
 * 判断是否是TypedArray
 * @param val
 * @returns true | false
 */
export function isTypedArray(val: any): val is Uint8Array {
  return [
    'Uint8Array',
    'Int8Array',
    'Uint16Array',
    'Int16Array',
    'Uint32Array',
    'Int32Array',
    'Float32Array',
    'Float64Array'
  ].includes(getType(val))
}

/**
 * 判断是否是空值 (null、undefined、空字符串、空数组、空对象、空Map、空Set)
 * @param val
 * @returns true | false
 */
export function isEmpty(val: any) {
  if (val === null || val === '' || val === undefined) return true
  if (isObject(val)) {
    return Object.keys(val).length === 0
  }
  if (Array.isArray(val)) {
    return val.length === 0
  }
  if (isMap(val)) {
    return val.size === 0
  }
  if (isSet(val)) {
    return val.size === 0
  }
  return false
}

/**
 * 判断是否是可迭代对象
 * @param val
 * @returns true | false
 */
export function isIterable(val: any): val is Iterable<any> {
  return val !== null && val !== undefined && typeof val[Symbol.iterator] === 'function'
}

// /**
//  * 判断是否是RGB颜色
//  * @param { string } val
//  * @returns { boolean } true | false
//  */
// export function isRgbColor(color: string) {
//   assertString(color, 'color')
//   const [_, r, g, b, a] =
//     color.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*([\w.\w]+)\s*)?\)/) || []
//   if (!r || !g || !b) return false
//   const rNum = parseInt(r.trim())
//   const gNum = parseInt(g.trim())
//   const bNum = parseInt(b.trim())
//   if (Number.isNaN(rNum) || Number.isNaN(gNum) || Number.isNaN(bNum)) return false
//   if (rNum < 0 || rNum > 255 || gNum < 0 || gNum > 255 || bNum < 0 || bNum > 255) return false
//   if (a) {
//     const aNum = parseFloat(a.replace(',', '').trim())
//     if (Number.isNaN(aNum)) return false
//     if (aNum < 0 || aNum > 1) return false
//   }
//   return true
// }

// /**
//  * 判断是否是十六进制颜色
//  * @param val
//  * @returns true | false
//  */
// export function isHexColor(color: string) {
//   assertString(color, 'color')
//   const regex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
//   return regex.test(color)
// }

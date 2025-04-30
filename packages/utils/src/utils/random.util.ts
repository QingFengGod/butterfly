import { isMap, isSet, isUndefined } from './validator.util'

type RandomNumberOptions = {
  min?: number
  max?: number
  isFloat?: boolean
  decimals?: number
}

/**
 * 生成一个随机数
 * @param {RandomNumberOptions} options object 参数配置
 * @param {number} options.min number 最小值
 * @param {number} options.max number 最大值
 * @param {boolean} [options.isFloat = false] boolean 是否是浮点数
 * @param {number} [options.decimals] number 小数位数（仅在 isFloat 为 true 时有效）
 * @returns 随机数
 * @example
 * randomNumber({ min: 1, max: 10 }) // 5
 * randomNumber({ min: 1, max: 10, isFloat: true }) // 5.55
 * randomNumber({ min: 1, max: 10, isFloat: true, decimals: 5 }) // 5.55555
 */
export function randomNumber(options: RandomNumberOptions = {}) {
  const { min = 0, max = 10, isFloat = false, decimals } = options
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('min and max must be numbers')
  }
  if (min > max) {
    throw new Error('min must be less than max')
  }
  const randomValue = Math.random() * (max - min) + min
  if (isFloat || (decimals && decimals > 0)) {
    return Number(randomValue.toFixed(decimals || 2))
  }
  return Math.floor(randomValue)
}

type RandomStringOptions = {
  chars?: string
  length?: number
  includeNumber?: boolean
}
/**
 * 生成一个随机字符串
 * @param {RandomStringOptions} options object 参数配置
 * @param {string} options.chars  string 字符串字符集
 * @param {number} options.length number 字符串长度
 * @param {boolean} options.includeNumber boolean 是否包含数字
 * @returns 随机字符串
 * @example
 * randomString() // 'a2d3ghj1kl'
 * randomString({ includeNumber: false }) // 'asdfghjkl'
 * randomString({ length: 20, includeNumber: false }) // 'asdfghjklasdfghjkl'
 * randomString({ length: 5, chars: '12' }) // '12122'
 */
export function randomString(options: RandomStringOptions = {}) {
  let { chars, length = 10, includeNumber = true } = options
  if (typeof length !== 'number' && length < 0) {
    throw new Error('length is not a number or less than 0')
  }
  if (isUndefined(chars)) {
    chars =
      '52YqbyaAXfRlWPh8TdeD7MNlxH2wjSevIX7CnVuKgIRh9r1t4qdsiCzLpP50U6wUN16zGLvABkDEyncoYgm8JTEuKsjQFfBW0acFSbMZV33GQp4JZmiOHto9xOrk'
  } else {
    chars = includeNumber
      ? 'QzefhuMRgvLqINDGbaOKHcJTPVCXSUyYskB5pZA9ml7id3x8w041r6jntW2oEF'
      : 'klGTQAoESRzMgadBxrPvUjOIVHFCpcZqyXfDWnYiuJNwtmbKehsL'
  }

  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

/**
 * 生成一个随机布尔值
 * @returns 随机布尔值
 * @example
 * randomBoolean() // true
 * randomBoolean() // false
 */
export function randomBoolean() {
  return Math.random() < 0.5
}

/**
 * 从字符串、数组、Map 或 Set 中随机取一个值
 * @param {string | T[] | Map<any, T> | Set<T>} val 字符串、数组、Map 或 Set
 * @returns 随机取出的值
 * @example
 * randomItem('1234567890') // '1'
 * randomItem(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']) // '3'
 * randomItem(new Map([['a', '1'], ['b', '2'], ['c', '3']])) // '2'
 * randomItem(new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])) // '7'
 */
export function randomItem<T extends string>(val: T): string
export function randomItem<T>(val: T[]): T
export function randomItem<T>(val: Map<any, T>): T
export function randomItem<T>(val: Set<T>): T
export function randomItem<T>(val: string | T[] | Map<any, T> | Set<T>): T {
  if (typeof val === 'string' || Array.isArray(val)) {
    return val[randomNumber({ min: 0, max: val.length })] as T
  } else if (isMap(val)) {
    return val.get(randomItem(Array.from(val.keys()))) as T
  } else if (isSet(val)) {
    const arr = Array.from(val)
    return arr[randomNumber({ min: 0, max: arr.length })] as T
  } else {
    throw new Error('val must be a string, array, map or set')
  }
}

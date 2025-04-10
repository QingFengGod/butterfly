import { assertString } from './assert.util'
import { isRegExp, isUndefined } from './validator.util'

const UNICODE_WORD_REGEXP = /(\p{L})+/gu

const ASCII_WORD_REGEXP = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g
/**
 * 判断字符串是否包含Unicode字符
 * @param {string} str 需要判断的字符串
 * @returns {boolean} true | false
 * @example
 * hasUnicodeWord('a-b-c') // true
 * hasUnicodeWord('a-b-c') // true
 */
export function hasUnicodeWord(str: string) {
  return UNICODE_WORD_REGEXP.test(str)
}

/**
 * 判断字符串是否包含ASCII字符
 * @param {string} str 需要判断的字符串
 * @returns {boolean} true | false
 * @example
 * hasAsciiWord('a-b-c') // true
 */
export function hasAsciiWord(str: string) {
  return ASCII_WORD_REGEXP.test(str)
}

/**
 * 拆分ASCII字符串为单词数组
 * @param {string} str 需要转换的字符串
 * @returns {string[]} 转换后的字符串
 * @example
 * asciiWords('a-b-c') // ['a', 'b', 'c']
 */
export function asciiWords(str: string) {
  return str.match(ASCII_WORD_REGEXP) || []
}

/**
 * Splits a Unicode `string` into an array of its words.
 * 拆分Unicode字符串为单词数组
 * @param {string} str 需要转换的字符串
 * @returns {string[]} 转换后的字符串
 * @example
 * unicodeWords('a-b-c') // ['a', 'b', 'c']
 */
export function unicodeWords(str: string) {
  return str.match(UNICODE_WORD_REGEXP) || []
}

/**
 * 拆分字符串string中的词为数组
 * @param {string} str string 需要转换的字符串
 * @param {RegExp} pattern RegExp 需要转换的正则表达式
 * @returns {string[]} 转换后的字符串
 * @example
 * strSplitWords('a-b_c1&B') // 'a b c'
 * strSplitWords('a-b-c', /[^- ]+/g) // ['a', 'b', 'c']
 */
export function strSplitWords(str: string, pattern?: RegExp) {
  str = String(str)
  if (pattern === undefined) {
    return hasUnicodeWord(str) ? unicodeWords(str) : asciiWords(str)
  }

  return str.match(pattern) || []
}

/**
 * 将字符串中的指定位置或正则表达式匹配的位置转换为大写
 * @param {string} str 需要转换的字符串
 * @param {number[] | RegExp} [idxs] 需要转换的位置或正则表达式
 * @returns {string} 转换后的字符串
 * @example
 */
export function upperCase(str: string): string
export function upperCase(str: string, idxs: number[]): string
export function upperCase(str: string, pattern: RegExp): string
export function upperCase(str: string, idxs?: number[] | RegExp) {
  assertString(str, 'str')
  if (isUndefined(idxs)) {
    return str.toUpperCase()
  }
  if (Array.isArray(idxs)) {
    const arr = str.split('')
    for (let i = 0; i < idxs.length; i++) {
      arr[idxs[i]] = arr[idxs[i]].toUpperCase()
    }
    return arr.join('')
  }

  if (isRegExp(idxs)) {
    return str.replace(idxs, (match) => {
      return match.toUpperCase()
    })
  }
  return str
}

/**
 * 将字符串中的指定位置或正则表达式匹配的位置转换为小写
 * @param {string} str 需要转换的字符串
 * @param {number[] | RegExp} [idxs] 需要转换的位置或正则表达式
 * @returns {string} 转换后的字符串
 * @example
 */
export function lowerCase(str: string): string
export function lowerCase(str: string, idxs: number[]): string
export function lowerCase(str: string, pattern: RegExp): string
export function lowerCase(str: string, idxs?: number[] | RegExp) {
  assertString(str, 'str')
  if (isUndefined(idxs)) {
    return str.toLowerCase()
  }
  if (Array.isArray(idxs)) {
    const arr = str.split('')
    for (let i = 0; i < idxs.length; i++) {
      arr[idxs[i]] = arr[idxs[i]].toLowerCase()
    }
    return arr.join('')
  }
  if (isRegExp(idxs)) {
    return str.replace(idxs, (match) => {
      return match.toLowerCase()
    })
  }
  return str
}

/**
 * 将字符串转换为驼峰命名
 * @param {string} str string 需要转换的字符串
 * @param {RegExp} reg RegExp 需要转换的正则表达式
 * @returns {string} 转换后的字符串
 * @example
 * toCamelCase('my_name_is') // 'myNameIs'
 * toCamelCase('type', /[^- ]+/g) // 'type'
 */
export function toCamelCaseName(str: string, options: { pattern?: RegExp; firstUpperCase?: boolean } = {}) {
  assertString(str, 'str')
  const { pattern, firstUpperCase = false } = options
  return strSplitWords(str, pattern)
    .map((word, idx) => {
      if (idx === 0) {
        return firstUpperCase ? upperCase(word, [0]) : lowerCase(word, [0])
      }
      return upperCase(word, [0])
    })
    .join('')
}

/**
 * 将字符串转换为蛇形命名
 * @param {string} str string 需要转换的字符串
 * @param {RegExp} pattern RegExp 需要转换的正则表达式
 * @returns {string} 转换后的字符串
 * @example
 * snakeCase('myNameIs') // 'my_name_is'
 */
export function toSnakeCaseName(str: string, options: { pattern?: RegExp; upperCase?: boolean } = {}) {
  assertString(str, 'str')
  const { pattern, upperCase: isToUpperCase = false } = options
  const result = toCamelCaseName(str, { pattern }).replace(/([A-Z])/g, (match) => {
    return `_${match}`
  })
  return isToUpperCase ? result.toUpperCase() : result.toLowerCase()
}

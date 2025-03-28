import type { Paths, PathValue } from 'ts-essentials'
import { assert, assertString } from './assert.util'
import { isNumber, isObject, isString, isSymbol } from './validator.util'

type Getter<Obj extends Record<string, any>> = <
  Key extends Paths<Obj>,
  Val extends PathValue<Obj, Key> = PathValue<Obj, Key>
>(
  path: Key,
  defaultValue?: Val
) => Val extends undefined
  ? PathValue<Obj, Key> | undefined
  : Exclude<PathValue<Obj, Key> | undefined, undefined>

type Setter<Obj extends Record<string, any>> = <Key extends Paths<Obj>>(
  path: Key,
  value: PathValue<Obj, Key>
) => void

/**
 * 创建一个安全的对象属性访问器和设置器
 * @param { Object } obj 对象
 * @returns {[Getter<Obj>, Setter<Obj>]} 返回一个数组, 第一个元素是获取器, 第二个元素是设置器
 */
export function createSafeObjGetterSetter<const Obj extends Record<string, any>>(
  obj: Obj
): [Getter<Obj>, Setter<Obj>] {
  assert(isObject(obj), 'obj must be an object')
  const getter: Getter<Obj> = function <Key extends Paths<Obj>>(
    path: Key,
    defaultValue?: PathValue<Obj, Key>
  ): PathValue<Obj, Key> | undefined {
    assertString(path, 'path must be a string')
    const paths = path.split('.')
    let result: any = obj
    while (paths.length > 0) {
      const key = paths.shift()!
      if (result[key] == null || result[key] === '' || result[key] == undefined) {
        return defaultValue
      }
      result = result[key]
    }
    return result as PathValue<Obj, Key>
  } as Getter<Obj>

  const setter: Setter<Obj> = function <Key extends Paths<Obj>>(path: Key, value: PathValue<Obj, Key>) {
    assertString(path, 'path must be a string')
    const paths = path.split('.')
    const _set = (data: any) => {
      while (paths.length > 0) {
        const key = paths.shift()!
        if (data && !data[key] && paths.length > 0) {
          return
        }
        if (paths.length === 0 && data[key]) {
          data[key] = value
        }
        _set(data[key])
      }
    }
    _set(obj)
  } as Setter<Obj>
  return [getter, setter]
}

/**
 * 去除对象的某些属性 返回一个新对象
 * @param { Object } obj 对象
 * @param { Array<keyof Obj> } keys 需要忽略的属性
 * @returns { Omit<Obj, Keys> } 返回一个新对象, 新对象中不包含忽略的属性
 */
export function objOmit<Obj extends Record<string, any>, Keys extends keyof Obj>(
  obj: Obj,
  ...keys: Keys[]
): Omit<Obj, Keys> {
  assert(isObject(obj), 'obj must be an object')
  const result = { ...obj }
  keys.forEach((key) => {
    if (isString(key) || isNumber(key) || isSymbol(key)) {
      delete result[key]
    } else {
      console.warn(key, `is not a string, number or symbol`)
    }
  })
  return result
}

/**
 *
 * @param obj
 * @param keys
 * @returns
 */
export function objPick<Obj extends Record<string, any>, Keys extends keyof Obj>(
  obj: Obj,
  ...keys: Keys[]
): Pick<Obj, Keys> {
  assert(isObject(obj), 'obj must be an object')
  const result: Pick<Obj, Keys> = {} as Pick<Obj, Keys>
  keys.forEach((key) => {
    if (isString(key) || isNumber(key) || isSymbol(key)) {
      result[key] = obj[key]
    } else {
      console.warn(key, `is not a string, number or symbol`)
    }
  })
  return result
}

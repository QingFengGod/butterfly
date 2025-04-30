import type { Paths, PathValue } from 'ts-essentials'
import { assert } from './common.util'
import { isNumber, isObject, isString, isSymbol } from './validator.util'

type Getter<Obj extends Record<string, any>> = <
  Key extends Paths<Obj>,
  Val extends PathValue<Obj, Key> = PathValue<Obj, Key>
>(
  path: Key,
  defaultValue?: Val
) => Val extends undefined ? PathValue<Obj, Key> | undefined : Exclude<PathValue<Obj, Key> | undefined, undefined>

type Setter<Obj extends Record<string, any>> = <Key extends Paths<Obj>>(path: Key, value: PathValue<Obj, Key>) => void

/**
 * 创建一个安全的对象属性访问器和设置器
 * @param { Object } obj 对象
 * @returns {[Getter<Obj>, Setter<Obj>]} 返回一个数组, 第一个元素是获取器, 第二个元素是设置器
 */
export function createSafeObjGetterSetter<const Obj extends Record<string, any>>(obj: Obj): [Getter<Obj>, Setter<Obj>] {
  assert(isObject(obj), 'obj must be an object')
  const getter: Getter<Obj> = function <Key extends Paths<Obj>>(
    path: Key,
    defaultValue?: PathValue<Obj, Key>
  ): PathValue<Obj, Key> | undefined {
    assert(isString(path), 'path must be a string')
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
    assert(isString(path), 'path must be a string')
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

// export function mergeObj<
//   Obj extends Record<string, any>,
//   Obj2 extends Record<string, any>,
//   Obj3 extends Record<string, any>,
//   Obj4 extends Record<string, any>
// >(obj: Obj, obj2: Obj2, obj3?: Obj3, obj4?: Obj4): Obj & Obj2 & Obj3 & Obj4 {
//   // 检查传入的参数是否为对象
//   if (!isObject(obj) || !isObject(obj2)) {
//     throw new Error('val1 and val2 must be an object')
//   }
//   const result: any = { ...obj }
//   for (const key in obj2) {
//     if (deep && isObject(obj[key]) && isObject(obj2[key])) {
//       result[key] = merge(obj[key], obj2[key], deep)
//     } else {
//       result[key] = obj2[key]
//     }
//   }
//   return result
// }

/**
 * 判断对象是否具有某个属性
 * @param { Record<string, any> } obj 对象
 * @param { string } key 属性名
 * @returns { boolean } 是否具有该属性
 */
export function hasProperty<Obj extends Record<string, any>, Key extends string>(
  obj: Obj,
  key: Key
): obj is Obj & { [k in Key]: any } {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

import { expect, test, describe } from 'bun:test'
import { clone, getType, isEqual, debounce, throttle } from '../src'
import { sleep } from 'bun'
type TestObj = {
  str: string
  num: number
  arr: number[]
  undefined: undefined
  null: null
  deepObj: {
    first: {
      second: {
        third: {
          fourth: {
            fifth: {
              a: number
            }
          }
        }
      }
    }
  }
  [key: symbol]: string
  arrObj: Array<any>
  map: Map<string, string>
  set: Set<number>
  date: Date
  reg: RegExp
  symbol: symbol
  func: (val: number) => number
  self?: TestObj
  blob: Blob
}

describe('common.util', () => {
  test('getType', () => {
    class A {
      constructor() {}
      get [Symbol.toStringTag]() {
        return 'A'
      }
    }

    expect(getType('a')).toBe('String')
    expect(getType(true)).toBe('Boolean')
    expect(getType(false)).toBe('Boolean')
    expect(getType(1)).toBe('Number')
    expect(getType(1.2)).toBe('Number')
    expect(getType(null)).toBe('Null')
    expect(getType(undefined)).toBe('Undefined')
    expect(getType(new A()) as string).toBe('A')
    expect(getType({})).toBe('Object')
    expect(getType([])).toBe('Array')
    expect(getType(new RegExp('a'))).toBe('RegExp')
    expect(getType(Symbol())).toBe('Symbol')
    expect(getType(1n)).toBe('BigInt')
    expect(getType(new Date())).toBe('Date')
    expect(getType(new Error())).toBe('Error')
    expect(getType(new Map())).toBe('Map')
    expect(getType(new Set())).toBe('Set')
    expect(getType(new WeakMap())).toBe('WeakMap')
    expect(getType(new WeakSet())).toBe('WeakSet')
    expect(getType(function () {})).toBe('Function')
    expect(getType(async function () {})).toBe('AsyncFunction')
    expect(getType(new Promise(() => {}))).toBe('Promise')
    expect(getType(new Promise((resolve) => resolve(1)))).toBe('Promise')
  })

  test('clone', () => {
    const key = Symbol('key')
    const obj: TestObj = {
      str: '张三',
      num: 18,
      arr: [1, 2, 3],
      undefined: undefined,
      null: null,
      deepObj: {
        first: {
          second: {
            third: {
              fourth: {
                fifth: {
                  a: 1
                }
              }
            }
          }
        }
      },
      arrObj: [{ a: 1 }, { b: 2 }, { c: 3 }],
      map: new Map([['key', 'value']]),
      set: new Set([1, 2, 3]),
      date: new Date(),
      reg: /^\d+$/,
      symbol: Symbol('symbol'),
      [key]: 'key',
      func: (val: number) => val * 2,
      blob: new Blob(['123'], { type: 'text/plain' })
    }
    obj.self = obj
    const cloneObj = clone(obj)
    expect(cloneObj).toEqual(obj)
    expect(cloneObj).not.toBe(obj)
    expect(cloneObj.str).toEqual(obj.str)
    expect(cloneObj.num).toEqual(obj.num)
    expect(cloneObj.arr).toEqual(obj.arr)
    expect(cloneObj.arrObj).toEqual(obj.arrObj)
    expect(cloneObj.map).toEqual(obj.map)
    expect(cloneObj.set).toEqual(obj.set)
    expect(cloneObj.date).toEqual(obj.date)
    expect(cloneObj.reg).toEqual(obj.reg)
    expect(cloneObj.symbol).toEqual(obj.symbol)
    expect(cloneObj.func).toEqual(obj.func)
    expect(cloneObj.self).toEqual(obj.self)
    expect(cloneObj.self).not.toBe(obj.self)

    const cloneObj2 = clone(obj, false)
    expect(cloneObj2).toEqual(obj)
    expect(cloneObj2).not.toBe(obj)
    expect(cloneObj2.str).toEqual(obj.str)
    expect(cloneObj2.num).toEqual(obj.num)
    expect(cloneObj2.arr).toEqual(obj.arr)
    expect(cloneObj2.arrObj).toEqual(obj.arrObj)
    expect(cloneObj2.map).toEqual(obj.map)
    expect(cloneObj2.set).toEqual(obj.set)
    expect(cloneObj2.date).toEqual(obj.date)
    expect(cloneObj2.reg).toEqual(obj.reg)
    expect(cloneObj2.symbol).toEqual(obj.symbol)
    expect(cloneObj2.func).toEqual(obj.func)
    expect(cloneObj2.self).toEqual(obj.self)
    expect(cloneObj2.self).toBe(obj.self)

    const cloneObj3 = clone(obj)
    expect(cloneObj3).toEqual(obj)
    expect(cloneObj3.deepObj.first.second.third).toEqual(obj.deepObj.first.second.third)
    expect(cloneObj3.deepObj.first.second.third).not.toBe(obj.deepObj.first.second.third)

    expect(clone(1)).toEqual(1)
    expect(clone(1)).toEqual(1)
    expect(clone(true)).toEqual(true)
    expect(clone(false)).toEqual(false)
    expect(clone('1')).toEqual('1')
    expect(clone('1')).toEqual('1')
    expect(clone(new Date())).toEqual(new Date())
    expect(clone(new Map())).toEqual(new Map())
    expect(clone(new Set())).toEqual(new Set())
    expect(clone(new WeakMap())).toEqual(new WeakMap())
    expect(clone(new WeakSet())).toEqual(new WeakSet())
    expect(clone(new Promise(() => {}))).toEqual(new Promise(() => {}))
    expect(clone(new Promise((resolve) => resolve(1)))).toEqual(new Promise((resolve) => resolve(1)))
  })

  test('isEqual', () => {
    const set1 = new Set([{ a: 1 }, { a: 2 }])
    const set2 = new Set([{ a: 1 }, { a: 2 }])
    expect(isEqual(set1, set2)).toBe(true)
    expect(isEqual(1, 1)).toBe(true)
    expect(isEqual(1, 2)).toBe(false)
    expect(isEqual(1, '1')).toBe(false)
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
    expect(isEqual({ a: 1, b: 2, c: [{ d: 1 }] }, { a: 1, b: 2, c: [{ d: 1 }] })).toBe(true)
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false)
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(isEqual([1, 2, 3], [1, 2])).toBe(false)
    expect(isEqual([1, 2, 3], [1, 2, 3, 4])).toBe(false)
    expect(isEqual([{ a: 1 }, { a: 2 }], [{ a: 1 }, { a: 2 }])).toBe(true)
    expect(isEqual([{ a: 1 }, { a: 2 }], [{ a: 1 }, { a: 3 }])).toBe(false)
    const map1 = new Map()
    map1.set('a', 1)
    map1.set('b', 2)
    const map2 = new Map()
    map2.set('a', 1)
    map2.set('b', 2)
    expect(isEqual(map1, map2)).toBe(true)
    const map3 = new Map()
    map3.set('a', 1)
    map3.set('b', 2)
    const map4 = new Map()
    map4.set('a', 1)
    map4.set('b', 3)
    expect(isEqual(map3, map4)).toBe(false)

    const date1 = new Date()
    const date2 = new Date()
    expect(isEqual(date1, date2)).toBe(true)
    const date3 = new Date()
    date3.setDate(date3.getDate() + 1)
    expect(isEqual(date1, date3)).toBe(false)
    expect(isEqual(/^\d+$/, /^\d+$/)).toBe(true)
    expect(isEqual(/^\d+$/, /^\d1+$/)).toBe(false)

    class A {
      constructor() {}
    }
    const a1 = new A()
    const a2 = new A()
    expect(isEqual(a1, a2)).toBe(true)

    const all = () => {}
    const all2 = () => {}
    expect(isEqual(all, all2)).toBe(false)
    expect(isEqual(all, all)).toBe(true)
  })

  test(
    'debounce leading true',
    async () => {
      const fn = (a: number, label: string) => {
        console.log(`【${label}】`)
        return a
      }
      const debouncedFn = debounce(fn, 300, { invokeType: 'leading' })
      expect(debouncedFn(1, 'call1-debounce-leading')).toBe(1) // log 1
      expect(debouncedFn(2, 'call2-debounce-leading')).toBe(1)
      await sleep(400)
      expect(debouncedFn(3, 'call3-debounce-leading')).toBe(3) // log 3
      expect(debouncedFn.flush(4, 'call4-debounce-leading')).toBe(4) // log 4
      await sleep(200)
      expect(debouncedFn(5, 'call5-debounce-leading')).toBe(4)
      await sleep(500)
      expect(debouncedFn(6, 'call6-debounce-leading')).toBe(6) // log 6
      await sleep(200)
      expect(debouncedFn(7, 'call7-debounce-leading')).toBe(6)
      debouncedFn.cancel()
      await sleep(500)
    },
    { timeout: 10000 }
  )

  test(
    'debounce trailing true',
    async () => {
      const fn = (a: number, label: string) => {
        console.log(`【${label}】`)
        return a
      }
      const debouncedFn = debounce(fn, 300, { invokeType: 'trailing' })
      expect(debouncedFn(1, 'call1-debounce-trailing') as undefined).toBe(undefined)
      expect(debouncedFn(2, 'call2-debounce-trailing') as undefined).toBe(undefined)
      await sleep(400) // log 2
      expect(debouncedFn(3, 'call3-debounce-trailing')).toBe(2)
      expect(debouncedFn.flush(4, 'call4-debounce-trailing')).toBe(4) // log 4
      await sleep(200)
      expect(debouncedFn(5, 'call5-debounce-trailing')).toBe(4)
      await sleep(500) // log5
      expect(debouncedFn(6, 'call6-debounce-trailing')).toBe(5)
      await sleep(200)
      expect(debouncedFn(7, 'call7-debounce-trailing')).toBe(5)
      debouncedFn.cancel()
      await sleep(500)
    },
    { timeout: 10000 }
  )

  test(
    'throttle immediate true',
    async () => {
      const fn = (a: number, label: string) => {
        console.log(`【${label}】`)
        return a
      }
      const throttledFn = throttle(fn, 300, { immediate: true })
      expect(throttledFn(1, 'throttle-immediate-true call1')).toBe(1) // log 1
      expect(throttledFn(2, 'throttle-immediate-true call2')).toBe(1)
      await sleep(400)
      expect(throttledFn(3, 'throttle-immediate-true call3')).toBe(3) // log 3
      expect(throttledFn.flush(4, 'throttle-immediate-true call4')).toBe(4) // log 4
      await sleep(200)
      expect(throttledFn(5, 'throttle-immediate-true call5')).toBe(4)
      await sleep(100)
      expect(throttledFn(6, 'throttle-immediate-true call6')).toBe(6) // log 6
      await sleep(200)
      expect(throttledFn(7, 'throttle-immediate-true call7')).toBe(6)
      await sleep(500)
    },
    { timeout: 10000 }
  )

  test(
    'throttle immediate false',
    async () => {
      const fn = (a: number, label: string) => {
        console.log(`【${label}】`)
        return a
      }
      const throttledFn = throttle(fn, 300, { immediate: false })
      expect(throttledFn(1, 'throttle-immediate-false call1') as any).toBe(undefined)
      expect(throttledFn(2, 'throttle-immediate-false call2') as any).toBe(undefined)
      await sleep(400)
      expect(throttledFn(3, 'throttle-immediate-false call3')).toBe(3) // log 3
      expect(throttledFn.flush(4, 'throttle-immediate-true call4')).toBe(4) // log 4
      await sleep(200)
      expect(throttledFn(5, 'throttle-immediate-false call5')).toBe(4)
      await sleep(100)
      expect(throttledFn(6, 'throttle-immediate-false call6')).toBe(6) // log 6
      await sleep(200)
      expect(throttledFn(7, 'throttle-immediate-false call7')).toBe(6)
      await sleep(500)
    },
    { timeout: 10000 }
  )
})

import { expect, test, describe } from 'bun:test'
import { randomNumber, uniqueArray } from '../src'

describe('array.util', () => {
  test('uniqueArray', () => {
    expect(uniqueArray([1, 2, 3])).toEqual([1, 2, 3])
    expect(uniqueArray([1, 2, 2, 3, 3])).toEqual([1, 2, 3])
    expect(uniqueArray([{ a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }, { a: 3 }])).toEqual([
      { a: 1 },
      { a: 2 },
      { a: 3 }
    ])
    expect(
      uniqueArray([{ a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }, { a: 3 }], (val, val2) => val.a === val2.a)
    ).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
  })
  test('uniqueArray 基本类型 性能测试', () => {
    const arr: Array<number> = []
    for (let i = 0; i < 1000000; i++) {
      arr.push(randomNumber({ min: 1, max: 1000 }))
    }
    const start = performance.now()
    uniqueArray(arr)
    const end = performance.now()
    console.log(`uniqueArray performance: ${end - start}ms`)
    expect(end - start).toBeLessThan(100)
  })

  test('uniqueArray 对象类 性能测试', () => {
    const arr: Array<{ id: number; name: string }> = []
    for (let i = 0; i < 5000; i++) {
      arr.push({ id: i, name: `name${randomNumber({ min: 1, max: 1000 })}` })
    }
    const start = performance.now()
    uniqueArray(arr)
    const end = performance.now()
    console.log(`uniqueArray performance: ${end - start}ms`)
    expect(end - start).toBeLessThan(1000)
  })
})

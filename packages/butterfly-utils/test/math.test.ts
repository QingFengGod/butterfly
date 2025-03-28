import { expect, test, describe } from 'bun:test'
import { average, ceil, floor, max, min, multiply, round, sum } from '../src'

describe('math.util', () => {
  test('min', () => {
    expect(min([1, 2, 3])).toBe(1)
    expect(min([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a)).toEqual({ a: 1 })
    expect(min('1234567890')).toBe('0')
    expect(min(new Set([1, 2, 3]), (val) => val * 2)).toBe(1)
    expect(
      min(
        new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3]
        ]),
        (val) => val[1]
      )
    ).toEqual(['a', 1])
  })

  test('max', () => {
    expect(max([1, 2, 3])).toBe(3)
    expect(max([{ a: 1 }, { a: 2 }, { a: 3 }], (val) => val.a)).toEqual({ a: 3 })
    expect(max('1234567890')).toBe('9')
    expect(max(new Set([1, 2, 3]), (val) => val * 2)).toBe(3)
    expect(
      max(
        new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3]
        ]),
        (val) => val[1]
      )
    ).toEqual(['c', 3])
  })

  test('sum', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
    expect(sum([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }], (val) => val.a)).toBe(15)
    expect(sum('1234567890')).toBe(45)
    expect(sum(new Set([1, 2, 3, 4, 5]))).toBe(15)
    expect(
      sum(
        new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3]
        ]),
        (val) => val[1]
      )
    ).toBe(6)
  })

  test('average', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3)
    expect(average([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }], (val) => val.a)).toBe(3)
    expect(average('1234567890')).toBe(4.5)
  })

  test('multiply', () => {
    expect(multiply([1, 2, 3, 4, 5])).toBe(120)
    expect(multiply([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }], (val) => val.a)).toBe(120)
    expect(multiply('1234567890')).toBe(0)
    expect(multiply(new Set([1, 2, 3, 4, 5]))).toBe(120)
  })

  test('round', () => {
    expect(round(1.23456, 2)).toBe(1.23)
    expect(round(1.23456, 0)).toBe(1)
  })

  test('ceil', () => {
    expect(ceil(1.23456, 2)).toBe(1.24)
    expect(ceil(1.23456, 0)).toBe(2)
  })

  test('floor', () => {
    expect(floor(1.23456, 2)).toBe(1.23)
    expect(floor(1.23456, 0)).toBe(1)
  })
})

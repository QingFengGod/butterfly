import { expect, test, describe } from 'bun:test'
import { count, groupBy } from '../src'

describe('iterable.util', () => {
  test('groupBy', () => {
    const grouped = groupBy('122333')
    expect(grouped).toEqual({
      1: ['1'],
      2: ['2', '2'],
      3: ['3', '3', '3']
    })
    const map = new Map<string, number>()
    map.set('a', 1)
    map.set('b', 2)
    map.set('c', 2)
    map.set('d', 3)
    map.set('e', 3)
    map.set('f', 3)
    const grouped2 = groupBy(map, ([key, value]) => ({ key: value, value: { key, value } }))
    expect(grouped2).toEqual({
      1: [{ key: 'a', value: 1 }],
      2: [
        { key: 'b', value: 2 },
        { key: 'c', value: 2 }
      ],
      3: [
        { key: 'd', value: 3 },
        { key: 'e', value: 3 },
        { key: 'f', value: 3 }
      ]
    })
    expect(groupBy(new Set([1, 2, 3]))).toEqual({
      1: [1],
      2: [2],
      3: [3]
    })
    const arr = [1, 2, 2, 3, 3, 3]
    const grouped3 = groupBy(arr)
    expect(grouped3).toEqual({
      1: [1],
      2: [2, 2],
      3: [3, 3, 3]
    })
    const grouped4 = groupBy(arr, (val) => ({ key: val % 2, value: val }))
    expect(grouped4).toEqual({
      1: [1, 3, 3, 3],
      0: [2, 2]
    })

    const arr2 = [{ a: 1 }, { a: 1 }, { a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }]
    const grouped5 = groupBy(arr2, (val) => ({ key: val.a, value: val }))
    expect(grouped5).toEqual({
      1: [{ a: 1 }, { a: 1 }, { a: 1 }],
      2: [{ a: 2 }, { a: 2 }],
      3: [{ a: 3 }]
    })
  })

  test('count', () => {
    expect(count([1, 2, 3, 4, 5])).toEqual({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 })
    expect(count([{ a: 1 }, { a: 1 }, { a: 2 }, { a: 2 }, { a: 3 }], (val) => val.a)).toEqual({
      1: 2,
      2: 2,
      3: 1
    })
    expect(count('1234567890')).toEqual({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 0: 1 })
    expect(
      count(new Set([{ value: 1 }, { value: 1 }, { value: 0 }, { value: 0 }]), (val) => val.value)
    ).toEqual({
      0: 2,
      1: 2
    })
    expect(
      count(
        new Map([
          ['a', 1],
          ['b', 2],
          ['c', 3]
        ]),
        (val) => val[1]
      )
    ).toEqual({ 1: 1, 2: 1, 3: 1 })
  })
})

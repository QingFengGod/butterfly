import { expect, test, describe } from 'bun:test'
import { lowerCase, strSplitWords, toCamelCaseName, toSnakeCaseName, upperCase } from '../src'

describe('string.util', () => {
  test('strSplitWords', () => {
    expect(strSplitWords('a-b-c')).toEqual(['a', 'b', 'c'])
    expect(strSplitWords('a-b_c1&B')).toEqual(['a', 'b', 'c', 'B'])
    expect(strSplitWords('a-b-c', /[^-]+/g)).toEqual(['a', 'b', 'c'])
    expect(strSplitWords('你_啊；逼、阿,1,松嵩“av”')).toEqual(['你', '啊', '逼', '阿', '松嵩', 'av'])
    expect(strSplitWords('你_啊；逼、阿,1,松嵩“av”')).toEqual(['你', '啊', '逼', '阿', '松嵩', 'av'])
  })

  test('upperCase', () => {
    expect(upperCase('abcdefghi')).toBe('ABCDEFGHI')
    expect(upperCase('abcdefghi', [0, 1])).toBe('ABcdefghi')
    expect(upperCase('abcdefghi', /[acegi]/g)).toBe('AbCdEfGhI')
  })

  test('lowerCase', () => {
    expect(lowerCase('ABCDEFGHI')).toBe('abcdefghi')
    expect(lowerCase('ABcdefghi', [0, 1])).toBe('abcdefghi')
    expect(lowerCase('AbCdEfGhI', /[ACEGI]/g)).toBe('abcdefghi')
  })

  test('toCamelCaseName', () => {
    expect(toCamelCaseName('my_name_is')).toBe('myNameIs')
    expect(toCamelCaseName('my_name_is')).toBe('myNameIs')
    expect(toCamelCaseName('my*name+is')).toBe('myNameIs')
    expect(toCamelCaseName('my-name-is')).toBe('myNameIs')
    expect(toCamelCaseName('myNameIs')).toBe('myNameIs')
    expect(toCamelCaseName('my name is')).toBe('myNameIs')
    expect(toCamelCaseName('my name is', { firstUpperCase: true })).toBe('MyNameIs')
  })

  test('toSnakeCaseName', () => {
    expect(toSnakeCaseName('myNameIs')).toBe('my_name_is')
    expect(toSnakeCaseName('myNameIs', { upperCase: true })).toBe('MY_NAME_IS')
  })
})

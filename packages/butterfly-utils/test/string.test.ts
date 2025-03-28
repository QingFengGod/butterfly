import { expect, test, describe } from 'bun:test'
import { strSplitWords, toCamelCase } from '../src'

describe('string.util', () => {
  test('strSplitWords', () => {
    expect(strSplitWords('a-b-c')).toEqual(['a', 'b', 'c'])
    expect(strSplitWords('a-b_c1&B')).toEqual(['a', 'b', 'c', 'B'])
    expect(strSplitWords('a-b-c', /[^- ]+/g)).toEqual(['a', 'b', 'c'])
    expect(strSplitWords('你_啊；逼、阿,1,松嵩“av”')).toEqual(['你', '啊', '逼', '阿', '松嵩', 'av'])
    expect(strSplitWords('你_啊；逼、阿,1,松嵩“av”')).toEqual(['你', '啊', '逼', '阿', '松嵩', 'av'])
  })
  test('toCamelCase', () => {
    expect(toCamelCase('my_name_is')).toBe('myNameIs')
    expect(toCamelCase('my*name+is')).toBe('myNameIs')
    expect(toCamelCase('my-name-is')).toBe('myNameIs')
    expect(toCamelCase('my name is')).toBe('myNameIs')
  })
})

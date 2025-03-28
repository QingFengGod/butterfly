import { describe, expect, test } from 'bun:test'
import { trycatchWrap, tryExec } from '../src'

describe('function.util', () => {
  test('trycatchWrap', async () => {
    const fn = () => {
      return 1 + 1
    }
    const [result, error] = trycatchWrap(fn)()
    expect(result).toBe(2)
    expect(error).toBeNull()
    const fn2 = async () => {
      return Promise.resolve(1 + 1)
    }
    const [result2, error2] = await trycatchWrap(fn2)()
    expect(result2).toBe(2)
    expect(error2).toBeNull()

    const fn3 = () => {
      throw new Error('test')
    }
    const [result3, error3] = trycatchWrap(fn3)()
    expect(result3).toBe(null)
    expect(error3).toBeInstanceOf(Error)

    const fn4 = async () => {
      throw new Error('test')
    }
    const [result4, error4] = await trycatchWrap(fn4)()
    expect(result4).toBe(null)
    expect(error4).toBeInstanceOf(Error)
  })
  test('tryExec', async () => {
    const [result, error] = await tryExec(async () => {
      throw new Error('test')
    })
    expect(result).toBe(null)
    expect(error).toBeInstanceOf(Error)

    const [result2, error2] = await tryExec(async () => {
      return 1 + 1
    })
    expect(result2).toBe(2)
    expect(error2).toBeNull()

    const [result3, error3] = await tryExec(1 as any)
    expect(result3).toBe(null)
    expect(error3).toBeInstanceOf(Error)
  })
})

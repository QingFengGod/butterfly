import { describe, expect, test } from 'bun:test'
import { compose, debounce, throttle, trycatchWrap, tryExec } from '../src'
import { sleep } from 'bun'

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

  test('compose', async () => {
    const fn = compose(
      async (a: number, b: number) => a + b,
      async (a: number) => 'result：' + String(a)
    )
    const result = await fn(1, 2)
    expect(result).toBe('result：3')
    const fn2 = compose(
      (a: number, b: number) => a + b,
      (a: number) => 'result：' + String(a),
      (a: string) => a.split('：')
    )
    const result2 = fn2(1, 2)
    expect(result2).toEqual(['result', '3'])
    const fn3 = compose(
      (a: number, b: number) => a + b,
      async (a: number) => 'result：' + String(a),
      (a: string) => a.split('：')
    )
    const result3 = await fn3(1, 2)
    expect(result3).toEqual(['result', '3'])
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

import { describe, expect, test } from 'bun:test'
import { Color } from '../src'

describe('color.util', () => {
  test('uniqueArray', () => {
    const color1 = new Color('rgb(255, 255, 255)')
    expect(color1.getRgba()).toEqual({
      value: { r: 255, g: 255, b: 255, a: 1 },
      cssStr: 'rgba(255, 255, 255, 1)'
    })

    expect(color1.getHexa()).toEqual({ value: 0xffffffff, cssStr: '#ffffffff' })
    expect(color1.getHsla()).toEqual({ value: { h: 0, s: 0, l: 100, a: 1 }, cssStr: 'hsla(0, 0%, 100%, 1)' })
    expect(color1.darken(0.1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 90, a: 1 },
      cssStr: 'hsla(0, 0%, 90%, 1)'
    })
    expect(color1.darken(1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 0, a: 1 },
      cssStr: 'hsla(0, 0%, 0%, 1)'
    })
    expect(color1.lighten(0.1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 100, a: 1 },
      cssStr: 'hsla(0, 0%, 100%, 1)'
    })
    expect(color1.lighten(1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 100, a: 1 },
      cssStr: 'hsla(0, 0%, 100%, 1)'
    })

    const color2 = new Color('rgb(0, 0, 0)')
    expect(color2.getRgba()).toEqual({
      value: { r: 0, g: 0, b: 0, a: 1 },
      cssStr: 'rgba(0, 0, 0, 1)'
    })

    expect(color2.getHexa()).toEqual({ value: 0x000000ff, cssStr: '#000000ff' })
    expect(color2.getHsla()).toEqual({ value: { h: 0, s: 0, l: 0, a: 1 }, cssStr: 'hsla(0, 0%, 0%, 1)' })
    expect(color2.darken(0.1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 0, a: 1 },
      cssStr: 'hsla(0, 0%, 0%, 1)'
    })
    expect(color2.darken(1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 0, a: 1 },
      cssStr: 'hsla(0, 0%, 0%, 1)'
    })
    expect(color2.lighten(0.1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 10, a: 1 },
      cssStr: 'hsla(0, 0%, 10%, 1)'
    })
    expect(color1.lighten(1).getHsla()).toEqual({
      value: { h: 0, s: 0, l: 100, a: 1 },
      cssStr: 'hsla(0, 0%, 100%, 1)'
    })
  })
})

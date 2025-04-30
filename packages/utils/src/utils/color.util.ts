import { round } from './math.util'
import { hasProperty } from './obj.util'
import { randomNumber } from './random.util'

export type RgbObj = { r: number; g: number; b: number }
export type RgbArray = [number, number, number]
export type RgbaObj = RgbObj & { a: number }
export type RgbaArray = [number, number, number, number]
export type HslObj = { h: number; s: number; l: number }
export type HslArray = [number, number, number]
export type HslaObj = HslObj & { a: number }
export type HslaArray = [number, number, number, number]

const float = '\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))\\s*'
const rgbReg = new RegExp(`^\\s*rgb\\s*\\(${float},${float},${float}\\)\\s*$`)
/**
 * 判断是否为rgb颜色
 * @param {string} color 颜色字符串
 * @returns {boolean} 是否为rgb颜色
 */
export function isRgbColor(color: string): boolean {
  return rgbReg.test(color)
}

const rgbaReg = new RegExp(`^\\s*rgba\\s*\\(${float},${float},${float},${float}\\)\\s*$`)
/**
 * 判断是否为rgba颜色
 * @param {string} color 颜色字符串
 * @returns {boolean} 是否为rgba颜色
 */
export function isRgbaColor(color: string): boolean {
  return rgbaReg.test(color)
}

const hexReg = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
/**
 * 判断是否为十六进制颜色
 * @param {string} color 颜色字符串
 * @returns {boolean} 是否为十六进制颜色
 */
export function isHexColor(color: string): boolean {
  return hexReg.test(color)
}

const hslReg = new RegExp(`^\\s*hsl\\s*\\(${float}(deg|rad|turn)?(,|\\s)${float}(%)?(,|\\s)${float}(%)?\\)\\s*$`)
/**
 * 判断是否为hsl颜色
 * @param {string} color 颜色字符串
 * @returns {boolean} 是否为hsl颜色
 */
export function isHslColor(color: string): boolean {
  return hslReg.test(color)
}

const hslaReg = new RegExp(
  `^\\s*hsla\\s*\\(${float}(deg|rad|turn)?(,|\\s)${float}(%)?(,|\\s)${float}(%)?(,|\\s)${float}\\)\\s*$`
)
/**
 * 判断是否为hsla颜色
 * @param {string} color 颜色字符串
 * @returns {boolean} 是否为hsla颜色
 */
export function isHslaColor(color: string): boolean {
  return hslaReg.test(color)
}

export class Color {
  private _r: number
  private _g: number
  private _b: number
  private _a: number

  constructor(color: string)
  constructor(color: RgbObj)
  constructor(color: RgbaObj)
  constructor(color: HslObj)
  constructor(color: HslaObj)
  constructor(color: string | RgbObj | RgbaObj | HslObj | HslaObj) {
    let newColor: any = {}
    if (typeof color === 'string') {
      if (isRgbColor(color) || isRgbaColor(color)) {
        let [r, g, b, a] = color.replace(/(rgb|rgba)\(|\)/g, '').split(',')
        newColor.r = r
        newColor.g = g
        newColor.b = b
        newColor.a = a
      } else if (isHexColor(color)) {
        let hex = color.replace('#', '')
        if (hex.length === 3 || hex.length === 4) {
          hex = hex
            .split('')
            .map((char) => char + char)
            .join('')
        }
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        const a = parseInt(hex.slice(6, 8) || 'ff', 16)

        newColor.r = r
        newColor.g = g
        newColor.b = b
        newColor.a = a / 255
      } else if (isHslColor(color) || isHslaColor(color)) {
        let [h, s, l, a] = color.replace(/(hsl|hsla)\(|\)/g, '').split(',')
        newColor.h = h
        newColor.s = s
        newColor.l = l
        newColor.a = a
      }
    } else if (typeof color === 'object') {
      newColor = color
    }
    if (hasProperty(newColor, 'r') && hasProperty(newColor, 'g') && hasProperty(newColor, 'b')) {
      newColor.r = parseFloat(newColor.r)
      newColor.g = parseFloat(newColor.g)
      newColor.b = parseFloat(newColor.b)
    }
    if (hasProperty(newColor, 'h') && hasProperty(newColor, 's') && hasProperty(newColor, 'l')) {
      let h = parseFloat(newColor.h) / 360
      let s = parseFloat(newColor.s) / 100
      let l = parseFloat(newColor.l) / 100
      let r, g, b
      if (s === 0) {
        r = g = b = l
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = this._hueToRgb(p, q, h + 1 / 3)
        g = this._hueToRgb(p, q, h)
        b = this._hueToRgb(p, q, h - 1 / 3)
      }
      newColor.r = r * 255
      newColor.g = g * 255
      newColor.b = b * 255
    }
    newColor.a = parseFloat(newColor.a)
    newColor.a = Number.isNaN(newColor.a) ? 1 : newColor.a
    this._validate(newColor.r, newColor.g, newColor.b, newColor.a)
    this._r = round(newColor.r)
    this._g = round(newColor.g)
    this._b = round(newColor.b)
    this._a = round(newColor.a, 2)
  }

  private _hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  private _validate(r: number, g: number, b: number, a: number) {
    const arr = [r, g, b]
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === undefined || Number.isNaN(arr[i]) || arr[i] < 0 || arr[i] > 255) {
        throw new Error('Invalid color')
      }
    }
    if (a !== undefined) {
      if (Number.isNaN(a) || a < 0 || a > 1) {
        throw new Error('Invalid color')
      }
    }
  }

  static fromRgba(rgba: string | RgbObj | RgbArray | RgbaObj | RgbaArray): Color {
    if (Array.isArray(rgba)) {
      return new Color({ r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3]! })
    }
    return new Color(rgba as RgbObj)
  }

  static fromHsla(hsl: string | HslObj | HslArray | HslaObj | HslaArray): Color {
    if (Array.isArray(hsl)) {
      return new Color({ h: hsl[0], s: hsl[1], l: hsl[2], a: hsl[3]! })
    }
    return new Color(hsl as HslObj)
  }

  getRgba() {
    return {
      value: { r: this._r, g: this._g, b: this._b, a: this._a },
      cssStr: `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`
    }
  }

  getHexa() {
    const r = this._r.toString(16).padStart(2, '0')
    const g = this._g.toString(16).padStart(2, '0')
    const b = this._b.toString(16).padStart(2, '0')
    const a = round(this._a * 255)
      .toString(16)
      .padStart(2, '0')
    return {
      value: Number(`0x${r}${g}${b}${a}`),
      cssStr: `#${r}${g}${b}${a}`
    }
  }

  getHsla() {
    let r = this._r / 255
    let g = this._g / 255
    let b = this._b / 255
    let a = this._a
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    let l = (max + min) / 2
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    h = Math.round(h * 360)
    s = Math.round(s * 100)
    l = Math.round(l * 100)
    return {
      value: { h, s, l, a },
      cssStr: `hsla(${h}, ${s}%, ${l}%, ${a})`
    }
  }

  lighten(percent: number) {
    percent = Math.max(0, Math.min(percent, 1))
    const hsla = this.getHsla()
    hsla.value.l += (100 - hsla.value.l) * percent
    hsla.value.l = Math.min(hsla.value.l, 100)
    return new Color(hsla.value)
  }

  darken(percent: number) {
    percent = Math.max(0, Math.min(percent, 1))
    const hsla = this.getHsla()

    hsla.value.l -= hsla.value.l * percent
    hsla.value.l = Math.max(hsla.value.l, 0)
    return new Color(hsla.value)
  }

  saturate(percent: number) {
    percent = Math.max(0, Math.min(percent, 1))
    const hsla = this.getHsla()

    hsla.value.s += (100 - hsla.value.s) * percent
    hsla.value.s = Math.min(hsla.value.s, 100)
    return new Color(hsla.value)
  }

  desaturate(percent: number) {
    percent = Math.max(0, Math.min(percent, 1))
    const hsla = this.getHsla()
    hsla.value.s -= hsla.value.s * percent
    hsla.value.s = Math.max(hsla.value.s, 0)
    return new Color(hsla.value)
  }

  isLight() {
    const hsla = this.getHsla()
    return hsla.value.l > 50
  }

  isDark() {
    const hsla = this.getHsla()
    return hsla.value.l <= 50
  }
}

type RandomColorOptions = {
  alpha?: boolean
  type?: 'hex' | 'rgb' | 'rgba'
}
/**
 * 生成一个随机颜色
 * @param {RandomColorOptions} options object 参数配置
 * @param {boolean} [options.alpha = false] boolean 是否包含透明度
 * @param {'hex' | 'rgb'} [options.type = 'hex'] string 颜色格式
 * @returns 随机颜色
 * @example
 * randomColor() // '#000000'
 * randomColor() // '#ffffff'
 * randomColor(['#000000', '#ffffff']) // '#000000'
 * randomColor({ alpha: true }) // 'rgba(0, 0, 0, 0.5)'
 * randomColor({ type: 'rgb' }) // 'rgb(0, 0, 0)'
 * randomColor({ type: 'rgb', alpha: true }) // 'rgba(0, 0, 0, 0.5)'
 */
export function randomColor(colors?: string[]): string
export function randomColor(options?: RandomColorOptions): string
export function randomColor(options?: RandomColorOptions | string[]) {
  if (Array.isArray(options)) {
    return options[randomNumber({ min: 0, max: options.length })] as any
  } else {
    const { alpha = false, type = 'hex' } = options || {}
    const colorObj: Partial<RgbaObj> = {}
    colorObj.r = randomNumber({ min: 0, max: 256 })
    colorObj.g = randomNumber({ min: 0, max: 256 })
    colorObj.b = randomNumber({ min: 0, max: 256 })
    if (alpha) {
      colorObj.a = randomNumber({ min: 0, max: 1, isFloat: true, decimals: 2 })
    }
    const color = new Color(colorObj as RgbaObj)
    if (type === 'hex') {
      return color.getHexa().cssStr as any
    } else if (type === 'rgb') {
      return color.getRgba().cssStr as any
    } else {
      return color.getHsla().cssStr as any
    }
  }
}

export function color(): Color
export function color(color: string): Color
export function color(color: RgbObj): Color
export function color(color: RgbaObj): Color
export function color(color: HslObj): Color
export function color(color: HslaObj): Color
export function color(color?: string | RgbObj | RgbaObj | HslObj | HslaObj): Color {
  if (color === undefined) {
    const colorObj = {
      r: randomNumber({ min: 0, max: 256 }),
      g: randomNumber({ min: 0, max: 256 }),
      b: randomNumber({ min: 0, max: 256 }),
      a: randomNumber({ min: 0, max: 1, isFloat: true, decimals: 2 })
    }
    return new Color(colorObj as RgbaObj)
  }
  return new Color(color as any)
}

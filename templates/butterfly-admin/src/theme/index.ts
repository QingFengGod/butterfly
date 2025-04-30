import { color } from '@qingfeng-butterfly/utils'
export type ThemeConfig = {
  primaryColor: string
  primaryColorDeep1: string
  primaryColorDeep2: string
  primaryColorDeep3: string
  primaryColorDeep4: string
  primaryColorDeep5: string
  primaryColorHover: string
  primaryColorPressed: string
  infoColor: string
  infoColorHover: string
  infoColorPressed: string
  successColor: string
  successColorHover: string
  successColorPressed: string
  warningColor: string
  warningColorHover: string
  warningColorPressed: string
  errorColor: string
  errorColorHover: string
  errorColorPressed: string
  fontFamily: string
  pageBgColor: string
  containerColor: string
  scrollbarWidth: string
  scrollbarColor: string
  borderColor: string
}

type StatusColorKeys<Name extends string, Deep extends boolean> =
  | `${Name}Color`
  | `${Name}ColorHover`
  | `${Name}ColorPressed`
  | (Deep extends true
      ? `${Name}ColorDeep1` | `${Name}ColorDeep2` | `${Name}ColorDeep3` | `${Name}ColorDeep4` | `${Name}ColorDeep5`
      : '')

export const createStatusColor = <Name extends string, Deep extends boolean>(
  name: Name,
  originalColor: string,
  deep: Deep = false as Deep
): Record<StatusColorKeys<Name, Deep>, string> => {
  const cColor = color(originalColor)
  const deepColors: any = {}
  if (deep) {
    deepColors[`${name}ColorDeep1`] = cColor.lighten(0.1).getRgba().cssStr
    deepColors[`${name}ColorDeep2`] = cColor.lighten(0.23).getRgba().cssStr
    deepColors[`${name}ColorDeep3`] = cColor.lighten(0.37).getRgba().cssStr
    deepColors[`${name}ColorDeep4`] = cColor.lighten(0.55).getRgba().cssStr
    deepColors[`${name}ColorDeep5`] = cColor.lighten(0.8).getRgba().cssStr
  }
  return {
    [`${name}Color`]: cColor.getRgba().cssStr,
    [`${name}ColorHover`]: cColor.lighten(0.1).getRgba().cssStr,
    [`${name}ColorPressed`]: cColor.darken(0.1).getRgba().cssStr,
    ...deepColors
  }
}

export const createPressedColor = (originalColor: string) => {
  return color(originalColor).darken(0.1).getRgba().cssStr
}

export const createDeepColor = (originalColor: string, deep: number) => {
  return color(originalColor).lighten(deep).getRgba().cssStr
}

const light: ThemeConfig = {
  ...createStatusColor('primary', 'rgb(129, 11, 218)', true),
  ...createStatusColor('info', 'rgb(17, 120, 238)'),
  ...createStatusColor('success', 'rgb(24, 154, 85)'),
  ...createStatusColor('warning', 'rgb(238, 153, 17)'),
  ...createStatusColor('error', 'rgb(208, 47, 79)'),
  fontFamily: '"Noto Sans SC", "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
  pageBgColor: '#e5e8ef',
  containerColor: '#ffffff',
  scrollbarWidth: '5px',
  scrollbarColor: '#00000040',
  borderColor: '#e4e4e4'
}

const dark: ThemeConfig = {
  ...light,
  pageBgColor: '#000000',
  containerColor: '#181818',
  scrollbarColor: '#ffffff33',
  borderColor: '#ffffff17'
}

export const theme = {
  light,
  dark
}

export type ThemeConfig = Partial<{
  fontFamily: string
  pageBgColor: string
  primaryColor: string
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
}>

const light: ThemeConfig = {
  fontFamily: '"Noto Sans SC", "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif',
  pageBgColor: '#e5e8ef',
  primaryColor: '#18A058',
  primaryColorHover: '#36AD6A',
  primaryColorPressed: '#0C7A43'
}

const dark: ThemeConfig = {
  ...light,
  pageBgColor: '#181818'
}

export const themeConfig = {
  light,
  dark
}

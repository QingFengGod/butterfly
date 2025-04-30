export const RoutePath = {
  Login: { path: '/login', name: 'Login' },
  Home: { path: '/home', name: 'Home' },
  About: { path: '/about', name: 'About' }
} as const

export type RouteKey = keyof typeof RoutePath

export type RoutePathKey = (typeof RoutePath)[RouteKey]['path']
export type RouteNameKey = (typeof RoutePath)[RouteKey]['name']

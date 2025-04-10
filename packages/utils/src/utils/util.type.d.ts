export type ObjectKey = string | number | symbol
export type Fn<Args extends any[] = any[], Return = any> = (...args: Args) => Return
export type AsyncFn<Args extends any[] = any[], Return = any> = (...args: Args) => Promise<Return>
export type PickPromise<T> = T extends Promise<infer U> ? U : T
export type PickIterable<T> = T extends Iterable<infer U> ? U : T
export type Includes<T extends any[], Check> = Check extends T[number] ? true : false
export type ArrayLast<T extends any[]> = T extends [...any[], infer U] ? U : never

export type Paths<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<string, any> ? K | `${K}.${Paths<T[K]>}` : K
}[keyof T]

type A = {
  a: { b: { c: string } }
  d: { e: { f: string } }
  g: { h: [{ i: string }] }
}

type B = Paths<[{ A: 1 }]>

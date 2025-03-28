export type ObjectKey = string | number | symbol
export type Fn<Args extends any[] = any[], Return = any> = (...args: Args) => Return
export type AsyncFn<Args extends any[] = any[], Return = any> = (...args: Args) => Promise<Return>
export type PickPromise<T> = T extends Promise<infer U> ? U : T
export type PickIterable<T> = T extends Iterable<infer U> ? U : T

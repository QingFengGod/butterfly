type StorageKeys = 'user' | 'accessToken' | 'refreshToken'

type NullPartial<Obj extends Record<string, any>> = {
  [Key in keyof Obj]?: Obj[Key] extends Record<string, any> ? NullPartial<Obj[Key]> : Obj[Key] | null
}

type ApiResponse<T> = {
  code: number
  data: T
  message: string
}

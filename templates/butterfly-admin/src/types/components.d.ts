declare module 'vue' {
  interface GlobalComponents {
    BfTitle: typeof import('@/components').Title
  }
}

export {}

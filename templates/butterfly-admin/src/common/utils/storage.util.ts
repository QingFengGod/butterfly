interface StorageOpt {
  prefix: string
}

export class LocalStorage<Keys extends string> {
  private prefix = ''

  constructor(opt: StorageOpt = { prefix: 'bf' }) {
    this.prefix = opt.prefix
  }

  setItem(key: Keys, value: any) {
    const storageKey = this.prefix ? `${this.prefix}_${key}` : key
    const valueStr = JSON.stringify({ value: value || '' })
    localStorage.setItem(storageKey, valueStr)
  }

  getItem<Value>(key: Keys): Value | null {
    const storageKey = this.prefix ? `${this.prefix}_${key}` : key
    const item = localStorage.getItem(storageKey)
    if (item) {
      const result = JSON.parse(item)
      return result.value || null
    }
    return null
  }

  removeItems(keys: Array<Keys>) {
    keys.forEach((key) => {
      const storageKey = this.prefix ? `${this.prefix}_${key}` : key
      localStorage.removeItem(storageKey)
    })
  }
}

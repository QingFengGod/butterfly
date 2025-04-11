import { LocalStorage } from './utils'
import { createSafeObjGetterSetter } from '@qingfeng-butterfly/utils'
import optionUrl from '/options.json?url'
;(() => {
  window.$BF = {
    storage: new LocalStorage(),
    env: (key: keyof BFImportMetaEnv) => {
      if (key === 'BF_AUTH_ENABLED') return Boolean(import.meta.env[key])
      return import.meta.env[key]
    },
    option: () => {
      return [] as any
    }
  }
  fetch(optionUrl)
    .then((res) => res.json())
    .then((res) => {
      const [getOptionByPath] = createSafeObjGetterSetter<Record<string, any>>(res)
      $BF.option = getOptionByPath as any
    })
})()

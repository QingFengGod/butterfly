import type { DialogApi, MessageApi, NotificationApi } from 'naive-ui'
import type { Paths, PathValue } from 'ts-essentials'
import type { LocalStorage } from '@/common/utils'

type Options = typeof import('./../../public/options.json')

type SelectOptionItem = { label: string; value: any; children?: Array<SelectOptionItem> }
interface BFGlobalApi {
  storage: LocalStorage<StorageKeys>
  env: <Key extends keyof BFImportMetaEnv>(_key: Key) => BFImportMetaEnv[Key]
  option: <Key extends Paths<Options>, DefaultValue extends PathValue<Options, Key>>(
    _path: Key,
    _defaultValue?: DefaultValue
  ) => PathValue<Options, Key> | DefaultValue
}

interface UiApi {
  msg: MessageApi
  dialog: DialogApi
  notify: NotificationApi
}

declare global {
  declare const $BF: BFGlobalApi
  declare const $UI: UiApi
  interface Window {
    $BF: BFGlobalApi
    $UI: UiApi
  }
}

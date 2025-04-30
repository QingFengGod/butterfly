import { create, NButton, NCheckbox, NCheckboxGroup, NFlex, NForm, NFormItem, NFormItemGi, NGi, NGrid, NInput } from 'naive-ui'
import { upperCase } from '@qingfeng-butterfly/utils'
import type { App } from 'vue'
import Flex from './layout/Flex.vue'
import Grid from './layout/Grid.vue'
import GridItem from './layout/GridItem.vue'
import Icon from './Icon/Icon.vue'
import CollapseAside from './CollapseAside/CollapseAside.vue'
import ConfigProvider from './ConfigProvider/ConfigProvider.vue'
import Permission from './Permission/Permission'

export const NaiveUI = {
  install: (app: App) => {
    const naiveUi = create({
      components: [NFlex, NButton, NForm, NFormItem, NGrid, NGi, NFormItemGi, NInput, NCheckboxGroup, NCheckbox]
    })
    app.use(naiveUi)
  }
}

export const butterflyComponents = () => {
  const prefix = upperCase($BF.env('BF_PREFIX'), [0])
  return {
    install: (app: App) => {
      app.component(`${prefix}Flex`, Flex)
      app.component(`${prefix}Grid`, Grid)
      app.component(`${prefix}GridItem`, GridItem)
      app.component(`${prefix}Icon`, Icon)
      app.component(`${prefix}CollapseAside`, CollapseAside)
      app.component(`${prefix}Permission`, Permission)
    }
  }
}

export {
  ConfigProvider,
  Icon as BfIcon,
  Flex as BfFlex,
  Grid as BfGrid,
  GridItem as BfGridItem,
  CollapseAside as BfCollapseAside,
  Permission as BfPermission
}

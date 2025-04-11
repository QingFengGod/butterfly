<template>
  <n-config-provider
    :theme-overrides="themeOverrides"
    inline-theme-disabled
    :theme="$props.theme === 'light' ? lightTheme : darkTheme"
  >
    <n-global-style />
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <global-api>
            <slot />
          </global-api>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
defineOptions({ name: 'ConfigProvider' })
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NGlobalStyle,
  lightTheme,
  darkTheme
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import GlobalApi from './GlobalApi.vue'
const $props = withDefaults(
  defineProps<{
    theme?: 'light' | 'dark'
  }>(),
  {
    theme: 'light'
  }
)
const prefix = $BF.env('BF_PREFIX')

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily: `var(--${prefix}-font-family)`,
    primaryColor: `var(--${prefix}-primary-color)`,
    primaryColorHover: `var(--${prefix}-primary-color-hover)`,
    primaryColorPressed: `var(--${prefix}-primary-color-pressed)`,
    primaryColorSuppl: `var(--${prefix}-primary-color-suppl)`
  }
}
</script>

<style scoped lang="scss"></style>

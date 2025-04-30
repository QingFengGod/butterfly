<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    inline-theme-disabled
    :theme="$props.theme === 'light' ? lightTheme : darkTheme"
    class="w-full h-full"
    :locale="zhCN"
    :date-locale="dateZhCN"
  >
    <NGlobalStyle />
    <NMessageProvider>
      <NNotificationProvider>
        <NDialogProvider>
          <GlobalApi>
            <slot />
          </GlobalApi>
        </NDialogProvider>
      </NNotificationProvider>
    </NMessageProvider>
  </NConfigProvider>
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
  darkTheme,
  zhCN,
  dateZhCN
} from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import GlobalApi from './GlobalApi.vue'
import { useConfigStore } from '@/store'
import { computed } from 'vue'
const $props = withDefaults(
  defineProps<{
    theme?: 'light' | 'dark'
  }>(),
  {
    theme: 'light'
  }
)
const configStore = useConfigStore()

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  return {
    common: {
      fontFamily: 'var(--bf-font-family)',
      fontSize: '1.4rem',
      primaryColor: configStore.theme.primaryColor,
      primaryColorHover: configStore.theme.primaryColorHover,
      primaryColorPressed: configStore.theme.primaryColorPressed,
      primaryColorSuppl: configStore.theme.primaryColorHover,
      successColor: configStore.theme.successColor,
      successColorHover: configStore.theme.successColorHover,
      successColorPressed: configStore.theme.successColorPressed,
      successColorSuppl: configStore.theme.successColorHover,
      errorColor: configStore.theme.errorColor,
      errorColorHover: configStore.theme.errorColorHover,
      errorColorPressed: configStore.theme.errorColorPressed,
      errorColorSuppl: configStore.theme.errorColorHover,
      warningColor: configStore.theme.warningColor,
      warningColorHover: configStore.theme.warningColorHover,
      warningColorPressed: configStore.theme.warningColorPressed,
      warningColorSuppl: configStore.theme.warningColorHover,
      infoColor: configStore.theme.infoColor,
      infoColorHover: configStore.theme.infoColorHover,
      infoColorPressed: configStore.theme.infoColorPressed,
      infoColorSuppl: configStore.theme.infoColorHover,
      scrollbarColor: 'var(--bf-scrollbar-color)',
      scrollbarWidth: 'var(--bf-scrollbar-width)',
      scrollbarHeight: 'var(--bf-scrollbar-width)'
    }
  }
})
</script>

<style scoped lang="scss"></style>

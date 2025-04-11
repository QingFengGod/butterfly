<template>
  <config-provider :theme="configStore.themeMode">
    <router-view />
  </config-provider>
</template>

<script setup lang="ts">
import { ConfigProvider } from './components'
import { useConfigStore } from './store'

const configStore = useConfigStore()
configStore.init()
</script>

<style scoped></style>

<template>
  <ConfigProvider :theme="configStore.themeMode">
    <RouterView v-slot:default="{ Component }">
      <Transition :name="configStore.togglePageClassName">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ConfigProvider } from './components'
import { useConfigStore } from './store'

const configStore = useConfigStore()
configStore.init()
</script>

<style scoped></style>

<template>
  <div class="w-full h-full scroll">
    <component :is="layouts[configStore.layoutKey]" />
  </div>
</template>

<script setup lang="ts">
import type { LayoutKeys } from '@/store'
import { useConfigStore } from '@/store'
import type { Component } from 'vue'
import { defineAsyncComponent } from 'vue'
defineOptions({ name: 'BfLayout' })

const configStore = useConfigStore()

const layouts: Record<LayoutKeys, Component> = {
  'bf-classic': defineAsyncComponent(() => import('./layout/BfClassic.vue')),
  'bf-horizontal': defineAsyncComponent(() => import('./layout/BfHorizontal.vue'))
}
</script>

<style scoped lang="scss"></style>

<template>
  <div
    class="grid scroll"
    :style="{
      width: $props.width,
      height: $props.height,
      'grid-template-rows': $props.rowTemp,
      'grid-template-columns': $props.colTemp,
      'row-gap': $props.rowGap,
      'column-gap': $props.colGap,
      'grid-auto-columns': $props.autoColumns,
      'grid-auto-rows': $props.autoRows,
      'grid-auto-flow': $props.autoFlow
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Grid' })
const $props = withDefaults(
  defineProps<{
    width?: string
    height?: string
    rowTemp?: string
    colTemp?: string
    autoRows?: string
    autoColumns?: string
    rowGap?: string
    colGap?: string
    autoFlow?: 'column' | 'dense' | 'inherit' | 'initial' | 'revert' | 'revert-layer' | 'row' | 'unset'
  }>(),
  {
    width: '100%',
    height: '100%',
    rowTemp: '1fr',
    colTemp: '1fr',
    rowGap: '20px',
    colGap: '20px'
  }
)
</script>

<style scoped lang="scss"></style>

<template>
  <div class="min-w-0 min-h-0" :style="styles">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
defineOptions({ name: ' GridItem' })
type FlexDirection = 'column' | 'column-reverse' | 'row' | 'row-reverse'
type FlexJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
type FlexAlign = 'stretch' | 'baseline' | 'start' | 'end' | 'center' | 'flex-end' | 'flex-start'
const $props = withDefaults(
  defineProps<{
    area?: string
    gridColumn?: string
    gridRow?: string
    flex?: 'flex-row' | 'flex-col'
    direction?: FlexDirection
    justify?: FlexJustify
    align?: FlexAlign
    areaDesc?: string
  }>(),
  {
    area: 'auto/auto/auto/auto'
  }
)

const styles = computed(() => {
  const style: CSSProperties = {
    'grid-area': $props.area,
    'grid-column': $props.gridColumn,
    'grid-row': $props.gridRow,
    'flex-direction': $props.direction,
    'justify-content': $props.justify,
    'align-items': $props.align
  }
  if (style['grid-area']) {
    delete style['grid-column']
    delete style['grid-row']
  }
  if (style['grid-column'] || style['grid-row']) {
    delete style['grid-area']
  }
  if ($props.flex || $props.justify || $props.align || $props.direction) {
    style.display = 'flex'
  }
  if ($props.flex === 'flex-col') {
    style['flex-direction'] = 'column'
  }
  return style
})
</script>

<style scoped></style>

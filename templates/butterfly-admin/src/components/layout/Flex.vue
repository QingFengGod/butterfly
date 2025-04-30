<template>
  <div :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

defineOptions({ name: 'BFFlex' })
const $props = withDefaults(
  defineProps<{
    align?: CSSProperties['align-items']
    inline?: boolean
    justify?: CSSProperties['justify-content']
    size?: number | [number, number] | 'small' | 'medium' | 'large'
    wrap?: boolean
    vertical?: boolean
    reverse?: boolean
  }>(),
  {
    wrap: true,
    justify: 'start',
    size: () => [8, 12]
  }
)

const sizeMap = {
  small: [4, 8],
  medium: [8, 12],
  large: [12, 16],
  default: [8, 12]
} as Record<string, [number, number]>

const style = computed<CSSProperties>(() => {
  let gap: [number, number] = [0, 0]
  if (Array.isArray($props.size)) {
    gap = $props.size
  } else if (typeof $props.size === 'number') {
    gap = [$props.size, $props.size]
  } else {
    gap = sizeMap[$props.size] || sizeMap.default
  }

  let flexDirection: CSSProperties['flex-direction']
  if ($props.vertical && !$props.reverse) {
    flexDirection = 'column'
  } else if ($props.vertical && $props.reverse) {
    flexDirection = 'column-reverse'
  } else if (!$props.vertical && $props.reverse) {
    flexDirection = 'row-reverse'
  } else {
    flexDirection = 'row'
  }
  return {
    display: $props.inline ? 'inline-flex' : 'flex',
    flexDirection,
    alignItems: $props.align,
    justifyContent: $props.justify,
    flexWrap: !$props.wrap || $props.vertical ? 'nowrap' : 'wrap',
    gap: `${gap[0]}px ${gap[1]}px`
  }
})
</script>

<style scoped></style>

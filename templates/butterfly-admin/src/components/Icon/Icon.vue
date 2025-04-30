<template>
  <i
    :class="['bf-icon', iconInfo.loader === 'svg' ? '' : iconInfo.name]"
    :style="{
      color: $props.color,
      '--icon-size': $props.size
    }"
  >
    <slot>
      <svg aria-hidden="true" v-if="iconInfo.loader === 'svg'">
        <use :xlink:href="iconInfo.name" :fill="$props.color" :style="$props.svgVars" />
      </svg>
    </slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'Icon' })
const $props = withDefaults(
  defineProps<{
    name: string
    color?: string
    size?: string
    svgVars?: Record<`--${string}`, string>
  }>(),
  {
    size: '23px',
    name: '',
    svgVars: () => ({})
  }
)

const iconInfo = computed(() => {
  if ($props.name.substring(0, 4) === 'svg:') {
    return {
      loader: 'svg',
      name: '#svg-' + $props.name.replace('svg:', '')
    }
  }
  return {
    loader: 'class',
    name: $props.name
  }
})
</script>

<style>
.bf-icon {
  width: var(--icon-size);
  height: var(--icon-size);
  line-height: var(--icon-size);
  text-align: center;
  display: inline-block;
  position: relative;
  fill: currentColor;
  font-size: var(--icon-size);
  vertical-align: -25%;
}

.bf-icon svg {
  width: var(--icon-size);
  height: var(--icon-size);
}
</style>

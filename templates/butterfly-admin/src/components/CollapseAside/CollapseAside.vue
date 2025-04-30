<template>
  <div class="collapse-aside-container" :class="styled.containerClass" :style="styled.containerStyle">
    <div class="w-full h-full relative">
      <div class="w-full h-full scroll"> <slot :collapsed="collapsed" /> </div>
      <slot name="trigger" :change-collapsed="changeCollapsed">
        <div
          class="trigger-icon absolute w-30px h-30px b-all flex-center rd-full bg-container opacity-0"
          :style="styled.iconStyle"
          @click="changeCollapsed"
        >
          <BfIcon name="i-line-md:chevron-small-right" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'CollapseAside' })
const $props = withDefaults(
  defineProps<{
    position?: 'left' | 'right' | 'top' | 'bottom'
    width?: number | string
    height?: number | string
    collapsedWidth?: number
    collapsedHeight?: number
    triggerIconName?: string
  }>(),
  {
    collapsedWidth: 0,
    collapsedHeight: 0,
    position: 'left',
    triggerIconName: 'svg:arrow-left'
  }
)

const collapsed = defineModel<boolean>('collapsed', {
  required: false,
  default: false
})
const styled = computed(() => {
  let width = $props.width,
    height = $props.height,
    containerClass = [],
    iconRotate = '0deg',
    iconLeft = '0px',
    iconTop = '0px'
  switch ($props.position) {
    case 'left':
      width = collapsed.value ? $props.collapsedWidth + 'px' : $props.width || '280px'
      height = $props.height || '100%'
      iconRotate = collapsed.value ? '0deg' : '180deg'
      containerClass.push('b-r')
      iconLeft = width == '0px' ? '0px' : 'calc(100% - 15px)'
      iconTop = 'calc(50% - 15px)'
      break
    case 'right':
      width = collapsed.value ? $props.collapsedWidth + 'px' : $props.width || '280px'
      height = $props.height || '100%'
      iconRotate = collapsed.value ? '180deg' : '0deg'
      containerClass.push('b-l')
      iconLeft = width == '0px' ? '-30px' : '-15px'
      iconTop = 'calc(50% - 15px)'
      break
    case 'top':
      width = $props.width || '100%'
      height = collapsed.value ? $props.collapsedHeight + 'px' : $props.height || '280px'
      iconRotate = collapsed.value ? '90deg' : '-90deg'
      containerClass.push('b-b')
      iconLeft = 'calc(50% - 15px)'
      iconTop = height == '0px' ? '0px' : 'calc(100% - 15px)'
      break
    case 'bottom':
      width = $props.width || '100%'
      height = collapsed.value ? $props.collapsedHeight + 'px' : $props.height || '280px'
      iconRotate = collapsed.value ? '-90deg' : '90deg'
      containerClass.push('b-t')
      iconLeft = 'calc(50% - 15px)'
      iconTop = height == '0px' ? '-30px' : '-15px'
      break
  }
  return {
    containerClass: containerClass,
    containerStyle: { 
      width: typeof width === 'number' ? width + 'px' : width, 
      height: typeof height === 'number' ? height + 'px' : height, 
      transition: 'width 0.3s ease-in-out, height 0.3s ease-in-out'
    },
    iconStyle: {
      transform: `rotate(${iconRotate})`,
      left: iconLeft,
      top: iconTop,
      opacity: width == '0px' ? 1 : undefined,
      transition: 'transform 0.3s ease-in-out,left 0.3s ease-in-out,top 0.3s ease-in-out'
    }
  }
})
const changeCollapsed = () => {
  collapsed.value = !collapsed.value
}
</script>

<style scoped>
.collapse-aside-container:hover .trigger-icon {
  opacity: 1;
}
</style>

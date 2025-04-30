<template>
  <BfFlex
    class="bg-#f1f3f6 dark:bg-container b-all rd-3px relative"
    :class="sizeMap[size]"
    align="center"
    v-resize="handleResize"
  >
    <div class="relative bg-success h-full" :style="{ width: `${width}px` }" :class="[transition ? 'transition-width' : '']">
      <div
        class="h-full px-1rem bg-container cursor-grab flex-center absolute top-0 right-0 z-1"
        :class="[pass ? '' : 'b-r']"
        @mousedown="handleMouseDown"
        ref="sliderEl"
        :style="{ width: `${sliderActionWidth}px` }"
      >
        <BfIcon :name="pass ? 'i-prime:check' : 'i-prime:angle-double-right'" />
      </div>
    </div>
    <div v-shine class="absolute top-0 h-full flex-center w-full z-0">
      {{ pass ? '验证成功' : '请按住滑块拖到最右边' }}
    </div>
  </BfFlex>
</template>

<script setup lang="ts">
import type { DResizeSize } from '@/common/directives'
import { ref, useTemplateRef } from 'vue'

defineOptions({ name: 'SliderCaptcha' })

const { size = 'middle' } = defineProps<{
  size?: 'small' | 'middle' | 'large'
}>()

const pass = defineModel<boolean>('pass', { required: false, default: false })
const $emits = defineEmits<{
  pass: []
}>()

const transition = ref(false)

const sizeMap = {
  small: ['w-full h-28px'],
  middle: ['w-full h-34px'],
  large: ['w-full h-40px']
}

const sliderEl = useTemplateRef<HTMLElement>('sliderEl')
let containerWidth = 0
const handleResize = ({ contentBoxSize }: DResizeSize) => {
  containerWidth = contentBoxSize.width
  if (pass.value) {
    width.value = containerWidth
  }
}
let sliderActionWidth = 50
const width = ref(sliderActionWidth)
const handleMouseDown = () => {
  if (pass.value) return
  const onMouseMove = (e: MouseEvent) => {
    width.value += e.movementX
    if (width.value < sliderActionWidth) {
      width.value = sliderActionWidth
      return
    }
    if (width.value > containerWidth) {
      pass.value = true
      width.value = containerWidth
      $emits('pass')
    }
  }
  const onMouseUp = () => {
    if (width.value >= containerWidth) {
      pass.value = true
      $emits('pass')
    } else {
      transition.value = true
      width.value = sliderActionWidth
      setTimeout(() => {
        transition.value = false
      }, 300)
    }

    window.removeEventListener('mousemove', onMouseMove as any)
    window.removeEventListener('mouseup', onMouseUp as any)
  }
  window.addEventListener('mousemove', onMouseMove as any)
  window.addEventListener('mouseup', onMouseUp as any)
}
</script>

<style scoped></style>

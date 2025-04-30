<template>
  <BfFlex align="center" justify="center">
    <BfIcon
      v-if="$props.icon"
      :name="$props.icon"
      color="var(--bf-primary-color)"
      :size="$props.iconSize"
      v-animate="{
        keyframes: [{ transform: 'scaleX(0.9) ' }, { transform: 'scaleX(1.1)' }, { transform: 'scaleX(0.9) ' }],
        delay: 500,
        duration: 2000,
        easing: 'linear',
        iterations: Infinity
      }"
    />
    <img
      v-if="$props.image"
      :src="$props.image"
      :width="$props.imgSize"
      :height="$props.imgSize"
      :style="{ width: $props.imgSize, height: $props.imgSize }"
    />
    <span v-if="$props.text" class="font-bold" :style="{ fontSize: $props.textSize }">{{ $props.text }}</span>
  </BfFlex>
</template>

<script setup lang="ts">
defineOptions({ name: 'Logo' })
const $props = withDefaults(
  defineProps<{
    text?: string
    icon?: string
    image?: string
    textSize?: string
    imgSize?: string
    iconSize?: string
  }>(),
  {
    text: '',
    icon: '',
    image: '',
    iconSize: '3rem',
    imgSize: '3rem',
    textSize: '2rem'
  }
)
</script>

<style scoped lang="scss"></style>

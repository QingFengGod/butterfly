<template>
  <div class="w-full h-full flex flex-col gap-4">
    <BfFlex class="w-full" v-for="(colorArr, index) in colors" :key="index">
      <div v-for="color in colorArr" :key="color.name">
        <div class="w-10rem h-5rem" :style="{ backgroundColor: color.bg }" />
        <p class="w-10rem">{{ color.name }}</p>
      </div>
    </BfFlex>
    <NButton type="primary">按钮</NButton>
    <NButton type="success">按钮</NButton>
    <NButton type="info">按钮</NButton>
    <NButton type="warning">按钮</NButton>
    <NButton type="error">按钮</NButton>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'index' })
import { NButton } from 'naive-ui'

const colors = [
  [
    { name: 'primary', bg: 'var(--bf-primary-color)' },
    { name: 'primaryPressed', bg: 'var(--bf-primary-color-pressed)' },
    { name: 'primaryHover', bg: 'var(--bf-primary-color-hover)' },
    { name: 'primaryDeep1', bg: 'var(--bf-primary-color-deep-1)' },
    { name: 'primaryDeep2', bg: 'var(--bf-primary-color-deep-2)' },
    { name: 'primaryDeep3', bg: 'var(--bf-primary-color-deep-3)' },
    { name: 'primaryDeep4', bg: 'var(--bf-primary-color-deep-4)' },
    { name: 'primaryDeep5', bg: 'var(--bf-primary-color-deep-5)' }
  ],
  [
    { name: 'success', bg: 'var(--bf-success-color)' },
    { name: 'successPressed', bg: 'var(--bf-success-color-pressed)' },
    { name: 'successHover', bg: 'var(--bf-success-color-hover)' }
  ],
  [
    { name: 'info', bg: 'var(--bf-info-color)' },
    { name: 'infoPressed', bg: 'var(--bf-info-color-pressed)' },
    { name: 'infoHover', bg: 'var(--bf-info-color-hover)' }
  ]
]
</script>

<style scoped lang="scss"></style>

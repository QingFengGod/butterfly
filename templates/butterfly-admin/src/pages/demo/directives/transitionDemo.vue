<template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="w-50% min-w-60rem h-50% min-h-40rem">
      <div class="h-30rem b-all p-2rem">
        <div v-for="item in testTransitionList" :key="item">
          <div v-transition="item" v-if="show" class="w-fit">{{ item }}</div>
        </div>
      </div>
      <NButton type="primary" @click="show = !show"> 切换 </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StringTransition } from '@/common/directives'
import { ref } from 'vue'
import { NButton } from 'naive-ui'

defineOptions({ name: 'transitionDemo' })
const show = ref(true)
const testTransitionList = ref<StringTransition[]>([
  'fadeInOut',
  'slideInOutLeft',
  'slideInOutRight',
  'slideInOutUp',
  'slideInOutDown',
  'scaleMinInOut',
  'scaleMaxInOut'
])
</script>

<style scoped lang="scss"></style>

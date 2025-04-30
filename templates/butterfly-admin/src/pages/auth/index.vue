<template>
  <BfFlex class="w-full h-full bg-page relative" :size="0">
    <Logo class="absolute top-2rem left-2rem z-1" :text="configStore.appTitle" icon="svg:logo" v-transition="'slideInOutLeft'" />
    <BfFlex class="w-full h-full left-bg absolute top-0 left-0 z-0" vertical justify="center" align="center" />
    <BfFlex
      class="absolute top-0 left-0 z-1 w-sub-100%-60rem h-90%"
      justify="center"
      align="center"
      vertical
      v-transition="'slideInOutLeft'"
    >
      <BfIcon
        name="svg:login-bg"
        size="38rem"
        v-animate="{
          keyframes: [{ transform: 'translateY(0)' }, { transform: 'translateY(20px)' }, { transform: 'translateY(0)' }],
          duration: 2000,
          delay: 500,
          iterations: Infinity,
          easing: 'ease-in-out'
        }"
      />
      <div class="text-title2"> 现代化中后台管理系统</div>
      <div class="text-title4"> 为开发者打造高效便捷的项目开发体验 </div>
    </BfFlex>
    <BfFlex class="w-60rem bg-container h-full absolute top-0 right-0 p-2rem" vertical justify="center">
      <LoginForm />
    </BfFlex>
  </BfFlex>
</template>

<script setup lang="ts">
import Logo from '@/layouts/components/Logo.vue'
import { useConfigStore } from '@/store'
import LoginForm from './components/LoginForm.vue'
const configStore = useConfigStore()
</script>

<style scoped>
.left-bg {
  background-image: linear-gradient(
    150deg,
    var(--bf-page-bg-color) 30%,
    var(--bf-primary-color-deep-5) 40%,
    var(--bf-page-bg-color) 65%
  );
  filter: blur(100px);
}
.dark .left-bg {
  filter: blur(200px);
}
</style>

<template>
  <div class="flex-1"> HeaderToolbar </div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/store'
import { nextTick } from 'vue'

defineOptions({ name: 'HeaderToolbar' })

const configStore = useConfigStore()
const startToggleViewTransition = (e: MouseEvent) => {
  if (!document.startViewTransition) {
    configStore.changeTheme()
    return
  }
  const x = e.clientX
  const y = e.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const transition = document.startViewTransition(async () => {
    configStore.changeTheme()
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    console.log(configStore.themeMode === 'dark' ? clipPath.reverse() : clipPath)

    document.documentElement.animate(
      {
        clipPath: configStore.themeMode === 'dark' ? clipPath.reverse() : clipPath
      },
      {
        duration: 500,
        easing: 'ease-in',
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}
window.addEventListener('click', startToggleViewTransition)
</script>

<style scoped lang="scss"></style>

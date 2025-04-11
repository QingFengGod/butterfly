<template>
  <slot />
</template>

<script setup lang="ts">
import { useDialog, useMessage, useNotification } from 'naive-ui'

defineOptions({ name: 'GlobalApi' })
const msg = useMessage()
const dialog = useDialog()
const notify = useNotification()

window.$UI = {
  msg,
  dialog,
  notify
}
</script>

<style scoped lang="scss"></style>

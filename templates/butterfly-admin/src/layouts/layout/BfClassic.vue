<template>
  <BfGrid row-temp="50px 1fr" col-temp="max-content 1fr" row-gap="0" col-gap="0" class="relative">
    <BfGridItem area="1/1/3/2">
      <BfCollapseAside v-model:collapsed="collapsed" class="b-r" :collapsed-width="50">
        <Logo class="w-full h-50px" :text="collapsed ? '' : configStore.appTitle" icon="svg:vue" />
        <MenuList style="height: calc(100% - 50px)" />
      </BfCollapseAside>
    </BfGridItem>
    <BfGridItem class="b-b" area="1/2/2/3" justify="space-between">
      <HeaderToolbar />
    </BfGridItem>
    <BfGridItem area="2/2/3/3">
      <RouterView />
    </BfGridItem>
  </BfGrid>
</template>

<script setup lang="ts">
import { useConfigStore } from '@/store'
import Logo from '../components/Logo.vue'
import HeaderToolbar from '../components/HeaderToolbar.vue'
import MenuList from '../components/MenuList.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
defineOptions({ name: 'BfClassic' })
const configStore = useConfigStore()
const collapsed = ref(false)

const router = useRouter()
router.removeRoute('About')
console.log(router.getRoutes())
</script>

<style scoped></style>

<template>
  <div class="px-8rem">
    <div class="text-title3">登录</div>
    <div class="text-desc mb-3rem">请输入您的账户信息</div>
    <NForm :model="formData" :rules="rules" :show-label="false" ref="formRef">
      <NFormItem path="username">
        <NInput v-model:value="formData.username" placeholder="请输入用户名" />
      </NFormItem>
      <NFormItem path="password">
        <NInput v-model:value="formData.password" type="password" placeholder="请输入密码" show-password-on="mousedown" />
      </NFormItem>
      <SliderCaptcha v-model:pass="formData.isPass" />
      <BfFlex class="my-2rem" justify="space-between">
        <NCheckbox v-model:checked="formData.isPass">记住密码</NCheckbox>
        <NButton type="primary" text>忘记密码</NButton>
      </BfFlex>
      <NButton class="w-full" type="primary" @click="login"> 登录 </NButton>
      <NDivider />
      <div class="flex-center"> 还没有账号？<span class="text-primary cursor-pointer">去注册</span> </div>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import { useForm } from '@/common/hooks'
import SliderCaptcha from './SliderCaptcha.vue'
import { NDivider } from 'naive-ui'
import { usePermissionStore } from '@/store'
import { loginReq } from '../service'
import { useRouter } from 'vue-router'

defineOptions({ name: 'LoginForm' })

type LoginFornData = {
  username: string
  password: string
  isPass: boolean
  remember: boolean
}

const [formData, rules, loginFormInst] = useForm<LoginFornData>({
  data: {
    isPass: false
  },
  rules: {
    username: { required: true, message: '请输入用户名' },
    password: { required: true, message: '请输入密码' }
  }
})
const permissionStore = usePermissionStore()

const router = useRouter()

const login = async () => {
  const errors = await loginFormInst.validate()
  if (errors) return
  const [result] = await loginReq({
    username: formData.value.username,
    password: formData.value.password
  })
  if (result) {
    permissionStore.setTokens(result)
    router.replace('/home')
  }
}
</script>

<style scoped lang="scss"></style>

<template>
  <h1 class="text-center text-2xl font-bold mb-4 mt-6">登录</h1>
  <n-form
    ref="formRef"
    :rules="rules"
    :model="user"
    label-placement="left"
    class="mt-10"
  >
    <n-form-item path="username">
      <n-input v-model:value="user.userName" placeholder="输入账号">
        <template #prefix>
          <n-icon :component="UserOutlined" />
        </template>
      </n-input>
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="user.password"
        show-password-on="click"
        type="password"
        :input-props="inputProps"
        placeholder="输入密码"
      >
        <template #prefix>
          <n-icon :component="LockOutlined" />
        </template>
      </n-input>
    </n-form-item>
    <div class="mt-4 mb-6 text-xs text-gray-400 flex justify-end items-center">
      <div class="font-light">忘记密码</div>
    </div>
    <NFormItem class="text-center flex">
      <n-button class="flex-grow" size="large" type="info" @click="login"
        >登录
      </n-button>
    </NFormItem>
  </n-form>
  <slot></slot>
  <div class="flex items-center justify-centeru">
    <div class="border-t w-full border-gray-300"></div>
    <div class="w-full text-center text-sm text-gray-600">第三方登录</div>
    <div class="border-t w-full border-gray-300"></div>
  </div>
  <!--          <div class="flex items-center justify-center mt-6">-->
  <n-space align="center" justify="center" class="mt-6 mb-2">
    <n-button type="info" round disabled>QQ登录</n-button>
    <n-button class="ml-5" round disabled type="success">微信登录</n-button>
  </n-space>
</template>

<script lang="ts">
  import {
    InputHTMLAttributes,
    onActivated,
    onDeactivated,
    onUnmounted,
    reactive,
    ref
  } from 'vue'
  import { loginApi } from '@/api/user'
  import { userStore } from '@/store/modules/user'
  import {
    FormRules,
    FormItemRule,
    NButton,
    NForm,
    NFormItem,
    NIcon,
    NInput,
    FormInst,
    NSpace
  } from 'naive-ui'
  import { LockOutlined, UserAddOutlined, UserOutlined } from '@vicons/antd'
  import { useRoute, useRouter } from 'vue-router'

  export default {
    components: {
      NInput,
      NForm,
      NFormItem,
      NButton,
      NIcon,
      NSpace
    },
    setup() {
      // console.log(useRoute().query)
      const route = useRoute()
      const router = useRouter()
      const store = userStore()
      const user = reactive({
        userName: '',
        password: ''
      })
      const formRef = ref<FormInst | null>(null)
      const rules = {
        // user: {
        userName: {
          required: true,
          validator: (rule: FormItemRule, value: any): Boolean | Error => {
            if (value && value.length < 4) {
              return new Error('请输入正确的账号')
            }
            return true
          },
          // message: '请输入账号',
          trigger: 'blur'
        },
        password: {
          required: true,
          validator: (rule: FormItemRule, value: any): boolean | Error => {
            let reg = /^(?=\S*[a-z])(?=\S*\d)\S{8,}$/
            if (!reg.test(value)) {
              return new Error('请输入正确的密码')
            }
            return true
          },
          trigger: ['blur']
        }
        // },
      } as FormRules
      const methods = {
        async login(e: Event) {
          e.preventDefault()
          let errors = await formRef.value?.validate()

          if (!errors) {
            const res = await loginApi(user)

            store.setToken(res.data.token)
            await store.setUser()
            window.$message.success('登录成功')
            await router.replace(route.redirectedFrom?.fullPath || '/dashboard')
          }
        }
      }
      const inputProps: InputHTMLAttributes = {
        autocomplete: 'on'
      }
      // 监听回车事件
      const handleEnter = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          methods.login(e)
        }
      }
      // keep-alive 有两个生命周期钩子，activated 和 deactivated
      onActivated(() => {
        window.addEventListener('keydown', handleEnter)
      })

      // keep-alive 时，卸载组件时，移除事件监听
      onDeactivated(() => {
        window.removeEventListener('keydown', handleEnter)
      })
      return {
        user,
        ...methods,
        UserOutlined,
        LockOutlined,
        UserAddOutlined,
        rules,
        formRef,
        inputProps
      }
    }
  }
</script>

<style lang="scss" scoped></style>

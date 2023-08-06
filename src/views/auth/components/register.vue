<template>
  <h1 class="text-center text-2xl font-bold mb-4 mt-6">注册</h1>
  <n-form
    ref="formRef"
    :rules="rules"
    :model="user"
    label-placement="left"
    class="mt-10"
  >
    <NFormItem path="email">
      <n-input v-model:value="user.email" placeholder="输入邮箱">
        <template #prefix>
          <n-icon :component="UserOutlined" />
        </template>
      </n-input>
    </NFormItem>
    <NFormItem path="nickName">
      <n-input v-model:value="user.userName" placeholder="输入用户名">
        <template #prefix>
          <n-icon :component="UserOutlined" />
        </template>
      </n-input>
    </NFormItem>
    <NFormItem path="password">
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
    </NFormItem>
    <NFormItem path="confirmPassword">
      <n-input
        v-model:value="user.confirmPassword"
        show-password-on="click"
        type="password"
        :input-props="inputProps"
        placeholder="确认密码"
      >
        <template #prefix>
          <n-icon :component="LockOutlined" />
        </template>
      </n-input>
    </NFormItem>

    <div class="text-center flex">
      <n-button class="flex-grow" size="large" type="info" @click="login"
        >注册
      </n-button>
    </div>
    <div class="text-center mt-6 mb-2 flex">
      <n-button class="flex-grow" ghost size="large" @click="back"
        >返回
      </n-button>
    </div>
  </n-form>
</template>

<script lang="ts">
  import { InputHTMLAttributes, reactive, ref } from 'vue'
  import { registerApi } from '@/api/user'
  import {
    FormRules,
    FormItemRule,
    NButton,
    NForm,
    NFormItem,
    NIcon,
    NInput,
    useMessage,
    FormInst
  } from 'naive-ui'
  import { LockOutlined, UserAddOutlined, UserOutlined } from '@vicons/antd'

  export default {
    components: {
      NInput,
      NForm,
      NFormItem,
      NButton,
      NIcon
    },
    props: {
      isLogin: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:is-login'],
    setup(props: any, ctx: any) {
      const user = reactive({
        email: '',
        userName: '',
        password: '',
        confirmPassword: ''
      })
      const registerBtn = ref(true)

      const formRef = ref<FormInst | null>(null)
      const rules: FormRules = {
        // user: {
        userName: {
          required: true,
          validator(rule: FormItemRule, value: any) {
            if (value && value.length <= 2) {
              return new Error('请输入正确的用户名，长度大于2位')
            }
            return true
          },
          trigger: 'blur'
        },
        email: {
          required: true,
          type: 'email',
          message: '请正确输入邮箱',
          trigger: 'blur'
        },
        password: {
          required: true,
          validator: (rule: FormItemRule, value: any): boolean | Error => {
            let reg = /^(?=\S*[a-z])(?=\S*\d)\S{8,}$/
            if (!reg.test(value)) {
              return new Error(
                '密码长度大于8位，包含大小写字母，数字，特殊符号'
              )
            }
            return true
          },
          trigger: ['blur']
        },
        confirmPassword: {
          required: true,
          validator: (rule: FormItemRule, value: any): boolean | Error => {
            console.log(user)
            if (value !== user.password) {
              return new Error('两次输入的密码不相同')
            }
            return true
          },
          trigger: ['blur']
        }
        // },
      }
      const message = useMessage()
      const methods = {
        async login(e: Event) {
          e.preventDefault()
          let errors = await formRef.value?.validate()
          if (!errors) {
            const data = {
              email: user.email,
              userName: user.userName,
              password: user.password,
              confirmPassword: user.confirmPassword
            }
            await registerApi(data)
            message.success('注册成功')
            setTimeout(() => {
              methods.back()
            }, 500)
          }
        },
        back() {
          ctx.emit('update:is-login', !props.isLogin)
        }
      }
      const inputProps: InputHTMLAttributes = {
        autocomplete: 'on'
      }
      return {
        user,
        ...methods,
        UserOutlined,
        LockOutlined,
        UserAddOutlined,
        rules,
        formRef,
        inputProps,
        registerBtn
      }
    }
  }
</script>

<style lang="scss" scoped></style>

<template>
  <div class="h-screen relative bg-amber-800 login">
    <div class="h-full container mx-auto flex justify-center items-center">
      <div class="relative mx-10 sm:max-w-sm w-full">
        <div
          class="card absolute bg-blue-400 shadow-lg h-full w-full rounded-2xl transform -rotate-6"
        >
        </div>
        <div
          class="card absolute bg-red-400 shadow-lg h-full w-full rounded-2xl transform rotate-6"
        >
        </div>
        <div
          class="card relative bg-gray-100 shadow-md w-full px-6 py-4 rounded-2xl"
        >
          <keep-alive>
            <UserLogin v-if="isLogin" key="userLogin">
              <div class="text-right text-xl">
                <n-icon
                  :component="UserAddOutlined"
                  color="#2080f0"
                  @click="isLogin = false"
                />
              </div>
            </UserLogin>
            <UserRegister
              v-else
              key="userRegister"
              v-model:is-login="isLogin"
            ></UserRegister>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import UserLogin from './components/login.vue'
  import UserRegister from './components/register.vue'
  import { NIcon } from 'naive-ui'
  import { UserAddOutlined } from '@vicons/antd'
  import { ref } from 'vue'
  let isLogin = ref(true)
</script>

<style lang="scss" scoped>
  .login {
    background-image: url('../../assets/bg-login.jpg');
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>

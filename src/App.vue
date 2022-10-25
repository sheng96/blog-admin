<script setup lang="ts">
  import { NConfigProvider } from 'naive-ui'
  // import './style/tailwind.css'

  import NaiveProvider from './components/common/Message.vue'
  import { reactive } from 'vue'
  import { checkTokenApi } from '@/api/user'

  const themeOverrides = reactive({
    common: {
      primaryColor: '#409eff',
      primaryColorHover: '#409eff'
    }
  })
  checkTokenApi()
  // const res = await regiter()
  // console.log(res)
</script>

<template>
  <NConfigProvider :theme-overrides="themeOverrides">
    <NaiveProvider>
      <router-view />
    </NaiveProvider>
  </NConfigProvider>
</template>

<style></style>

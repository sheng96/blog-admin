<script setup lang="ts">
  import {
    dateZhCN,
    NConfigProvider,
    NDateLocale,
    NLocale,
    zhCN
  } from 'naive-ui'
  // import './style/tailwind.css'

  import NaiveProvider from './components/common/Message.vue'
  import { reactive, ref } from 'vue'
  import { checkTokenApi } from '@/api/user'

  const themeOverrides = reactive({
    common: {
      primaryColor: '#409eff',
      primaryColorHover: '#409eff'
    }
  })
  const locale = ref<NLocale | null>(null)
  locale.value = zhCN
  const dateLocale = ref<NDateLocale | null>(null)
  dateLocale.value = dateZhCN
  checkTokenApi()
</script>

<template>
  <NConfigProvider
    :theme-overrides="themeOverrides"
    :locale="locale"
    :date-locale="dateLocale"
  >
    <NaiveProvider>
      <router-view />
    </NaiveProvider>
  </NConfigProvider>
</template>

<style></style>

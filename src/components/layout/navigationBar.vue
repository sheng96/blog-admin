<template>
  <div class="header">
    <n-icon
      :component="userStore.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
      color="#60a5fa"
      size="24"
      @click="userStore.collapsed = !userStore.collapsed"
    />
    <div class="flex items-center">
      <n-icon
        :component="BellOutlined"
        class="mr-3"
        color="#60a5fa"
        size="24"
        @click="userStore.collapsed = !userStore.collapsed"
      />
      <n-dropdown :options="dropdown" trigger="hover" @select="handleSelect">
        <div class="flex items-center">
          <n-avatar
            round
            size="medium"
            src="https://q2.qlogo.cn/headimg_dl?dst_uin=407497818@qq.com&spec=640"
          />
        </div>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Component, h } from 'vue'
  import { NAvatar, NDropdown, NIcon } from 'naive-ui'
  import {
    BellOutlined,
    LoginOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined
  } from '@vicons/antd'
  import { userMenuStore } from '@/store/modules/app'

  const userStore = userMenuStore()

  function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  const dropdown = [
    {
      icon: renderIcon(SettingOutlined),
      label: '设置',
      key: 'set'
    },
    {
      icon: renderIcon(LoginOutlined),
      label: '退出登录',
      key: 'outLogin'
    }
  ]
  const handleSelect = (e: any) => {
    console.log(e)
  }
</script>

<style scoped>
  .header {
    display: flex;
    border-bottom: 5px;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 30px;
    margin-bottom: 10px;
    background: #fff;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    position: relative;
  }
</style>

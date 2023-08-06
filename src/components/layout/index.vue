<template>
  <n-layout class="box flex" has-sider>
    <!--    菜单-->
    <div class="menu">
      <Sidebar />
    </div>
    <div class="content">
      <NavigationBar />
      <div class="main">
        <Suspense>
          <router-view />
        </Suspense>
      </div>
    </div>
  </n-layout>
  <div></div>
</template>

<script lang="ts" setup>
  import { NLayout } from 'naive-ui'
  import Sidebar from './sidebar.vue'
  import NavigationBar from './navigationBar.vue'
</script>

<style lang="scss" scoped>
  .box {
    width: 100vw;
    height: 100vh;

    .menu {
      min-height: 100vh;
    }

    .main {
      height: calc(100vh - 70px);
    }
  }

  .content {
    width: calc(100% - 200px);
    overflow: hidden;
    background-color: #f0f2f5;
    flex: 1;
  }
</style>

<template>
  <div class="box">
    <n-layout has-sider>
      <!--    菜单-->
      <div class="menu">
        <Sidebar />
      </div>
      <div class="content">
        <NavigationBar />
        <div class="m-3 h-5/6">
          <Suspense>
            <router-view />
          </Suspense>
        </div>
      </div>
    </n-layout>
  </div>
  <div></div>
</template>

<script setup lang='ts'>
  import { NLayout } from 'naive-ui'
  import Sidebar from './sidebar.vue'
  import NavigationBar from './navigationBar.vue'
</script>

<style lang="scss" scoped>
  .box {
    width: 100vw;
    height: 100vh;

    .menu {
      height: 100vh;
    }

    .header {
      display: flex;
      border-bottom: 5px;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 30px;
      background: #fff;
      box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
      position: relative;
    }
  }

  .content {
    background-color: #f0f2f5;
    flex: 1;
  }
</style>

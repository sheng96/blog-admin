<template>
  <NLayoutSider
    :collapsed="menuStore.collapsed"
    :inverted="true"
    :default-collapsed="true"
    bordered
    width="200"
    class="h-96 menu"
    collapse-mode="width"
    @collapse="menuStore.collapsed = true"
    @expand="menuStore.collapsed = false"
  >
    <h1 class="logo">
      <img
        v-show="menuStore.collapsed === false"
        src="../../../public/logo.png"
        alt="首页"
      />
      <img
        v-show="menuStore.collapsed === true"
        src="../../../public/logo-icon.png"
        alt="首页"
      />
    </h1>
    <NMenu
      v-model:value="menuStore.selectMenu"
      :collapsed="menuStore.collapsed"
      :collapsed-icon-size="22"
      :inverted="true"
      :options="menuOptions"
    />
  </NLayoutSider>
</template>

<script setup lang="ts">
  import { computed, h, ref, Component } from 'vue'
  import { RouterLink, RouteRecordRaw } from 'vue-router'
  import { NIcon, NLayoutSider, NMenu } from 'naive-ui'
  import type { MenuOption } from 'naive-ui'
  import { CodepenCircleFilled as BookIcon } from '@vicons/antd'
  import { userMenuStore } from '@/store/modules/app'
  import router, { constantRoutes } from '@/router'

  const menus = constantRoutes.filter(
    (route) => route.name && !route.meta?.isHidden
  )
  const menuOptions = computed(() => menus.map((item) => getMenuItem(item)))

  function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }

  const menuStore = userMenuStore()
  // const defaultValue =
  //   menuStore.selectMenu || ref(router.currentRoute.value.name as string)

  function getMenuItem(route: RouteRecordRaw, basePath = ''): MenuOption {
    let menuItem: MenuOption = {
      label: () =>
        h(
          RouterLink,
          {
            to: resolvePath(basePath, route.path)
          },
          { default: () => route.meta?.title || route.name }
        ),
      key: route.name as string,
      icon: renderIcon(BookIcon)
    }

    const visibleChildren = route.children
      ? route.children.filter((item) => item.name && !item?.meta?.isHidden)
      : []

    if (!visibleChildren.length) return menuItem
    if (visibleChildren.length === 1) {
      // 单个子路由处理
      const singleRoute = visibleChildren[0]
      menuItem = {
        label: () =>
          h(
            RouterLink,
            {
              to: resolvePath(menuItem.path as string, singleRoute.path)
            },
            { default: () => singleRoute.meta?.title }
          ),
        key: singleRoute.name as string,
        icon: renderIcon(BookIcon)
      }
      const visibleItems = singleRoute.children
        ? singleRoute.children.filter(
            (item) => item.name && !item?.meta?.isHidden
          )
        : []

      if (visibleItems.length === 1) {
        menuItem = getMenuItem(visibleItems[0], menuItem.path as string)
      } else if (visibleItems.length > 1) {
        menuItem = {
          label: singleRoute.meta?.title || (singleRoute.name as string),
          key: singleRoute.name as string,
          path: resolvePath(menuItem.path as string, singleRoute.path),
          icon: renderIcon(BookIcon)
        }
        menuItem.children = visibleItems.map((item) =>
          getMenuItem(item, menuItem.path as string)
        )
      }
    } else {
      menuItem = {
        label: (route.meta?.title as string) || (route.name as string),
        key: route.name as string,
        path: resolvePath(basePath, route.path),
        icon: renderIcon(BookIcon)
      }
      menuItem.children = visibleChildren.map((item) =>
        getMenuItem(item, menuItem.path as string)
      )
    }

    return menuItem
  }

  function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path)
  }

  function resolvePath(basePath: string, path: string): string {
    if (isExternal(path)) return path
    return (
      '/' +
      [basePath, path]
        .filter((path) => !!path && path !== '/')
        .map((path) => path.replace(/(^\/)|(\/$)/g, ''))
        .join('/')
    )
  }
</script>
<style lang="scss" scoped>
  .logo {
    text-align: center;
    padding: 10px 0;
    height: 80px;
    background: #0c202b;

    img {
      //margin: 0 auto;
      display: inline;
      height: 80px;
    }

    img:last-child {
      height: 30px;
    }
  }
</style>

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/auth/index.vue'
import Layout from '../components/layout/index.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    isHidden?: boolean
  }
}

//基本路由，可以不用登录
export const basicRoutes = [
  {
    path: '/Login',
    component: Login,
    name: 'login',
    meta: {
      title: '登录页',
      isHidden: true
    }
  },
  {
    path: '/404',
    component: () => import('../views/404.vue'),
    name: '404',
    meta: {
      title: '404',
      isHidden: true
    }
  }
]

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Layout',
    children: [
      {
        path: 'dashboard',
        component: () => import('../views/dashboard.vue'),
        name: 'Dashboard',
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/posts',
    component: Layout,
    redirect: '/posts/list',
    name: '文章',
    children: [
      {
        path: 'list',
        component: () => import('../views/posts/list.vue'),
        name: 'list',
        meta: {
          title: '所有文章'
        }
      },
      {
        path: 'write',
        component: () => import('../views/posts/write.vue'),
        name: 'write',
        meta: {
          title: '写文章'
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/user',
    name: '用户',
    children: [
      {
        path: 'user',
        component: () => import('../views/user/list.vue'),
        name: 'User',
        meta: {
          title: '用户列表'
        }
      }
    ]
  }
]
export default createRouter({
  history: createWebHistory('/admin/'),
  routes: [...basicRoutes, ...constantRoutes]
})

import { Router } from 'vue-router'
import { userStore } from '@/store/modules/user'
import store from '@/store'
import { basicRoutes } from '@/router/index'

const user = userStore(store)

export function setupRouterGuard(router: Router) {
  router.beforeEach((to) => {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    if (!user.token && !basicRoutes.find((item) => item.name === to.name)) {
      return `login?redirect=${to.path}`
    } else {
      return true
    }
  })
}

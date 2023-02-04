//userStore.js
// 导入 store
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getUserInfoApi } from '@/api/user'
import router from '@/router/index'

const token = useStorage('token', '')
console.log(token, 1)
// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const userStore = defineStore({
  // id：必须的，保证在Store中唯一
  id: 'userStore',
  // state：返回对象的函数
  state: () => ({
    name: '张三',
    user: {},
    token
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    logout() {
      this.token = ''
      this.user = {}
      router.push({ path: '/login' })
    },
    async setUser() {
      this.user = await getUserInfoApi().then((r) => r.data)
    }
  }
})

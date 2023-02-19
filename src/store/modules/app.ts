import { defineStore } from 'pinia'

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const userMenuStore = defineStore('app', {
  // state：返回对象的函数
  state: () => {
    return {
      selectMenu: '', //选中状态
      collapsed: false //侧边菜单的开关状态
    }
  }
})

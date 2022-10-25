import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
import './style/tailwind.css'
import router from './router'
import { setupRouterGuard } from '@/router/guard'
// 页面title
// 解决 tailwindcss与naive样式冲突
// const meta = document.createElement('meta')
// meta.name = 'naive-ui-style'
// document.head.appendChild(meta)

//路由守卫
setupRouterGuard(router)

const app = createApp(App)
app.use(router)
app.use(store)

app.mount('#app')

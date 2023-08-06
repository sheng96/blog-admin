import type {
  LoadingBarApi,
  DialogApi,
  MessageApi,
  NotificationApi
} from 'naive-ui'

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  interface Window {
    $loadingBar: LoadingBarApi
    $dialog: DialogApi
    $message: MessageApi
    $notification: NotificationApi
  }
}

// shims-vue.d.ts
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $env: {
      VITE_BASE_URL: string
    }
  }
}

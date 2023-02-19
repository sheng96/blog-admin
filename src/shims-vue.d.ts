import {
  LoadingBarInst,
  DialogApiInjection,
  MessageApiInjection,
  NotificationApiInjection
} from 'naive-ui'

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare global {
  interface Window {
    $loadingBar: LoadingBarInst
    $dialog: DialogApiInjection
    $message: MessageApiInjection
    $notification: NotificationApiInjection
  }
}

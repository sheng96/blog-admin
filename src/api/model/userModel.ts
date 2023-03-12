import { BasicPageParams, PagesBaseModel } from '@/api/model/baseModel'
export interface UserListData {
  avatar?: null
  email: string
  id: number
  role: string
  userName: string
}

export type UserListModel = PagesBaseModel<UserListData>

import { BaseModel, PagesBaseModel } from '@/api/model/baseModel'
import { UserPermission } from '@/common/blog.config'
export interface UserListData {
  avatar?: null | string
  email: string
  id: number
  role: UserPermission
  userName: string
  creatTime: string
}

export type UserListModel = PagesBaseModel<UserListData>

export type UserDetailModel = BaseModel<UserListData>

import { PostStatus } from '@/common/post-status'

export interface UserModel {
  userName: string
  avatar?: any
}

export interface postAllModel {
  id: string
  title: string
  content: string
  contentHtml: string
  summary: string
  count: number
  status: PostStatus
  creatTime: string
  updateTime: string
  tags: string[]
  user: UserModel
}

export enum statusEnum {
  draft = 'draft',
  publish = 'publish'
}

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
  status: statusEnum
  creatTime: string
  updateTime: string
  tags: string[]
  user: UserModel
}

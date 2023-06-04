import http from '@/utils/axios'
import { postAllModel } from '@/api/model/postModel'
import { PostStatus } from '@/common/post-status'
import { BasicPageParams, PagesBaseModel } from '@/api/model/baseModel'

export const postAllApi = async (
  params: BasicPageParams & {
    keyword?: string
    status?: string
    tag?: number
  } = {}
): Promise<PagesBaseModel<postAllModel>> =>
  await http.get('/post', {
    params
  })
export const postDetailApi = async (id: number | string) =>
  await http.get(`/post/${id}`)

interface creat {
  title: string
  content: string
  summary: string
  status: PostStatus
  tag: number[]
}

export const creatPostApi = async (data: creat) =>
  await http.post('/post', data)

export const updatePostApi = async (id: string, data: creat) =>
  await http.patch(`/post/${id}`, data)

export const deletePostApi = async (id: number) =>
  await http.delete(`/post/${id}`)

export const uploadImagesApi = async (data: FormData) =>
  await http.post('/post/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

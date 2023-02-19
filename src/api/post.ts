import http from '@/utils/axios'
import { postAllModel, statusEnum } from '@/api/model/postModel'
import { BasicPageParams, PagesBaseModel } from '@/api/model/baseModel'

export const postAllApi = async (
  params: BasicPageParams & {
    keyword?: string
    status?: string
    tag?: number
  } = {}
): Promise<PagesBaseModel<postAllModel[]>> =>
  await http.get('/post', {
    params
  })
export const postDetailApi = async (id: string) => await http.get(`/post/${id}`)

interface creat {
  title: string
  content: string
  contentHtml: string
  summary: string
  status: statusEnum
  tags: number[]
}

export const creatPostApi = async (data: creat) =>
  await http.post('/post', data)

export const updatePostApi = async (id: string, data: creat) =>
  await http.patch(`/post/${id}`, data)

export const deletePostApi = async (id: string) =>
  await http.delete(`/post/${id}`)

export const uploadImagesApi = async (data: FormData) =>
  await http.post('/post/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

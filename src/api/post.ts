import http from '@/utils/axios'
import { statusEnum } from '@/api/model/postModel'
import { BasicPageParams } from '@/api/model/baseModel'

export const postAllApi = async (params: BasicPageParams = {}) =>
  await http.get('/api/post', {
    params
  })

interface creat {
  title: string
  content: string
  contentHtml: string
  summary: string
  status: statusEnum
  tags: number[]
}

export const creatPostApi = async (data: creat) =>
  await http.post('/api/post', data)

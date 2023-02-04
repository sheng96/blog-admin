import http from '@/utils/axios'
type moduleTag = {
  id: number
  name: string
}
interface GetdataTag {
  data: moduleTag[]
  success: boolean
}
interface CreatdataTag {
  data: moduleTag
  success: boolean
}

export const creatTagApi = async (name: string): Promise<CreatdataTag> =>
  await http.post('/tag', { name })

export const getTagAllApi = async (): Promise<GetdataTag> =>
  await http.get('/tag')

import http from '@/utils/axios'
type moduleTag = {
  id: number
  name: string
}
interface dataTag {
  data: moduleTag[]
  success: boolean
}

export const creatTagApi = async (name: string[]): Promise<dataTag> =>
  await http.post('/tag', { name })

export const getTagAllApi = async (): Promise<dataTag> =>
  await http.get('/tag')

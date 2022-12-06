import http from '@/utils/axios'

export const getStatisticalApi = async (): Promise<any> =>
  await http.get('/home/statistical')

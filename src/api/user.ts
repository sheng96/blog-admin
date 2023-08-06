import http from '@/utils/axios'
import { UserDetailModel, UserListModel } from '@/api/model/userModel'

type dataRegister = {
  userName: string
  password: string
  confirmPassword: string
  email: string
}

export const checkTokenApi = async () => await http.get('/auth/checkToken')

export const registerApi = async (data: dataRegister) =>
  await http.post('/user/register', data)

type dataLogin = {
  userName: string
  password: string
}

export interface UserListParams {
  page?: number
  size?: number
  keyword?: string
  role?: string
}

export const loginApi = async (
  data: dataLogin
): Promise<{ data: { token: string } }> => await http.post('/auth/login', data)

export const getUserInfoApi = async () => await http.get('/user/getUserInfo')

export const getUserListApi = async (
  params: UserListParams
): Promise<UserListModel> =>
  await http.get('/user/list', {
    params
  })

// 查询一个用户,返回ts类型为UserDetailModel
export const getUserApi = async (id: number): Promise<UserDetailModel> =>
  await http.get(`/user/${id}`)

export const deleteUserApi = async (id: number) =>
  await http.delete(`/user/${id}`)

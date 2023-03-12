import http from '@/utils/axios'
import { UserListModel } from '@/api/model/userModel'

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

export const deleteUserApi = async (id: string) =>
  await http.delete(`/user/${id}`)

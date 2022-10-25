import http from '@/utils/axios'

type dataRegister = {
  userName: string
  password: string
  confirmPassword: string
  email: string
}

export const checkTokenApi = async () => await http.get('/api/auth/checkToken')

export const registerApi = async (data: dataRegister) =>
  await http.post('/api/user/register', data)

type dataLogin = {
  userName: string
  password: string
}

export const loginApi = async (
  data: dataLogin
): Promise<{ data: { token: string } }> =>
  await http.post('/api/auth/login', data)

export const getUserInfoApi = async () =>
  await http.get('/api/user/getUserInfo')

import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    //根路径
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/'
  })

  //拦截器,添加tolen认证
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  })

  return instance(config)
}
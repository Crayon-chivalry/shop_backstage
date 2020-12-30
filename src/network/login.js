import {request} from './request'

//登陆请求
export function postLogin(user){
  return request({
    // 请求方式
    method: 'POST',
    //路径
    url: '/login',
    //验证
    data: user
  })
}
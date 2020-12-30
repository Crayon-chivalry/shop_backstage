import {request} from './request'

//菜单栏
export function getHomeMenus() {
  return request({
    url: '/menus'
  })
}

//用户列表
export function getHomeUser(queryInfo) {
  return request({
    url: '/users',
    params: queryInfo
  })
}
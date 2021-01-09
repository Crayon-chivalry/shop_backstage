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

//改变用户状态请求
export function putUserStatu(id,type) {
  return request({
    method: 'put',
    url: `/users/${id}/state/${type}`
  })
}

//添加用户
export function postAddUser(userData) {
  return request({
    method: 'post',
    url: '/users',
    data: userData
  })
}

//查询用户
export function getQueryUser(id) {
  return request({
    url: '/users/' + id,
  })
}

//更新用户信息
export function putChangeUser(queryForm) {
  return request({
    method: 'put',
    url: '/users/' + queryForm.id,
    data: {
      email: queryForm.email,
      mobile: queryForm.mobile
    }
  })
}

//删除用户
export function deleteUser(id) {
  return request({
    method: 'delete',
    url: '/users/' + id
  })
}
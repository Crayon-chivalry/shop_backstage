import {request} from './request'

//角色列表
export function getRoles() {
  return request({
    url: '/roles'
  })
}

//添加角色
export function postAddRoles(addForm) {
  return request({
    method: 'post',
    url: '/roles',
    data: addForm
  })
}

//查询角色
export function getQuery(id) {
  return request({
    url: '/roles/' + id
  })
}

//编辑角色
export function putEditRoles(editForm) {
  return request({
    method: 'put',
    url: '/roles/' + editForm.roleId,
    data: {
      roleName: editForm.roleName,
      roleDesc: editForm.roleDesc
    }
  })
}

//删除角色
export function deleteRoles(id) {
  return request({
    method: 'delete',
    url: '/roles/' + id
  })
}

//删除权限
export function deleteRight(rolesId,rightId) {
  return request({
    method: 'delete',
    url: `roles/${rolesId}/rights/${rightId}`
  })
}

//查询所有权限
export function getRight() {
  return request({
    url: '/rights/tree'
  })
}

//分配权限
export function postAllotRight(roleId,idStr) {
  return request({
    method: 'post',
    url: `roles/${roleId}/rights`,
    data:{
      rids: idStr
    }
  })
}

//分配角色
export function putAllotRoles(userId,rid) {
  return request({
    method: 'put',
    url: `users/${userId}/role`,
    data:{
      rid
    }
  })
}



//应该使用全局~~~~
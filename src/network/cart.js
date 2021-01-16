import {request} from './request'

//获取分类列表数据
export function getCateList(querInfo) {
  return request({
    url: '/categories',
    params: querInfo
  })
}

//添加分类
export function postAddCate(data) {
  return request({
    method: 'post',
    url: '/categories',
    data
  })
}

//根据id查询分类
export function queryCate(id) {
  return request({
    url: '/categories/' + id
  })
}

//编辑分类
export function putAddCate(cate) {
  return request({
    method: 'put',
    url: '/categories/' + cate.cat_id,
    data:{
      cat_name: cate.cat_name
    }
  })
}

//根据id刪除分类
export function deleteCate(id) {
  return request({
    method: 'delete',
    url: '/categories/' + id
  })
}
import {request} from './request'

//商品列表
export function getGoodsList(queryInfo) {
  return request({
    url: '/goods',
    params: queryInfo
  })
}

//查询id
export function getGoods(id) {
  return request({
    url: '/goods/' + id
  })
}

//编辑商品
export function putEditGoods(editForm) {
  return request({
    method: 'put',
    url: '/goods/' + editForm.goods_id,
    data: {
      goods_name: editForm.goods_name,
      goods_price: editForm.goods_price,
      goods_number: editForm.goods_number,
      goods_weight: editForm.goods_weight
    }
  })
}

//删除商品
export function deleteGoods(id) {
  return request({
    method: 'delete',
    url: '/goods/' + id
  })
}

//添加商品
export function postAddGoods(form) {
  return request({
    method: 'post',
    url: '/goods',
    data: form
  })
}
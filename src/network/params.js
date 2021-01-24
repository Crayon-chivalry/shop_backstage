import {request} from './request'

//获取参数列表
export function getParamsList(id,sel) {
  return request({
    url: `categories/${id}/attributes`,
    params:{
      sel
    }
  })
}

//添加参数
export function postAddParams(id,attr_name,attr_sel) {
  return request({
    method: 'post',
    url: `categories/${id}/attributes`,
    data:{
      attr_name,
      attr_sel
    }
  })
}

//根据id查询参数
export function getQueryParams(id,attrId,attr_sel) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    params: {
      attr_sel
    }
  })
}


export function putEditParams(id,editForm,attr_sel,attr_vals) {
  return request({
    method: 'put',
    url: `categories/${id}/attributes/${editForm.attr_id}`,
    data: {
      attr_name: editForm.attr_name,
      attr_sel,
      attr_vals
    }
  })
}

export function deleteParams(id,attr_id) {
  return request({
    method: 'delete',
    url: `categories/${id}/attributes/${attr_id}`
  })
}
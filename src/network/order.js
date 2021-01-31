import {request} from './request'

export function getOrderList(queryInfo) {
  return request({
    url: '/orders',
    params: queryInfo
  })
}

//物流，api无效
export function getOrderProgress() {
  return request({
    url: '/kuaidi/1106975712662'
  })
}
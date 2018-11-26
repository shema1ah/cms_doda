import request from '../../utils/request'

// 获取路由列表
export function getRoutesList(data) {
  return request({
    url: '/systemMenu/listAll',
    method: 'post',
    data
  })
}

// 添加路由
export function createRoute(data) {
  return request({
    url: '/systemMenu/add',
    method: 'post',
    data
  })
}

// 修改路由
export function updateRoute(data) {
  return request({
    url: '/systemMenu/update',
    method: 'post',
    data
  })
}

// 删除路由
export function deleteRoute(data) {
  return request({
    url: '/systemMenu/delete',
    method: 'post',
    data
  })
}

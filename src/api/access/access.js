import request from '../../utils/request'

// 获取权限列表
export function getAccessList(data) {
  return request({
    url: '/emp/list',
    method: 'post',
    data
  })
}

// 添加权限
export function createAccess(data) {
  return request({
    url: '/emp/add',
    method: 'post',
    data
  })
}

// 修改权限
export function updateAccess(data) {
  return request({
    url: '/emp/update',
    method: 'post',
    data
  })
}

// 删除权限
export function deleteAccess(data) {
  return request({
    url: '/emp/delete',
    method: 'post',
    data
  })
}

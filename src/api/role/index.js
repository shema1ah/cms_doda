import request from '../../utils/request'

// 角色列表
export function getRolesList(data) {
  return request({
    url: '/role/list',
    method: 'post',
    data
  })
}

// 添加路由
export function createRole(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data
  })
}

// 修改路由
export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

// 删除路由
export function deleteRole(data) {
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}

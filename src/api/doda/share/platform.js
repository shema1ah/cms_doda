import request from '../../../utils/request'
// 获取平台文案列表
export function getPfList(params) {
  return request({
    url: '/imageShare',
    method: 'get',
    params
  })
}

// 新增平台文案
export function createPf(data) {
  return request({
    url: '/imageShare',
    method: 'post',
    data
  })
}

// 编辑平台文案
export function updatePf(data) {
  return request({
    url: '/imageShare',
    method: 'put',
    data
  })
}

// 删除平台文案
export function deletePf(data) {
  return request({
    url: `/imageShare/${data.id}`,
    method: 'delete'
  })
}

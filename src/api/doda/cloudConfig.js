import request from '../../utils/request'
// 获取云配置数据列表
export function getCloudList(params) {
  return request({
    url: '/versions',
    method: 'get',
    params
  })
}

// 获取云配置
export function getCloud(params) {
  return request({
    url: `/version/${params.id}`,
    method: 'get'
  })
}

// 新增云配置
export function createCloud(data) {
  return request({
    url: '/version',
    method: 'post',
    data
  })
}

// 修改云配置
export function updateCloud(data) {
  const { id, ...res } = data
  return request({
    url: `/version/${id}`,
    method: 'patch',
    data: { ...res }
  })
}

// 删除云配置
export function deleteCloud(id) {
  return request({
    url: '/version',
    method: 'post',
    data: { id }
  })
}
// 获取公告
export function getTip() {
  return request({
    url: '/notice',
    method: 'get'
  })
}
// 新增公告
export function createTip(data) {
  return request({
    url: '/notice',
    method: 'post',
    data
  })
}
// 修改公告
export function updateTip(data) {
  return request({
    url: '/notice',
    method: 'put',
    data
  })
}

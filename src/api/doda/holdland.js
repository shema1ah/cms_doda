import request from '../../utils/request'

// 获取哆哒数据列表
export function getHolyList(params) {
  return request({
    url: '/tour/list',
    method: 'get',
    params
  })
}

// 上传圣地洗礼内容
export function createHoly(data) {
  return request({
    url: '/tour/import',
    method: 'post',
    data
  })
}

// 修改圣地巡礼
export function updateHoly(data) {
  return request({
    url: '/tour/update',
    method: 'put',
    data
  })
}

// 删除哆哒数据
export function deleteHoly(data) {
  return request({
    url: `/tour/tours/${data.id}`,
    method: 'delete'
  })
}


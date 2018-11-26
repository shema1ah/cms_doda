import request from '../../utils/request'

// 获取哆哒数据列表
export function getDodaList(data) {
  return request({
    url: '/game/list',
    method: 'post',
    data
  })
}

// 新增哆哒数据
export function createDodaData(data) {
  return request({
    url: '/game/add',
    method: 'post',
    data
  })
}

// 新增哆哒数据
export function updateDodaData(data) {
  return request({
    url: '/game/update',
    method: 'post',
    data
  })
}

// 删除哆哒数据
export function deleteDodaData(id) {
  return request({
    url: '/game/delete',
    method: 'post',
    data: { id }
  })
}

// 数据位置交换
export function siteChange(params) {
  return request({
    url: '/game/move',
    method: 'post',
    params
  })
}

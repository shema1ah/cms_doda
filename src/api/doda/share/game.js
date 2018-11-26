import request from '../../../utils/request'

// 获取游戏文案列表
export function getGameList(params) {
  const { gameId, ...res } = params
  return request({
    url: `/gameShare/${gameId}`,
    method: 'get',
    params: { ...res }
  })
}

// 新增游戏文案
export function createGame(data) {
  return request({
    url: '/gameShare',
    method: 'post',
    data
  })
}

// 编辑游戏文案
export function updateGame(data) {
  return request({
    url: '/gameShare',
    method: 'put',
    data
  })
}

// 删除游戏文案
export function deleteGame(data) {
  return request({
    url: `/gameShare/${data.id}`,
    method: 'delete'
  })
}

import request from '../../utils/request'
import proxy from './index'

// 获取所有NPC
export function getNpcList(data) {
  return request({
    url: '/u/npcList',
    method: 'post',
    proxy,
    data
  })
}

// 添加NPC
export function createNpc(data) {
  return request({
    // url: '/u/addNpc'
    url: '/u/saveOrUpdate',
    method: 'post',
    proxy,
    data
  })
}
// 编辑NPC
export function updateNpc(data) {
  return request({
    url: '/u/saveOrUpdate',
    method: 'post',
    proxy,
    data
  })
}
// 删除NPC
export function deleteNpc(data) {
  return request({
    url: '/u/delete',
    method: 'post',
    proxy,
    data
  })
}
// 获取单个NPC已关注列表
export function getNpcfocus(data) {
  return request({
    url: '/u/followNpc/list',
    method: 'post',
    proxy,
    data
  })
}
// 修改单个NPC关注列表
export function updateNpcfocus(data) {
  return request({
    url: '/u/followNpc',
    method: 'post',
    proxy,
    data
  })
}

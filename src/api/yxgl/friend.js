import request from '../../utils/request'
import proxy from './index'

// 获取所有人的朋友圈信息
export function getFriendList(data) {
  return request({
    url: '/moment/list',
    method: 'post',
    proxy,
    data
  })
}
// 发送朋友圈
export function updatefriend(data) {
  return request({
    url: '/moment/add',
    method: 'post',
    proxy,
    data
  })
}
// 点赞接口
export function updateFavour(data) {
  return request({
    url: '/moment/addMomentFavorList',
    method: 'post',
    proxy,
    data
  })
}
// 评论接口
export function updateComment(data) {
  return request({
    url: '/moment/addMomentComment',
    method: 'post',
    proxy,
    data
  })
}

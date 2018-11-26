import request from '../../utils/request'
import proxy from './index'

// 获取具有剧本的NPC
export function getScenarioList(data) {
  return request({
    url: '/u/roles',
    method: 'post',
    proxy,
    data
  })
}

// 获取npc对应的question
export function getQuestionList(data) {
  return request({
    url: '/q/list',
    method: 'post',
    proxy,
    data
  })
}

// NPC：添加问题
export function createQuestion(data) {
  return request({
    url: '/q/add',
    method: 'post',
    proxy,
    data
  })
}
// NPC：编辑问题
export function updateQuestion(data) {
  return request({
    url: '/q/saveOrUpdate',
    method: 'post',
    proxy,
    data
  })
}
// NPC：删除问题
export function deleteQuestion(data) {
  return request({
    url: '/q/delete',
    method: 'post',
    proxy,
    data
  })
}

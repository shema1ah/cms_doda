import request from '../../utils/request'

// 获取审核数据列表
export function getCheckList(parmas) {
  return request({
    url: '/review',
    method: 'get',
    parmas
  })
}

// 审核结果
export function checkRes(data) {
  return request({
    url: '/review/save',
    method: 'post',
    data
  })
}

// maker提交审核
export function makerCheck(data) {
  return request({
    url: '/workStats',
    method: 'post',
    proxy: {
      host: process.env.NODE_ENV === 'development' ? 'https://beta.ajimiyou.com/maker' : 'https://api.ajimiyou.com/maker'
    },
    data
  })
}

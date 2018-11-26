import request from '../../utils/request'
// 文件上传
export function imageLoad(data) {
  return request({
    url: '/luna/image/upload',
    method: 'post',
    data
  })
}

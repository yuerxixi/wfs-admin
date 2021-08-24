import request from '@/utils/request'

// 设备字典列表接口
export function getTableFetch(params) {
  return request({
    url: '/api/dictionary/list',
    method: 'post',
    params
  })
}


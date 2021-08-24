import request from '@/utils/request'

/**
 * 导入模版数据请求
 * @param query
 */
export function commonDownloadTemp(url, query) {
  return request({
    url: url,
    method: 'post',
    data: query,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

import request from '@/utils/request'

export function getParkDeviceTreeData() {
  return request({
    url: 'api/video/treeParkDevice',
    method: 'get'
  })
}

export function getVideoDeviceUrl(params) {
  return request({
    url: 'api/video/live',
    method: 'get',
    params
  })
}

export function getVideoPlayBackUrl(params) {
  return request({
    url: 'api/video/playback',
    method: 'get',
    params
  })
}

export function updateVideoParams(params) {
  return request({
    url: 'api/video/videoParamsUpdate',
    method: 'get',
    params
  })
}

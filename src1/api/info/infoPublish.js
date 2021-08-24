import request from '@/utils/request'

export function getLEDTreeData() {
  return request({
    url: 'api/message/list',
    method: 'get'
  })
}

export function getLEDParkTreeData() {
  return request({
    url: 'api/park/treeList',
    method: 'get'
  })
}

export function getLEDDeviceTreeData(data) {
  return request({
    url: 'api/device/park/devices',
    method: 'get',
    params: data
  })
}

export function getInfoPublishListData(data) {
  return request({
    url: 'api/message/queryPage',
    method: 'post',
    params: data
  })
}

export function saveInfoPublish(data) {
  return request({
    url: 'api/message/add',
    method: 'post',
    data: data
  })
}

export function updateInfoPublish(data) {
  return request({
    url: 'api/message/update',
    method: 'post',
    data: data
  })
}

export function deleteInfoPublish(data) {
  return request({
    url: 'api/message/delete',
    method: 'post',
    params: data
  })
}

export function stopInfoPublish(data) {
  return request({
    url: 'api/message/stop',
    method: 'post',
    params: data
  })
}

export function startInfoPublish(data) {
  return request({
    url: 'api/message/start',
    method: 'post',
    params: data
  })
}

export function getInfoFiles(data) {
  return request({
    url: 'api/message/getFile',
    method: 'get',
    params: data
  })
}

export function getTempParkData(params) {
  return request({
    url: 'api/message/getParkInfo',
    method: 'get',
    params
  })
}

export function setControlScreen(data) {
  return request({
    url: 'api/message/screenOpenTask',
    method: 'post',
    data
  })
}

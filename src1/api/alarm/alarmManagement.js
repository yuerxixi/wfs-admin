import request from '@/utils/request'

export function getAlarmManagerListData(data) {
  return request({
    url: 'api/alert/queryDeviceAndAlert',
    method: 'get',
    params: data
  })
}

export function getAlarmManagerDetailData(data) {
  return request({
    url: 'api/alert/list',
    method: 'get',
    params: data
  })
}

export function getDeviceTypeData() {
  return request({
    url: 'api/device/type/list',
    method: 'get'
  })
}

export function getDeviceModelData(data) {
  return request({
    url: 'api/device/type/existmodel',
    method: 'get',
    params: data
  })
}

export function closeDeviceAlarm(data) {
  return request({
    url: 'api/alert/updateAlertStatus',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

export function getParkAreaData() {
  return request({
    url: 'api/park/listView',
    method: 'post'
  })
}

export function getParkUsedRateData() {
  return request({
    url: 'api/park/usedRate',
    method: 'post'
  })
}

export function getParkTimeData() {
  return request({
    url: 'api/overview/park/parkTime',
    method: 'post'
  })
}

export function getParkPressureData() {
  return request({
    url: 'api/park/parkPressure',
    method: 'post'
  })
}

// 天气
export function getWeatherData() {
  return request({
    url: 'api/overview/getWeather',
    method: 'get'
  })
}

// 告警事件，事件处理数量
export function getAlarmInfoData() {
  return request({
    url: 'api/overview/alert/info',
    method: 'get'
  })
}

// 灯杆数据
export function getLamppostData(params) {
  return request({
    url: 'api/overview/analysis/lamppost',
    method: 'get',
    params
  })
}

// 告警事件，列表
export function getAlarmListData() {
  return request({
    url: 'api/overview/alert/list',
    method: 'get'
  })
}

// 能耗分析
export function getEnergyData() {
  return request({
    url: 'api/overview/analysis/energy',
    method: 'get'
  })
}

// 灯杆报警数据(根据灯杆查询，暂时不用)
export function getLamppostAlarmData(params) {
  return request({
    url: 'api/overview/alert/bylamppost',
    method: 'get',
    params
  })
}

// 灯杆报警数据(根据设备查询)
export function getDeviceAlarmData(params) {
  return request({
    url: 'api/overview/alert/bydevice',
    method: 'get',
    params
  })
}

// 全彩屏数据
export function getScreenProgramData(params) {
  return request({
    url: 'api/message/getScreenProgram',
    method: 'get',
    params
  })
}

// 设置灯具亮度
export function setDeviceDim(data) {
  return request({
    url: 'api/dimming/command',
    method: 'post',
    data
  })
}

// 获取设备视频流数据
export function getVideoLiveData(params) {
  return request({
    url: 'api/overview/live',
    method: 'get',
    params
  })
}

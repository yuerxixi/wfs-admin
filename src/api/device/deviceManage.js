import request from '@/utils/request'

// 设备字典列表接口
export function getTableFetch(data) {
  return request({
    url: '/api/device/list',
    method: 'post',
    data
  })
}

// 设备管理列表删除接口
export function getDeviceDel(params) {
  return request({
    url: '/api/device/delete',
    method: 'post',
    params
  })
}
// 导出
export function excelExport(data) {
  return request({
    url: '/api/device/excel/export',
    method: 'post',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

// 设备关联列表--添加设备接口
export function deviceLamppostOthers(data) {
  return request({
    url: '/api/device/lamppost/others',
    method: 'post',
    data
  })
}

// 设备关联列表--已关联接口
export function deviceLamppostDevices(data) {
  return request({
    url: '/api/device/lamppost/devices',
    method: 'post',
    data
  })
}

// 设备关联列表--行操作--添加设备接口
export function deviceRelateOthers(data) {
  return request({
    url: '/api/device/relate/others',
    method: 'post',
    data
  })
}

// 设备关联列表--行操作--已关联接口
export function deviceRelateDevices(data) {
  return request({
    url: '/api/device/relate/devices',
    method: 'post',
    data
  })
}

// 设备关联列表--设备类型接口
export function deviceTypeList(params) {
  return request({
    url: '/api/device/type/list',
    method: 'get',
    params
  })
}
// 设备关联列表--设备编号接口
export function deviceTypeModel(params) {
  return request({
    url: '/api/device/type/existmodel',
    method: 'get',
    params
  })
}
// 设备关联列表--保存接口
export function deviceRelated(data) {
  return request({
    url: '/api/device/related',
    method: 'post',
    data
  })
}

// 树型结构

export function parkTreeList(data) {
  return request({
    url: '/api/park/treeList',
    method: 'post',
    data
  })
}
// 选择树
export function deviceParkDevices(params) {
  return request({
    url: '/api/device/park/devices',
    method: 'get',
    params
  })
}

// 远程控制--列表接口
export function deviceLampsList(data) {
  return request({
    url: '/api/device/lamps/list',
    method: 'post',
    data
  })
}
// 远程控制--保存接口
export function deviceDimmingCommand(data) {
  return request({
    url: '/api/dimming/command',
    method: 'post',
    data
  })
}


import request from '@/utils/request'

// 设备类型列表
/**
 * 新增/编辑字典
 * */
export function submitTargetForm(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
// 修改操作时设备类型相关设备型号
export function deviceTypeList(params) {
  return request({
    url: '/api/device/type/list',
    method: 'get',
    params
  })
}
// 设备类型请求出设备型号
export function deviceTypeExistmodel(params) {
  return request({
    url: '/api/device/type/existmodel',
    method: 'get',
    params
  })
}
// 设备型号请求出设备ID
export function deviceGenerateid(params) {
  return request({
    url: '/api/device/generateid',
    method: 'get',
    params
  })
}

// 点击修改后查询的当前行信息
export function deviceFindbyid(params) {
  return request({
    url: '/api/device/findbyid',
    method: 'get',
    params
  })
}
// 修改操作时设备类型相关设备型号
export function dictionaryModels(params) {
  return request({
    url: '/api/dictionary/models',
    method: 'get',
    params
  })
}
// 删除设备型号
export function dictionaryDelete(params) {
  return request({
    url: '/api/dictionary/delete',
    method: 'get',
    params
  })
}
// 灯杆下的关联区域接口
export function deviceArea(param) {
  return request({
    url: 'api/park/remainSpaceNumList',
    method: 'get'
  })
}

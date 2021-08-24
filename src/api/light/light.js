import request from '@/utils/request'

// 主表格数据
export function getTableList(params) {
  return request({
    url: '/api/lightTask/list',
    method: 'get',
    params
  })
}

// 编辑用户
export function lightTaskDelete(data) {
  return request({
    url: '/api/lightTask/delete',
    method: 'post',
    data
  })
}
// 查看设备
export function deviceDetails(data) {
  return request({
    url: '/api/device/details',
    method: 'post',
    data
  })
}

/**
 * 新增/编辑角色
 * */
export function submitTargetForm(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
/**
 * 新增角色 - 角色列表
 * */
export function lightTaskOper(params) {
  return request({
    url: '/api/lightTask/oper',
    method: 'get',
    params
  })
}
/**
 * 获取的树设备数据
 * */
export function parkDevices(params) {
  return request({
    url: '/api/device/park/devices',
    method: 'get',
    params
  })
}

/**
 * 停车区域树
 * */
export function parkTreeList(url, data) {
  return request({
    url: 'api/park/treeList ',
    method: 'post',
    data
  })
}

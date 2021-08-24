import request from '@/utils/request'

// 主表格数据
export function userList(params) {
  return request({
    url: '/oauth/sys/user/list',
    method: 'get',
    params
  })
}
// 主表格数据
export function getTableList(params) {
  return request({
    url: '/oauth/sys/user/queryPageAndRoleList',
    method: 'get',
    params
  })
}
// 未关联表格数据
export function getNotRoleList(params) {
  return request({
    url: '/oauth/sys/user/queryPageNotRoleList',
    method: 'get',
    params
  })
}
// 获取树上的角色信息
export function roleTreeInfo(roleId) {
  return request({
    url: `/oauth/sys/role/info/${roleId}`,
    method: 'get'
    // params
  })
}
// 树数据
export function getTreeList(params) {
  return request({
    url: '/oauth/sys/role/list',
    method: 'get',
    params
  })
}
// 新增用户
export function userAdd(data) {
  return request({
    url: '/oauth/sys/user/save',
    method: 'post',
    data
  })
}
// 编辑用户
export function userUpdate(data) {
  return request({
    url: '/oauth/sys/user/update',
    method: 'post',
    data
  })
}
// 编辑用户
export function userDelete(data) {
  return request({
    url: '/oauth/sys/user/delete',
    method: 'post',
    data
  })
}
// 删除角色
export function roleDelete(data) {
  return request({
    url: '/oauth/sys/role/delete',
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
export function menuNav(params) {
  return request({
    url: '/oauth/sys/menu/nav',
    method: 'get',
    params
  })
}

/**
 * 获取所属角色
 * */
export function userInfo(roleId) {
  return request({
    url: `/oauth/sys/user/info/${roleId}`,
    method: 'get'
  })
}

/**
 * 初始化密码
 * */
export function initPassword(userId) {
  return request({
    url: `/oauth/sys/user/initPassword/${userId}`,
    method: 'get'
  })
}


import request from '@/utils/request'

export function getParkAreaTreeData() {
  return request({
    url: 'api/parkArea/group',
    method: 'post'
  })
}

export function getLEDParkTreeData() {
  return request({
    url: 'api/park/treeList',
    method: 'get'
  })
}

export function getParkAreaList(param) {
  return request({
    url: 'api/park/remainSpaceNumList',
    method: 'get'
  })
}

export function saveParkAreaData(data) {
  return request({
    url: 'api/parkArea/save',
    method: 'post',
    data: data
  })
}

export function updateParkAreaData(data) {
  return request({
    url: 'api/parkArea/update',
    method: 'post',
    data: data
  })
}

export function deleteParkAreaData(data) {
  return request({
    url: 'api/parkArea/delete',
    method: 'post',
    data: data
  })
}

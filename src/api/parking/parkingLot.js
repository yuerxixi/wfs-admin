import request from '@/utils/request'

export function getParkLotTreeData() {
  return request({
    url: 'api/park/group',
    method: 'post'
  })
}

export function getParkLotList(param) {
  return request({
    url: 'api/park/list',
    method: 'get',
    params: param
  })
}

export function saveParkLotData(data) {
  return request({
    url: 'api/park/save',
    method: 'post',
    data: data
  })
}

export function updateParkLotData(data) {
  return request({
    url: 'api/park/update',
    method: 'post',
    data: data
  })
}

export function deleteParkLotData(data) {
  return request({
    url: 'api/park/delete',
    method: 'post',
    data: data
  })
}

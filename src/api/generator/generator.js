import request from '@/utils/request'

// export function getAllTable() {
//   return request({
//     url: 'api/generator/tables/all',
//     method: 'get'
//   })
// }
//
// export function generator(tableName, type) {
//   return request({
//     url: 'api/generator/' + tableName + '/' + type,
//     method: 'post',
//     responseType: type === 2 ? 'blob' : ''
//   })
// }
//
// export function save(data) {
//   return request({
//     url: 'api/generator',
//     data,
//     method: 'put'
//   })
// }
//
// export function sync(tables) {
//   return request({
//     url: 'api/generator/sync',
//     method: 'post',
//     data: tables
//   })
// }

// 智慧和杆
export function analysisDevice(param) {
  return request({
    url: '/api/overview/analysis/device',
    method: 'get',
    param
  })
}
// 智慧停车
export function parkListView(data) {
  return request({
    url: '/api/overview/park/listView',
    method: 'post',
    data
  })
}

// 车位占用率
export function parkUsedRate(data) {
  return request({
    url: '/api/overview/park/usedRate',
    method: 'post',
    data
  })
}

// 停车时长分析
export function parkParkTime(data) {
  return request({
    url: '/api/overview/park/parkTime',
    method: 'post',
    data
  })
}

// 停车压力分析
export function parkParkPressure(data) {
  return request({
    url: '/api/overview/park/parkPressure',
    method: 'post',
    data
  })
}


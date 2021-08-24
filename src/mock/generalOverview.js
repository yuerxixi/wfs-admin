import Mock from 'mockjs'

// mock.js模拟数据的规则
const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

// 导出的配置
export default [
  {
    url: '/api/park/listView',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        data: {
          '东区': {
            '一层': {
              'total': 633,
              'left': 632,
              'used': 1
            },
            '二层': {
              'total': 0,
              'left': 0,
              'used': 0
            },
            '全部': {
              'total': 0,
              'left': 0,
              'used': 0
            }
          },
          '西区': {
            '一层': {
              'total': 0,
              'left': 0,
              'used': 0
            },
            '二层': {
              'total': 0,
              'left': 0,
              'used': 0
            },
            '全部': {
              'total': 0,
              'left': 0,
              'used': 0
            }
          }
        }
      }
    }
  }
]

<template>
  <div :id="id" style="width: 100%;height: 100%" />
</template>

<script>
export default {
  name: 'LightAll',
  count: {
    type: String,
    default() {
      return '1'
    }
  },
  data() {
    return {
      dataType: [
        { value: '125个', name: '灯具总数' },
        { value: '162.2kw.h', name: '预计能耗' },
        { value: '162.2kw.h', name: '实际能耗' }
      ]
    }
  },
  computed: {
    id() {
      return `lightAll-chart${this.count}`
    }
  },
  mounted() {
    this.iCharts()
  },
  methods: {
    iCharts() {
      const iChart = this.$echarts.init(document.getElementById(this.id))
      const dataType = this.dataType
      const pass_rate = 60; const total = 100
      // 指定图表的配置项和数据
      const option = {
        legend: { // 图例组件
          x: 'center',
          y: 'bottom',
          right: 100, // 图例组件离右边的距离
          orient: 'horizontal', // 布局  纵向布局 图例标记居文字的左边 vertical则反之
          width: 40, // 图行例组件的宽度,默认自适应
          // x: 'right',   //图例显示在右边
          // y: 'center',   //图例在垂直方向上面显示居中
          itemWidth: 10, // 图例标记的图形宽度
          itemHeight: 10, // 图例标记的图形高度
          top: '20',
          left: '180',
          textAlign: 'center',
          selectedMode: false,
          textStyle: {
            rich: {
              title: {
                fontSize: 14,
                width: 70,
                color: 'rgba(255, 255, 255, 0.6)'
              },
              bili: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 14
              }
            }
          },
          formatter: function(name) {
            let value = 0
            dataType.forEach(item => {
              if (name === item.name) {
                value = item.value
              }
            })
            return ` {title|${name}}    {bili|${value}}`
          }
        },
        title: {
          zlevel: 0,
          text: [
            `{value|${pass_rate}%}`,
            '{name|亮灯率}'
          ].join('\n'),
          rich: {
            value: {
              color: '#ffffff',
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 20
            },
            name: {
              color: '#909399',
              lineHeight: 20
            }
          },
          top: 'center',
          left: '90',
          textAlign: 'center',
          textStyle: {
            rich: {
              value: {
                color: '#ffffff',
                fontSize: 26,
                fontWeight: 'bold',
                lineHeight: 40
              },
              name: {
                color: '#909399',
                lineHeight: 20
              }
            }
          }
        },
        tooltip: {// 设置鼠标移上去后会显示数据 -黑框浮层
          show: false, // 关闭鼠标移上去后显示浮框信息
          trigger: 'item',
          formatter: '{a} <br/>{b} ({d}%)'// a:头部标题 b:单项名称name c:值value d:百分比
        },
        series: [ // 系列列表
          {
            // name:'通过率'+pass_rate+'%',
            hoverAnimation: false,
            type: 'pie',
            roundCap: true,
            radius: ['60%', '75%'],
            center: ['25%', '50%'],
            // 环的位置
            label: {
              show: false,
              position: 'center'
              // normal: { // 显示的位置
              //     position: 'inner'
              // }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            data: [
              {
                value: pass_rate, // 需要显示的数据
                // name: '1111'+pass_rate+'%',
                itemStyle: {
                  color: {
                    x: 1,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    type: 'linear',
                    global: false,
                    borderRadius: 10,
                    colorStops: [{
                      offset: 0,
                      color: '#1BFDFC'
                    }, {
                      offset: 1,
                      color: '#306AFF'
                    }]
                  }
                }
              },
              {
                value: total - pass_rate,
                // 不需要显示的数据，颜色设置成和背景一样
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                }
              }
            ]
          },
          {
            // name: '灯杆总数',
            type: 'pie',
            z: 2,
            radius: ['60%', '80%'],
            center: ['25%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#141D30',
              borderWidth: 3,
              color: function(params) {
                const colorList = [
                  '#1BFDFC', '#279EEE', '#306AFF'
                ]
                return colorList[params.dataIndex]
              }
            },
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: this.dataType
          }
        ]
      }
      iChart.setOption(option)
      window.onresize = function() {
        iChart.resize()
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <div :id="id" style="width: 100%;height: 100%" />
</template>

<script>
export default {
  name: 'Clylfx',
  props: {
    count: {
      type: String,
      default() {
        return '1'
      }
    }
  },
  data() {
    return {
      xAxisData: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
      clData: [300, 250, 290, 300, 320, 350, 370, 330, 270]
    }
  },
  computed: {
    id() {
      return `clyl-chart${this.count}`
    }
  },
  mounted() {
    this.iCharts()
  },
  methods: {
    iCharts() {
      const iChart = this.$echarts.init(document.getElementById(this.id))
      const chartOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              show: false,
              backgroundColor: '#6a7985'
            },
            lineStyle: {
              color: '#204E95'
            }
          }
        },
        grid: {
          top: '12%',
          left: '6%',
          right: '6%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 14,
              color: 'rgba(255, 255, 255, 0.6)'
            },
            data: this.xAxisData
          }
        ],
        yAxis: {
          type: 'value',
          // name: '人',
          axisLine: {
            show: false,
            lineStyle: {
              color: ['#fff']
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: 'rgba(205, 208, 232, 0.6)'
          },
          splitLine: {
            lineStyle: {
              color: ['#3e505f']
            }
          }
        },
        series: [
          {
            name: '车辆占用数',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#7D50FF' // 0% 处的颜色
                }, {
                  offset: 1, color: '#FF49DF' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            lineStyle: {
              width: 1,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#FF49DF' // 0% 处的颜色
                }, {
                  offset: 1, color: '#404AD1' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            emphasis: {
              itemStyle: {
                color: '#091B52'
              }
            },
            showSymbol: false,
            data: this.clData
          }
        ]
      }
      iChart.setOption(chartOption)
      window.onresize = function() {
        iChart.resize()
      }
    }
  }
}
</script>

<style scoped>
</style>

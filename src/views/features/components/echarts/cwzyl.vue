<template>
  <div class="cwzyl-wrap">
    <div class="trigger-chart">
      <span
        class="dname"
        :class="{active: active === 1}"
        @click="triggerChart(1)"
      >西区</span>
      <span
        class="dname"
        :class="{active: active === 2}"
        @click="triggerChart(2)"
      >东区</span>
    </div>
    <div v-show="active === 1" id="cwzyl-chart" style="width: 100%;height: 100%" />
    <div v-show="active === 2" id="cwzyl-chart1" style="width: 100%;height: 100%" />
  </div>
</template>

<script>
import { parkUsedRate } from '../../../../api/generator/generator'

export default {
  name: 'Cwzyl',
  data() {
    return {
      active: 1,
      eastData: {
        time: [],
        bigCarData: [],
        miniCarData: []
      },
      westData: {
        time: [],
        bigCarData: [],
        miniCarData: []
      }
    }
  },
  mounted() {
    // 车位占用率
    parkUsedRate().then(res => {
      this.eastData.time = []
      this.eastData.bigCarData = []
      this.eastData.miniCarData = []
      this.westData.time = []
      this.westData.bigCarData = []
      this.westData.miniCarData = []
      Object.keys(res.data.east.big).forEach(key => {
        this.eastData.time.push(key)
        this.eastData.bigCarData.push(res.data.east.big[key])
      })
      Object.keys(res.data.east.small).forEach(key => {
        this.eastData.miniCarData.push(res.data.east.small[key])
      })
      Object.keys(res.data.west.big).forEach(key => {
        this.westData.time.push(key)
        this.westData.bigCarData.push(res.data.west.big[key])
      })
      Object.keys(res.data.west.small).forEach(key => {
        this.westData.miniCarData.push(res.data.west.small[key])
      })
      this.iCharts()
    })
  },
  methods: {
    triggerChart(value) {
      this.active = value
      this.$nextTick(() => {
        this.iCharts1()
      })
    },
    iCharts() {
      const iChart = this.$echarts.init(document.getElementById('cwzyl-chart'))
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
          top: '28%',
          left: '5.5%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['大车', '小车'],
          top: '8.5%',
          left: '32%',
          itemGap: 30,
          textStyle: {
            color: '#fff'
          },
          icon: 'line'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#093969'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 6,
              color: '#6D9AE1'
            },
            data: this.westData.time
          }
        ],
        yAxis: {
          type: 'value',
          name: '%',
          nameLocation: 'end',
          nameGap: 2,
          nameTextStyle: {
            color: '#6D9AE1',
            padding: [0, 0, 0, 22]
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: ['#093969']
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '大车',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#1081F9'
            },
            lineStyle: {
              width: 2,
              color: '#1081F9'
            },
            emphasis: {
              itemStyle: {
                color: '#091B52'
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#0956B9' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063976' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.westData.bigCarData
          },
          {
            name: '小车',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#08F2F0'
            },
            lineStyle: {
              width: 2,
              color: '#08F2F0'
            },
            emphasis: {
              itemStyle: {
                color: '#091B52'
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#05939F' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063976' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.westData.miniCarData
          }
        ]
      }
      iChart.setOption(chartOption)
      // window.onresize = function() {
      //   iChart.resize()
      // }
    },
    iCharts1() {
      const iChart = this.$echarts.init(document.getElementById('cwzyl-chart1'))
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
          top: '28%',
          left: '5.5%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['大车', '小车'],
          top: '8.5%',
          left: '32%',
          itemGap: 30,
          textStyle: {
            color: '#fff'
          },
          icon: 'line'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              show: true,
              lineStyle: {
                color: '#093969'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 6,
              color: '#6D9AE1'
            },
            data: this.eastData.time
          }
        ],
        yAxis: {
          type: 'value',
          name: '%',
          nameLocation: 'end',
          nameGap: 2,
          nameTextStyle: {
            color: '#6D9AE1',
            padding: [0, 0, 0, 22]
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: ['#093969']
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '大车',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#1081F9'
            },
            lineStyle: {
              width: 2,
              color: '#1081F9'
            },
            emphasis: {
              itemStyle: {
                color: '#091B52'
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#0956B9' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063976' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.eastData.bigCarData
          },
          {
            name: '小车',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#08F2F0'
            },
            lineStyle: {
              width: 2,
              color: '#08F2F0'
            },
            emphasis: {
              itemStyle: {
                color: '#091B52'
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#05939F' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063976' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.eastData.miniCarData
          }
        ]
      }
      iChart.setOption(chartOption)
      // window.onresize = function() {
      //   iChart.resize()
      // }
    }
  }
}
</script>

<style scoped lang="scss">
.cwzyl-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 12px;
  .trigger-chart{
    width: 92%;
    border-bottom: 1px solid rgba(48, 71, 113, 1);
    display: flex;
    .dname{
      width: 84px;
      text-align: center;
      padding: 0 14px 8px;
      font-size: 16px;
      cursor: pointer;
      &:first-child{
        margin-left: 14px;
      }
      &:last-child{
        margin-left: 60px;
      }
    }
    .active{
      border-bottom: 2px solid rgba(255, 191, 0, 1);
      color: #FFBF00;
    }
  }
}
</style>

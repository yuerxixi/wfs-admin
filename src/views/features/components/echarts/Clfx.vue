<template>
  <div class="clfx-wrap">
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
      <!--      <div class="date-name-wrap">
        <span
          class="date-name"
          :class="{dateActive: dateActive === 1}"
          @click="triggerDateChart(1)"
        >日</span>
        <span
          class="date-name"
          :class="{dateActive: dateActive === 2}"
          @click="triggerDateChart(2)"
        >月</span>
        <span
          class="date-name"
          :class="{dateActive: dateActive === 3}"
          @click="triggerDateChart(3)"
        >年</span>
      </div>-->
    </div>
    <div v-show="active === 1" id="clfx-chart" style="width: 100%;height: 100%" />
    <div v-show="active === 2" id="clfx-chart1" style="width: 100%;height: 100%" />
  </div>
</template>

<script>
import { parkParkPressure } from '../../../../api/generator/generator'

export default {
  name: 'Clfx',
  props: {
    data: { type: Object, default: () => {} }
  },
  data() {
    return {
      active: 1,
      westData: {
        time: [],
        today: [],
        yesterday: []
      },
      eastData: {
        time: [],
        today: [],
        yesterday: []
      },
      dateActive: 1,
      clfxXData: ['9:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'],
      prevData: [400, 250, 290, 300, 520, 350, 170],
      nowData: [200, 280, 490, 320, 260, 310, 350]
    }
  },
  mounted() {
    // 车位压力
    parkParkPressure().then(res => {
      this.eastData.time = []
      this.eastData.today = []
      this.eastData.yesterday = []
      this.westData.time = []
      this.westData.today = []
      this.westData.yesterday = []
      Object.keys(res.data.east.today).forEach(key => {
        this.eastData.time.push(key)
        this.eastData.today.push(res.data.east.today[key])
      })
      Object.keys(res.data.east.yesterday).forEach(key => {
        this.eastData.yesterday.push(res.data.east.yesterday[key])
      })
      Object.keys(res.data.west.today).forEach(key => {
        this.westData.time.push(key)
        this.westData.today.push(res.data.west.today[key])
      })
      Object.keys(res.data.west.yesterday).forEach(key => {
        this.westData.yesterday.push(res.data.west.yesterday[key])
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
    triggerDateChart(value) {
      this.dateActive = value
    },
    iCharts() {
      const iChart = this.$echarts.init(document.getElementById('clfx-chart'))
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
          data: ['今日', '昨日'],
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
            name: '昨日',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#FFB400'
            },
            lineStyle: {
              width: 2,
              color: '#FFB400'
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
                  offset: 0, color: '#84722C' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063A77' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.westData.yesterday
          },
          {
            name: '今日',
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
                  offset: 0, color: '#0594A0' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063A77' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.westData.today
          }
        ]
      }
      iChart.setOption(chartOption)
      // window.onresize = function() {
      //   iChart.resize()
      // }
    },
    iCharts1() {
      const iChart = this.$echarts.init(document.getElementById('clfx-chart1'))
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
          data: ['今日', '昨日'],
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
            name: '昨日',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#FFB400'
            },
            lineStyle: {
              width: 2,
              color: '#FFB400'
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
                  offset: 0, color: '#84722C' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063A77' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.eastData.yesterday
          },
          {
            name: '今日',
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
                  offset: 0, color: '#0594A0' // 0% 处的颜色
                }, {
                  offset: 1, color: '#063A77' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.eastData.today
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
.clfx-wrap{
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
      flex: 0 0 84px;
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
    .date-name-wrap{
      flex: auto;
      display: flex;
      justify-content: flex-end;
      .date-name{
        width: auto;
        margin-left: 13px;
        font-size: 14px;
        color: #B1B7C9;
        cursor: pointer;
      }
      .dateActive{
        color: #006CFF;
      }
    }
  }
}
</style>

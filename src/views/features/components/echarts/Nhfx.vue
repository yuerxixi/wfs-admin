<template>
  <div class="nhfx-wrap">
    <div class="ydl-wrap">
      <div class="sum-wrap">
        <span class="title">用电总量</span>
        <span class="num">{{ totalNum }}</span>
        <span class="dw">kw</span>
      </div>
      <div class="day-content">
        <div class="day-wrap">
          <span class="title">当日</span>
          <span class="num">{{ todayNum }}</span>
          <span class="dw">kw</span>
        </div>
        <div class="day-wrap">
          <span class="title">昨日</span>
          <span class="num" style="color: #D0ECFF;">{{ yesterdayNum }}</span>
          <span class="dw" style="color: #D0ECFF;">kw</span>
        </div>
      </div>
    </div>
    <div id="nhfx-chart" class="charts" />
  </div>
</template>

<script>
import { getEnergyData } from '../../../../api/visual/generalOverview'
export default {
  name: 'Nhfx',
  data() {
    return {
      totalNum: 0,
      todayNum: 0,
      yesterdayNum: 0,
      // xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // eastData: [400, 250, 290, 300, 520, 350, 170],
      // westData: [200, 280, 490, 320, 260, 310, 350]
      xAxisData: [],
      eastData: [],
      westData: []
    }
  },
  mounted() {
    this.getEnergy()
  },
  methods: {
    getEnergy() {
      getEnergyData().then(res => {
        this.totalNum = res.data.total
        this.todayNum = res.data.today
        this.yesterdayNum = res.data.yesterday
        res.data.month['WEST'].forEach(item => {
          this.xAxisData.push(+item.month + '月')
          this.westData.push(item.energy)
        })
        res.data.month['EAST'].forEach(item => {
          this.eastData.push(item.energy)
        })
        this.xAxisData.reverse()
        this.iCharts1()
      })
    },
    iCharts1() {
      const iChart = this.$echarts.init(document.getElementById('nhfx-chart'))
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
          top: '26%',
          left: '4.1%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['东区', '西区'],
          top: '8%',
          left: '27%',
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
            data: this.xAxisData
          }
        ],
        yAxis: {
          type: 'value',
          name: 'kw',
          nameLocation: 'end',
          nameGap: 2,
          nameTextStyle: {
            color: '#6D9AE1',
            padding: [0, 0, 0, 13]
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
            name: '西区',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#422BD5'
            },
            lineStyle: {
              width: 2,
              color: '#422BD5'
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
                  offset: 0, color: '#2914A9' // 0% 处的颜色
                }, {
                  offset: 1, color: '#091D3A' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.westData
          },
          {
            name: '东区',
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#00A2FF'
            },
            lineStyle: {
              width: 2,
              color: '#00A2FF'
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
                  offset: 0, color: '#044B81' // 0% 处的颜色
                }, {
                  offset: 1, color: '#091D3A' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
            showSymbol: false,
            data: this.eastData
          }
        ]
      }
      iChart.setOption(chartOption)
    }
  }
}
</script>

<style scoped lang="scss">
.nhfx-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  position: relative;
  .ydl-wrap{
    margin-left: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .sum-wrap{
      flex: 0 0 220px;
      >.title{
        font-size: 14px;
      }
      >.num{
        margin-left: 6px;
        font-size: 28px;
        font-family: OVERVIEW-NUM;
        font-weight: bold;
      }
      >.dw{
        font-size: 20px;
        font-family: OVERVIEW-NUM;
      }
    }
    .day-content{
      flex: auto;
      display: flex;
      justify-content: flex-end;
      margin-right: 14px;
      .day-wrap{
        font-size: 0;
        padding-bottom: 4px;
        &:last-child{
          margin-left: 18px;
        }
        .title{
          font-size: 14px;
        }
        .num{
          margin-left: 9px;
          font-size: 20px;
          font-family: OVERVIEW-NUM;
        }
        .dw{
          font-size: 16px;
          margin-left: 1px;
          font-family: OVERVIEW-NUM;
        }
      }
    }
  }
}
.charts{
  width: 100%;
  height: 100%;
}
</style>

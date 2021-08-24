<template>
  <div class="tcscfx-wrap">
    <div id="tcscfx-chart" style="width: 100%;height: 100%;" />
  </div>
</template>

<script>
import { getParkTimeData } from '../../../../api/visual/generalOverview'
export default {
  name: 'Tcscfx',
  data() {
    return {
      timeData: ['<0.5', '0.5-1', '1-2', '>2'],
      eastBigCarData: [],
      eastMiniCarData: [],
      westBigCarData: [],
      westMiniCarData: []
    }
  },
  mounted() {
    this.parkTime()
  },
  methods: {
    parkTime() {
      getParkTimeData().then(res => {
        const { eastBig, eastSmall, westBig, westSmall } = res.data
        // 东区
        this.eastBigCarData.push(eastBig['0.5小时以下'])
        this.eastBigCarData.push(eastBig['0.5-1小时'])
        this.eastBigCarData.push(eastBig['1-2小时'])
        this.eastBigCarData.push(eastBig['2小时以上'])
        this.eastMiniCarData.push(eastSmall['0.5小时以下'])
        this.eastMiniCarData.push(eastSmall['0.5-1小时'])
        this.eastMiniCarData.push(eastSmall['1-2小时'])
        this.eastMiniCarData.push(eastSmall['2小时以上'])
        // 西区
        this.westBigCarData.push(-westBig['0.5小时以下'])
        this.westBigCarData.push(-westBig['0.5-1小时'])
        this.westBigCarData.push(-westBig['1-2小时'])
        this.westBigCarData.push(-westBig['2小时以上'])
        this.westMiniCarData.push(-westSmall['0.5小时以下'])
        this.westMiniCarData.push(-westSmall['0.5-1小时'])
        this.westMiniCarData.push(-westSmall['1-2小时'])
        this.westMiniCarData.push(-westSmall['2小时以上'])
        this.iCharts()
      })
    },
    iCharts() {
      const iChart = this.$echarts.init(document.getElementById('tcscfx-chart'))
      const iChartOption = {
        title: {
          text: `西区                   东区`,
          show: true,
          left: '28%',
          top: '0%',
          textStyle: {
            color: '#fff',
            fontWeight: 400,
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          // 鼠标移入条形图提示层文字的自定义
          formatter(params) {
            let res = params[0].name + '小时'
            params.forEach((item, index) => {
              const seriesName = index < 2 ? '东区' + item.seriesName : '西区' + item.seriesName
              // const circle = `<i class="iconfont el-icon-delete" style="margin-right:4px;font-size:14px;color:${params[index].color}"></i>`
              const circle = `<div style="display: inline-block;width: 8px;height: 8px;border-radius: 50%;background-color: ${params[index].color};margin-right: 4px;"></div>`
              res += `<br/>&nbsp;&nbsp;${circle}${seriesName}：${Math.abs(item.value)}&nbsp;&nbsp;&nbsp;`
            })
            return res
          }
        },
        legend: {
          data: ['小车', '大车'],
          left: '84%',
          top: '4%',
          orient: 'vertical',
          icon: 'rect',
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: '#FFFFFF',
            padding: [0, 0, 0, 2]
          }
        },
        grid: {
          left: '3%',
          top: '18%',
          right: '22%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            name: '辆',
            nameTextStyle: {
              color: '#C8DDFF'
            },
            // 设置x轴线的属性
            axisLine: {
              lineStyle: {
                color: '#3F76E2'
              }
            },
            axisLabel: {
              color: '#C8DDFF',
              formatter(value) {
                return Math.abs(value) // 负数取绝对值变正数（x轴本来数据是正负才能分开两边展示的，所以我们只是把负数处理为正数在视觉上显示）
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            name: '小时',
            nameLocation: 'end',
            nameGap: 2,
            nameTextStyle: {
              color: '#C8DDFF',
              padding: [0, 0, 0, -362]
            },
            type: 'category',
            axisTick: {
              show: false
            },
            // 设置y轴线的属性
            axisLine: {
              lineStyle: {
                color: '#3F76E2'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: '#C8DDFF',
              margin: 22
            },
            data: this.timeData
          }
        ],
        color: ['#98d87d', '#49a9ee'],
        series: [
          {
            name: '小车',
            type: 'bar',
            stack: 'bind2',
            barMaxWidth: '22',
            data: this.eastMiniCarData,
            barGap: '30%',
            itemStyle: {
              color: '#00ECFF'
            }
          },
          {
            name: '大车',
            type: 'bar',
            stack: 'bind1',
            barMaxWidth: '22',
            data: this.eastBigCarData,
            itemStyle: {
              color: '#0064FF'
            }
          },
          {
            name: '小车',
            type: 'bar',
            stack: 'bind1',
            barMaxWidth: '22',
            data: this.westMiniCarData,
            itemStyle: {
              color: '#00ECFF'
            }
          },
          {
            name: '大车',
            type: 'bar',
            stack: 'bind2',
            barMaxWidth: '22',
            data: this.westBigCarData,
            itemStyle: {
              color: '#0064FF'
            }
          }
        ]
      }
      iChart.setOption(iChartOption)
      // window.onresize = function() {
      //   iChart.resize()
      // }
    }
  }
}
</script>

<style scoped lang="scss">
.tcscfx-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 8px;
}
</style>

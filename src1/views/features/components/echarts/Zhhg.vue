<template>
  <div class="zhhg-wrap">
    <div class="device-wrap">
      <div class="device-col" style="margin-left: 8.2%;">
        <span class="title">设备总数</span>
        <span class="num">{{ zhhgData.deviceTotal }}</span>
      </div>
      <div class="device-col" style="margin-left: 17%;">
        <span class="title">在线设备</span>
        <span class="num">{{ zhhgData.onDeviceTotal }}</span>
      </div>
      <div class="device-col" style="margin-left: 17%;">
        <span class="title">异常设备</span>
        <span class="num" style="color: #FF0C00;">{{ zhhgData.abnormalDeviceTotal }}</span>
      </div>
    </div>
    <div class="trigger-chart">
      <span
        class="dname"
        :class="{active: active === 1}"
        @click="triggerChart(1)"
      >挂载设备</span>
      <span
        class="dname"
        :class="{active: active === 2}"
        @click="triggerChart(2)"
      >灯杆 / 灯具</span>
    </div>
    <div v-show="active === 1" class="charts-wrap">
      <div id="gzsb" class="charts" />
      <div class="gzsb-wrap">
        <span class="title">挂载总数</span>
        <span class="num">{{ zhhgData.mountDeviceTotal }}</span>
      </div>
      <div class="gzsb-zxl-wrap">
        <span class="title">设备在线率</span>
        <span class="num">{{ Math.round(zhhgData.onDeviceRate *100) }}%</span>
      </div>
    </div>
    <div v-show="active === 2" class="charts-wrap">
      <div id="dg-dj" class="charts" />
      <div class="gzsb-wrap">
        <span class="title">灯具总数</span>
        <span class="num">{{ zhhgData.lampTotal }}</span>
      </div>
      <div class="gzsb-zxl-wrap">
        <span class="title">亮灯率</span>
        <span class="num">{{ Math.round(zhhgData.lampRate *100) }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { analysisDevice } from '../../../../api/generator/generator'

export default {
  name: 'Zhhg',
  props: {
    data: { type: Object, default: () => {} }
  },
  data() {
    return {
      active: 1,
      mountDeviceList: [],
      zhhgData: {},
      lamppostList: []
    }
  },
  mounted() {
    // 智慧合杆
    analysisDevice().then(res => {
      this.zhhgData = res.data
      this.mountDeviceList = res.data.mountDeviceList.map(i => {
        return {
          value: i.num,
          name: i.deviceModel
        }
      })
      this.lamppostList = res.data.lamppostList.map(i => {
        return {
          value: i.num,
          name: i.deviceModel
        }
      })
      this.iCharts1()
    })
  },
  methods: {
    triggerChart(value) {
      this.active = value
      this.$nextTick(() => {
        this.iCharts2()
      })
    },
    iCharts1() {
      const iChart = this.$echarts.init(document.getElementById('gzsb'))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: '45%',
        //   top: '8%',
        //   height: '100%',
        //   icon: 'circle',
        //   itemWidth: 10,
        //   itemHeight: 10,
        //   textStyle: {
        //     color: '#FFFFFF',
        //     padding: [4, 0, 0, 2],
        //     fontSize: 12
        //   }
        // },
        series: [
          {
            name: '挂载设备',
            type: 'pie',
            radius: ['60%', '78%'],
            center: ['30%', '60%'],
            label: {
              show: false,
              formatter: {},
              color: '#6D9AE1',
              fontSize: 10
            },
            hoverAnimation: false,
            labelLine: {
              show: false,
              length: 0,
              length2: 10
            },
            itemStyle: {
              color: params => {
                const colorList = [
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#14419C'
                  }, {
                    offset: 1,
                    color: '#0066FF'
                  }]),
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#6975DD'
                  }, {
                    offset: 1,
                    color: '#7355B0'
                  }]),
                  '#309BFF',
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#183D8A'
                  }, {
                    offset: 0.5,
                    color: '#617DB6'
                  }, {
                    offset: 1,
                    color: '#9BB0DA'
                  }]),
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#75F8D2'
                  }, {
                    offset: 1,
                    color: '#2AE3FC'
                  }]),
                  '#0E2653',
                  '#0064FF',
                  '#004D85',
                  '#09A366',
                  '#ECB305'
                ]
                return colorList[params.dataIndex]
              }
            },
            data: this.mountDeviceList
          }
        ]
      }
      iChart.setOption(option)
    },
    iCharts2() {
      const iChart = this.$echarts.init(document.getElementById('dg-dj'))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        },
        series: [
          {
            name: '灯杆灯具',
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['30%', '60%'],
            label: {
              show: false,
              formatter: {},
              color: '#6D9AE1',
              fontSize: 10
            },
            hoverAnimation: false,
            labelLine: {
              show: false,
              length: 2,
              length2: 10
            },
            itemStyle: {
              color: params => {
                const colorList = [
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#14419C'
                  }, {
                    offset: 1,
                    color: '#0066FF'
                  }]),
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#6975DD'
                  }, {
                    offset: 1,
                    color: '#7355B0'
                  }]),
                  '#309BFF',
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#183D8A'
                  }, {
                    offset: 0.5,
                    color: '#617DB6'
                  }, {
                    offset: 1,
                    color: '#9BB0DA'
                  }]),
                  new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#75F8D2'
                  }, {
                    offset: 1,
                    color: '#2AE3FC'
                  }]),
                  '#0E2653'
                ]
                return colorList[params.dataIndex]
              }
            },
            data: this.lamppostList
          }
        ]
      }
      iChart.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
.zhhg-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.device-wrap{
  width: 100%;
  height: 38%;
  display: flex;
  padding-top: 13px;
  .device-col{
    display: flex;
    flex-direction: column;
    .title{
      font-size: 16px;
      color: #FFFFFF;
      line-height: 14px;
    }
    .num{
      margin-top: 8px;
      font-size: 34px;
      font-weight: bold;
      font-family: OVERVIEW-NUM;
      color: #FFFFFF;
    }
  }
}
.trigger-chart{
  width: 94%;
  border-bottom: 1px solid rgba(48, 71, 113, 1);
  display: flex;
  margin-left: 12px;
  .dname{
    padding: 0 14px 8px;
    font-size: 16px;
    cursor: pointer;
    &:first-child{
      margin-left: 14px;
    }
    &:last-child{
      margin-left: 40px;
    }
  }
  .active{
    border-bottom: 2px solid rgba(255, 191, 0, 1);
    color: #FFBF00;
  }
}
.charts-wrap{
  position: relative;
  flex: auto;
  .gzsb-wrap{
    position: absolute;
    left: 25%;
    top: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title{
      font-size: 12px;
    }
    .num{
      margin-top: 4px;
      font-size: 20px;
      font-family: OVERVIEW-NUM;
      font-weight: bold;
    }
  }
  .gzsb-zxl-wrap{
    position: absolute;
    left: 55%;
    top: 24%;
    display: flex;
    flex-direction: column;
    .title{
      font-size: 14px;
    }
    .num{
      margin-top: 14px;
      font-size: 36px;
      font-family: OVERVIEW-NUM;
      font-weight: bold;
    }
  }
}
.charts{
  width: 100%;
  height: 100%;
}
</style>

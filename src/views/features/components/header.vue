<template>
  <div class="overview-bar">
    <div class="overview-bar-content">
      <div class="bar-weather">
        <span class="temps">{{ weatherData.temps }}°</span>
        <div class="humidty-wrap">
          <span class="wins">风速 {{ weatherData.wins }}</span>
          <span class="humidty">湿度{{ weatherData.humidty }}%</span>
        </div>
        <div class="pm25-wrap">
          <span class="title">空气质量</span>
          <span class="pm25">{{ weatherData.kqLevel }}</span>
        </div>
      </div>
      <div class="bar-title">
        <span class="title">扬州广陵智慧服务区</span>
      </div>
      <div class="bar-time">
        <div class="dates">
          <span class="date">{{ date }}</span>
          <span class="week">{{ week }}</span>
        </div>
        <div class="time">{{ time }}</div>
        <!--        <img-->
        <!--          class="btn-setup"-->
        <!--          src="../../../assets/wfs/overview/icon-htgl.png"-->
        <!--          @click="gotoBackstage"-->
        <!--        >-->
        <svg-icon
          :icon-class="setup"
          class-name="btn-setup"
          @click="gotoBackstage"
          @mouseover="setup = 'setup-click'"
          @mouseout="setup = 'setup'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getWeatherData } from '../../../api/visual/generalOverview'

export default {
  name: 'DpHeader',
  props: {
    hname: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      time: '',
      date: '',
      week: '',
      routePath: '',
      weatherData: {},
      dsq: null,
      setup: 'setup'
    }
  },
  created() {
    this.clockUpdate()
    const route = this.$store.state.permission.addRouters.find(item => {
      return item.name !== '综合概览' && item.name !== '全景展示'
    })
    this.routePath = route.children[0].path
  },
  mounted() {
    this.getWeather()
  },
  beforeDestroy() {
    clearInterval(this.dsq)
  },
  methods: {
    clockUpdate() {
      this.dsq = setInterval(() => {
        this.updateTime()
      }, 1000)
    },
    updateTime() {
      const cd = new Date()
      const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
      this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth() + 1, 2) + '-' + this.zeroPadding(cd.getDate(), 2)
      this.week = week[cd.getDay()]
    },
    zeroPadding(num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
    gotoBackstage() {
      this.$router.push(this.routePath)
    },
    getWeather() {
      getWeatherData().then(res => {
        this.weatherData = res.sensorInfo
        const pm25 = res.sensorInfo.pm25
        if (pm25 > 0 && pm25 <= 50) {
          this.weatherData.kqLevel = '优'
        } else if (pm25 <= 100) {
          this.weatherData.kqLevel = '良'
        } else if (pm25 <= 150) {
          this.weatherData.kqLevel = '轻度'
        } else if (pm25 <= 200) {
          this.weatherData.kqLevel = '中度'
        } else if (pm25 <= 300) {
          this.weatherData.kqLevel = '重度'
        } else {
          this.weatherData.kqLevel = '严重'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-bar{
  width: 100%;
  height: 7.87%;
  background:url("../../../assets/wfs/overview/header-bg3.png") no-repeat;
  background-size:100% 100%;
  color: #fff;
  .overview-bar-content{
    display: flex;
    //justify-content: space-between;
    align-items: center;
    position: relative;
    height: 100%;
    .bar-weather{
      flex: 1 1 40%;
      display: flex;
      align-items: center;
      padding-top: 8px;
      .temps{
        margin-left: 110px;
        font-size: 30px;
        font-weight: bold;
        font-family: OVERVIEW-NUM;
        color: #D0ECFF;
      }
      .humidty-wrap{
        display: flex;
        flex-direction: column;
        margin-left: 26px;
        padding-right: 18px;
        border-right: 1px solid #37515E;
        .wins{
          font-size: 14px;
          color: #D0ECFF;
        }
        .humidty{
          margin-top: 6px;
          font-size: 14px;
          color: #FFFFFF;
        }
      }
      .pm25-wrap{
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        .title{
          font-size: 14px;
          color: #D0ECFF;
        }
        .pm25{
          width: 54px;
          height: 18px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(42, 64, 75, 0);
          border: 1px solid #214583;
          border-radius: 10px;
          font-size: 12px;
          color: #05EE28;
        }
      }
    }
    .bar-title{
      flex: 0 0 320px;
      height: 40px;
      .title{
        height: 40px;
        font-size: 34px;
        color: #FFFFFF;
        font-weight: bold;
        font-family: FZHei-B01S;
      }
    }
    .bar-time{
      flex: 1 1 40%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-top: 10px;
      z-index: 9;
      .dates{
        width: 130px;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #37515E;
        .date{
          font-size: 14px;
          letter-spacing: 1.2px;
          font-weight: 500;
          color: #EEF7FF;
        }
        .week{
          margin-top: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #EEF7FF;
        }
      }
      .time{
        width: 143px;
        height: 28px;
        margin: 0 70px 0 20px;
        font-size: 30px;
        font-weight: 500;
        font-family: OVERVIEW-NUM;
        letter-spacing: 3px;
        color: #EEF7FF;
      }
      .btn-setup{
        width: 32px;
        height: 32px;
        margin-right: 54px;
        cursor: pointer;
      }
    }
  }
}
</style>

<template>
  <div style="width: 100%;height: 100%">
    <div class="overview">
      <dp-header
        hname="综合概览"
      />
      <div class="overview-content">
        <div id="vessel">
          <!--    左边可视化数据-->
          <div class="vessel-left">
            <div class="public-box-height" style="height: 32.87%">
              <div class="lamp-type-title">
                <span class="public-title">智慧合杆</span>
                <div class="line" />
              </div>
              <div class="lamp-type-data">
                <zhhg />
              </div>
            </div>
            <div class="public-box-height" style="height: 26.63%">
              <div class="lamp-type-title">
                <span class="public-title">能耗分析</span>
                <div class="line" />
              </div>
              <div class="lamp-type-data">
                <nhfx />
              </div>
            </div>
            <div class="public-box-height" style="height: 35.5%">
              <div class="lamp-type-title">
                <span class="public-title">告警事件</span>
                <div class="line" />
              </div>
              <div class="lamp-type-data">
                <gjsj />
              </div>
            </div>
          </div>
          <!--    停车位主图-->
          <div class="vessel-center">
            <east-parking v-if="active === 'east'" />
            <west-parking v-else-if="active === 'west'" />
          </div>
          <!--    右边边可视化数据-->
          <div class="vessel-right">
            <div class="public-box-height" style="height: 20.04%">
              <div class="lamp-type-title">
                <span class="public-title">智慧停车</span>
                <div class="line" />
              </div>
              <div class="lamp-type-data">
                <zhtc />
              </div>
            </div>
            <div class="public-box-height" style="height: 25.49%">
              <div class="lamp-type-title">
                <span class="public-title">车位占用率</span>
                <div class="line" />
              </div>
              <div class="lamp-type-data">
                <cwzyl />
              </div>
            </div>
            <div class="public-box-height" style="height: 22.74%">
              <div class="lamp-type-title">
                <span class="public-title">停车时长分析</span>
                <div class="line" />
              </div>
              <div class="lamp-type-data">
                <tcscfx />
              </div>
            </div>
            <div class="public-box-height" style="height: 24.91%">
              <div class="lamp-type-title">
                <span class="public-title">车流分析</span>
                <div class="line" />
              </div>
              <div class="lamp-type-data">
                <clfx />
              </div>
            </div>
          </div>
          <!-- 页面中间按钮-->
          <div class="vessel-top-btns">
            <div class="region-btns">
              <el-button
                :class="['region-button', { active: active === 'west' }]"
                type="text"
                @click="changeParking('west')"
              ><span>西区</span></el-button>
              <el-button
                :class="['region-button', { active: active === 'east' }]"
                type="text"
                @click="changeParking('east')"
              ><span>东区</span></el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg" />
  </div>
</template>

<script>
import DpHeader from './components/header'
import EastParking from './components/echarts/eastParking'
import WestParking from './components/echarts/westParking'
import Zhhg from './components/echarts/Zhhg'
import Nhfx from './components/echarts/Nhfx'
import Gjsj from './components/echarts/Gjsj'
import Zhtc from './components/echarts/Zhtc'
import Cwzyl from './components/echarts/cwzyl'
import Tcscfx from './components/echarts/tcscfx'
import Clfx from './components/echarts/Clfx'

export default {
  name: 'GeneralOverview',
  components: {
    Clfx,
    Tcscfx,
    Cwzyl,
    Zhtc,
    Gjsj,
    Nhfx,
    Zhhg,
    DpHeader,
    WestParking,
    EastParking
  },
  data() {
    return {
      active: 'west'
    }
  },
  methods: {
    changeParking(type) {
      this.active = type
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.overview{
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  background: url("../../assets/wfs/overview/overview-bg1.png") no-repeat 50% 100%;
  background-size: 200% 100%;
  overflow: hidden;
}
.bg{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #010F27, #132B5C, #051432);
}
.overview-content{
  display: flex;
  //height:calc(100vh - 172px);
  height: 92.13%;
  padding: 10px 20px 17px 20px;
}

#vessel{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  color:#ffffff;
  //overflow: hidden;
  .vessel-left{
    flex: 0 0 25.4%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: -478px;
    animation: into-left 1.4s ease forwards;
  }
  @keyframes into-left
  {
    100% {margin-left: 0}
  }
  .vessel-right{
    flex: 0 0 25.4%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: -478px;
    animation: into-right 1.4s ease forwards;
  }
  @keyframes into-right
  {
    100% {margin-right: 0}
  }
  .vessel-top-btns{
    position: absolute;
    top: 3.2%;
    left: 43.8%;
    .region-btns{
      display: flex;
      .region-button{
        width: 100px;
        height: 48px;
        background: url("../../assets/wfs/overview/icon-area-normal.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        span{
          font-size: 24px;
          color: #97A2B7;
        }
        &:last-child{
          margin-left: 32px;
        }
      }
      .active{
        background: url("../../assets/wfs/overview/icon-area-active.png") no-repeat;
        background-size: 100% 100%;
        span{
          font-size: 24px;
          color: #FFFFFF;
        }
      }
    }
  }
}
.public-box-height{
  width: 100%;
  padding: 12.5px 0 0 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 99;
  background: linear-gradient(0deg, rgba(15, 37, 49, 0.2), rgba(12, 45, 122, 0.3));
  border-radius: 8px;
  .lamp-type-title{
    .public-title{
      height: 20px;
      font-size: 16px;
      font-weight: bold;
      color: #DFF2FF;
    }
    .line{
      width: 94%;
      height: 7px;
      background: url("../../assets/wfs/overview/block-line-bg.png") no-repeat;
      margin-top: 7px;
    }
  }
  .lamp-type-data{
    flex: auto;
  }
  &:first-child{
    margin-top: 10px;
  }
}
.vessel-center{
  width: 1200px;
  height: 624px;
}
.device-model-wrap{
  position: absolute;
  z-index: 999;
}
</style>

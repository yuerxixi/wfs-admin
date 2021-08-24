<template>
  <div class="device-wrap">
    <div class="header" :class="{'alarm-header': deviceData.status === '离线'}" @click="showAlarmDialog">
      <span class="device-type">灯具</span>
      <svg-icon v-if="deviceData.status === '离线'" icon-class="alarm2" class-name="icon-alarm" />
    </div>
    <div class="content">
      <div class="row">
        <span class="title">名称：</span>
        <span class="name">{{ deviceData.deviceName }}</span>
      </div>
      <div class="row" :class="{'on-line': deviceData.status === '在线', 'off-line': deviceData.status === '离线'}">
        <span class="title">状态：</span>
        <span class="circle" />
        <span class="status">{{ deviceData.status }}</span>
      </div>
      <div class="row dim-wrap">
        <span class="title">亮度：</span>
        <span class="close">关</span>
        <el-slider
          v-model="deviceDim"
          :step="20"
          @change="changeDeviceDim"
        />
        <span class="open">开</span>
      </div>
    </div>
  </div>
</template>

<script>
import { setDeviceDim } from '../../../../api/visual/generalOverview'
export default {
  name: 'Dengju',
  props: {
    deviceData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      deviceDim: this.deviceData.dim
    }
  },
  methods: {
    // 显示报警弹框
    showAlarmDialog() {
      if (this.deviceData.status === '离线') {
        this.$emit('showAlarmDialog')
      }
    },
    // 调光
    changeDeviceDim(value) {
      setDeviceDim({
        deviceId: this.deviceData.deviceId,
        light: value
      }).then(res => {
        // console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.device-wrap{
  width: 180px;
  height: 132px;
  background: rgba(17, 51, 108, 0.53);
  box-shadow: 0 2px 24px 0 rgba(21, 29, 85, 0.67);
  color: #fff;
  .header{
    width: 100%;
    height: 28px;
    background: #1C55C8;
    display: flex;
    align-items: center;
    .device-type{
      font-size: 14px;
      margin-left: 14px;
    }
    .icon-alarm{
      margin-right: 12px;
      width: 15px;
      height: 16px;
    }
  }
  .alarm-header{
    background: #A71515;
    justify-content: space-between;
    cursor: pointer;
  }
  .content{
    width: 100%;
    height: 104px;
    padding: 13px 0 0 13px;
    .row{
      margin-bottom: 18px;
      height: 14px;
      line-height: 14px;
      .title{
        font-size: 14px;
        opacity: 0.8;
      }
      .name{
        font-size: 14px;
      }
    }
    .on-line{
      display: flex;
      align-items: center;
      .circle{
        width: 5px;
        height: 5px;
        background: #00FF48;
        border-radius: 50%;
        margin: 0 5px 0 5px;
      }
      .status{
        font-size: 14px;
        color: #00FF48;
      }
    }
    .off-line{
      display: flex;
      align-items: center;
      .circle{
        width: 5px;
        height: 5px;
        background: #FFFFFF;
        opacity: 0.5;
        border-radius: 50%;
        margin: 0 5px 0 5px;
      }
      .status{
        font-size: 14px;
        color: #FFFFFF;
        opacity: 0.5;
      }
    }
    .dim-wrap{
      display: flex;
      align-items: center;
      >>> .el-slider{
        width: 60px;
        margin: 0 7px;
        .el-slider__runway{
          height: 4px;
          border-radius: 0;
          background: #666668;
          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.85);
          .el-slider__bar{
            height: 4px;
            background: linear-gradient(90deg, rgba(0, 255, 72, 0.9), rgba(79, 255, 129, 0.9));
          }
        }
        .el-slider__button-wrapper{
          top: -16px;
          .el-slider__button{
            width: 3px;
            height: 10px;
            background: #AEFFE6;
            border-radius: 0;
            border: 0;
          }
        }
      }
      .close{
        font-size: 12px;
        opacity: 0.5;
        margin-left: 4px;
      }
      .open{
        font-size: 12px;
        color: #07E89F;
      }
    }
  }
}
</style>

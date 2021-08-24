<template>
  <div
    class="model-alarm-wrap"
    :class="{ 'model-alarm-wrap2': alarmData.alertType === 2 }"
    @click.stop="noneFunc"
  >
    <div class="device-name">
      <span class="device-id">{{ alarmData.deviceType }} 报警</span>
      <i class="el-icon-close close-model" @click="hideModel" />
    </div>
    <div class="device-content">
      <div class="device-row">
        <span class="title">报警类型：</span>
        <span class="content">{{ alarmData.alertType === 1 ? '离线告警' : '故障告警' }}</span>
      </div>
      <div class="device-row">
        <span class="title">报警原因：</span>
        <span class="content">{{ alarmData.alertName }}</span>
      </div>
      <div class="device-row">
        <span class="title">报警设备：</span>
        <span class="content">{{ alarmData.deviceName }}</span>
      </div>
      <div class="device-row">
        <span class="title">报警位置：</span>
        <span class="content">{{ alarmData.area }}</span>
      </div>
      <div class="device-row">
        <span class="title">报警时间：</span>
        <span class="content">{{ alarmData.alertTime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeviceAlarmModel',
  props: {
    alarmData: {
      type: Object,
      required: true
    }
  },
  methods: {
    noneFunc() {},
    hideModel() {
      this.$emit('closeAlarmDialig')
    }
  }
}
</script>

<style lang="scss" scoped>
.model-alarm-wrap{
  position: absolute;
  top: 124px;
  left: 248px;
  width: 331px;
  height: 250px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #B50007;
  box-shadow: 0 11px 13px 0 rgba(3, 6, 29, 0.3);
  border-radius: 4px;
  z-index: 1002;
  .device-name{
    width: 100%;
    height: 43px;
    background: linear-gradient(0deg, #B50007, #840003);
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: space-between;
    .device-id{
      margin-left: 20px;
      font-size: 18px;
    }
    .close-model{
      cursor: pointer;
      margin-right: 16px;
      font-size: 20px;
    }
  }
  .device-content{
    padding: 24px 0 0 20px;
    .device-row{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
      .title{
        font-size: 14px;
        color: rgba(255, 255, 255, 1);
      }
      .content{
        margin-left: 8px;
        font-size: 14px;
        color: #FFFFFF;
      }
    }
  }
}
</style>

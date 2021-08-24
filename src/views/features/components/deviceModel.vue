<template>
  <el-dialog
    :title="`${dialogData.lamppostId} 灯杆详情`"
    :visible.sync="dialogVisible"
    width="920px"
    center
    append-to-body
    :close-on-press-escape="false"
    @open="showDialog"
    @close="handleClose"
  >
    <div class="container">
      <template
        v-for="item in dialogData.deviceList"
      >
        <dengju
          v-if="item.deviceType === '灯具'"
          :key="item.deviceId"
          :device-data="item"
          @showAlarmDialog="showAlarmDialog(item)"
        />
        <dengxiang
          v-else-if="item.deviceType === '灯箱'"
          :key="item.deviceId"
          :device-data="item"
          @showAlarmDialog="showAlarmDialog(item)"
        />
        <camera
          v-else-if="item.deviceType === '摄像头'"
          :key="item.deviceId"
          :device-data="item"
          @showAlarmDialog="showAlarmDialog(item)"
        />
        <guide-screen
          v-else-if="item.deviceType === '显示屏'"
          :key="item.deviceId"
          :device-data="item"
          @showAlarmDialog="showAlarmDialog(item)"
        />
      </template>
      <!--      <dengxiang />
      <camera />
      <dengju />
      <dengxiang />
      <camera />
      <dengju />
      <dengxiang />
      <camera />
      <guide-screen />-->
      <device-alarm-model
        v-if="alarmVisible"
        :alarm-data="alarmData"
        @closeAlarmDialig="closeAlarmDialig"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getDeviceAlarmData } from '../../../api/visual/generalOverview'
import Dengju from './deviceBlock/dengju'
import Dengxiang from './deviceBlock/dengxiang'
import Camera from './deviceBlock/camera'
import GuideScreen from './deviceBlock/guideScreen'
import DeviceAlarmModel from './deviceAlarmModel'
export default {
  name: 'DeviceModel',
  components: {
    DeviceAlarmModel,
    GuideScreen,
    Camera,
    Dengxiang,
    Dengju
  },
  props: {
    visible: [Boolean],
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      alarmData: {
        alertType: 1,
        alertName: 'xx',
        deviceName: '123123',
        area: 'aaaa',
        alertTime: 'asdasd',
        deviceType: 'HRIO'
      },
      alarmVisible: false,
      dialogVisible: false
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    showDialog() {
      // console.log(this.dialogData)
    },
    handleClose() {
      this.dialogVisible = false
      this.closeAlarmDialig()
      this.$emit('update:visible', this.dialogVisible)
    },
    showAlarmDialog(data) {
      getDeviceAlarmData({ deviceId: data.deviceId }).then(res => {
        if (res.data) {
          this.alarmData = res.data
          this.alarmVisible = true
        }
      })
    },
    closeAlarmDialig() {
      this.alarmVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dialog{
  width: 821px!important;
  height: 490px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #067BFF;
  box-shadow: 0 11px 13px 0 rgba(3, 6, 29, 0.3);
  border-radius: 4px;
  .el-dialog__header{
    width: 819px;
    height: 46px;
    background: linear-gradient(0deg, #1A52C6, #0C317A);
    border-radius: 4px 4px 0 0;
    display: flex;
    align-items: center;
    .el-dialog__headerbtn{
      top: 14px;
      right: 12px;
      .el-dialog__close{
        font-size: 20px;
      }
    }
  }
  .el-dialog__body{
    padding: 20px 5px 20px 20px;
  }
}
.container{
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
  height: 400px;
  overflow: auto;
  .device-wrap{
    margin-right: 18px;
    margin-bottom: 20px;
  }
  .device-wrap:nth-child(4n){
    margin-right: 0;
  }
}

/* 修改滚动条宽度 */
div::-webkit-scrollbar {
  width: 3px;
}
/*滚动条里面小方块*/
div::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #0B4187;
}
/*滚动条里面轨道*/
div::-webkit-scrollbar-track {
  border-radius: 0;
  background: #0B2B55;
}

</style>

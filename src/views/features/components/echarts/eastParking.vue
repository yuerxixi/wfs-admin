<template>
  <div>
    <div class="vessel-img">
      <div
        v-for="item in parkingData"
        :key="item.lamppostId"
        :class="['lamppost', 'lamppost-' + item.lamppostId, {'device-alarm': item.status === 0}]"
        :style="{top: item.top, left: item.left}"
        @click.stop="showModel($event, item)"
      />
      <div class="park-area-block" style="top: 9.4%;left: 31.2%;">E</div>
      <div class="park-area-block" style="top: 6.7%;left: 42.9%;">D</div>
      <div class="park-area-block" style="top: 6%;left: 53.2%;">C</div>
      <div class="park-area-block" style="top: 6%;left: 60.7%;">B</div>
      <div class="park-area-block" style="top: 6%;left: 66.9%;">A</div>
      <div class="park-area-block" style="top: 23.1%;left: 71.4%;">F</div>
      <div class="park-area-block" style="top: 69.2%;left: 57.7%;">B</div>
      <div class="park-area-block" style="top: 69.5%;left: 69%;">A</div>
      <device-model
        :visible.sync="modelVisible"
        :dialog-data="modelData"
      />
    </div>
    <!-- F杆和双立柱-->
    <div>
      <div class="lamppost-f" :class="{'lamppost-f-alarm': this.fullScreenDataF.status === 0}" @click="showFullScreen('1')" />
      <div class="lamppost-double" :class="{'lamppost-double-alarm': this.fullScreenDataDouble.status === 0}" @click="showFullScreen('2')" />
      <full-color-screen-dialog
        :visible.sync="fullScreenVisible"
        :dialog-data="fullScreenData"
      />
    </div>
  </div>
</template>

<script>
import { getLamppostData, getScreenProgramData } from '../../../../api/visual/generalOverview'
import DeviceModel from '../deviceModel'
import FullColorScreenDialog from '../FullColorScreenDialog'
export default {
  name: 'EastParking',
  components: {
    FullColorScreenDialog,
    DeviceModel
  },
  data() {
    return {
      modelVisible: false,
      modelData: {},
      fullScreenVisible: false,
      fullScreenData: {},
      fullScreenDataF: {},
      fullScreenDataDouble: {},
      parkingData: [
        {
          lamppostId: 'E01-2F',
          status: 1,
          top: '-5%',
          left: '72.6%',
          deviceList: []
        },
        {
          lamppostId: 'E02-2F',
          status: 1,
          top: '7.5%',
          left: '71.5%',
          deviceList: []
        },
        {
          lamppostId: 'E03-2F',
          status: 1,
          top: '-7.5%',
          left: '65%',
          deviceList: []
        },
        {
          lamppostId: 'E04-2F',
          status: 1,
          top: '13.5%',
          left: '69.2%',
          deviceList: []
        },
        {
          lamppostId: 'E05-2F',
          status: 1,
          top: '3.5%',
          left: '62.5%',
          deviceList: []
        },
        {
          lamppostId: 'E06-2F',
          status: 1,
          top: '-7.5%',
          left: '59.5%',
          deviceList: []
        },
        {
          lamppostId: 'E07-2F',
          status: 1,
          top: '5%',
          left: '57.2%',
          deviceList: []
        },
        {
          lamppostId: 'E08-2F',
          status: 1,
          top: '-7.5%',
          left: '50.5%',
          deviceList: []
        },
        {
          lamppostId: 'E09-2F',
          status: 1,
          top: '5.3%',
          left: '46.7%',
          deviceList: []
        },
        {
          lamppostId: 'E10-2F',
          status: 1,
          top: '-6.7%',
          left: '40.8%',
          deviceList: []
        },
        {
          lamppostId: 'E11-2F',
          status: 1,
          top: '9.3%',
          left: '35.3%',
          deviceList: []
        },
        {
          lamppostId: 'E12-2F',
          status: 1,
          top: '-3.3%',
          left: '31.2%',
          deviceList: []
        },
        {
          lamppostId: 'E13-2F',
          status: 1,
          top: '-9.3%',
          left: '28.6%',
          deviceList: []
        },
        {
          lamppostId: 'E14-2F',
          status: 1,
          top: '-1.3%',
          left: '24.6%',
          deviceList: []
        },
        {
          lamppostId: 'E01',
          status: 1,
          top: '62.5%',
          left: '56%',
          deviceList: []
        },
        {
          lamppostId: 'E02',
          status: 1,
          top: '75.5%',
          left: '67%',
          deviceList: []
        },
        {
          lamppostId: 'E03',
          status: 1,
          top: '62.5%',
          left: '71.2%',
          deviceList: []
        },
        {
          lamppostId: 'E04',
          status: 1,
          top: '54.5%',
          left: '84.2%',
          deviceList: []
        },
        {
          lamppostId: 'E05',
          status: 1,
          top: '40.5%',
          left: '80%',
          deviceList: []
        },
        {
          lamppostId: 'E06',
          status: 1,
          top: '75.5%',
          left: '84.2%',
          deviceList: []
        },
        {
          lamppostId: 'E07',
          status: 1,
          top: '75.5%',
          left: '40.2%',
          deviceList: []
        },
        {
          lamppostId: '东区-30米高杆灯',
          status: 1,
          top: '49.5%',
          left: '24.2%',
          deviceList: []
        }
      ]
    }
  },
  mounted() {
    this.getLamppost()
    this.initFullScreenData()
  },
  methods: {
    getLamppost() {
      getLamppostData().then(res => {
        res.data.forEach(item => {
          const lamppost = this.parkingData.find(item2 => {
            return item.deviceId === item2.lamppostId
          })
          if (lamppost) {
            lamppost.status = item.status
            lamppost.deviceList = item.list
          }
          // 测试代码
          // if (lamppost && lamppost.lamppostId === 'E03-2F') {
          //   lamppost.status = 0
          // }
        })
      })
    },
    showModel(event, data) {
      this.modelVisible = true
      this.modelData = data
    },
    initFullScreenData() {
      // F杆
      const terminalId = process.env.NODE_ENV === 'production' ? 'y60-221-30664' : 'm70-a20-00034'
      getScreenProgramData({
        terminalId: terminalId
      }).then(res => {
        this.fullScreenDataF = res.data
      })
      // 双立柱杆
      const terminalId2 = process.env.NODE_ENV === 'production' ? 'y60-421-40173' : 'm70-a20-00034'
      getScreenProgramData({
        terminalId: terminalId2
      }).then(res => {
        this.fullScreenDataDouble = res.data
      })
    },
    showFullScreen(type) {
      if (type === '1') {
        this.fullScreenVisible = true
        this.fullScreenData.title = 'F灯杆详情'
        this.fullScreenData.terminalId = process.env.NODE_ENV === 'production' ? 'y60-221-30664' : 'm70-a20-00034'
      } else if (type === '2') {
        this.fullScreenVisible = true
        this.fullScreenData.title = '双立柱灯杆详情'
        this.fullScreenData.terminalId = process.env.NODE_ENV === 'production' ? 'y60-421-40173' : 'm70-a20-00034'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.vessel-img{
  position: fixed;
  top:24%;
  left:22%;
  width: 60.2%;
  height: 70%;
  background: url(../../../../assets/wfs/overview/east-parking-bg.png) no-repeat;
  background-size: 100% 100%;
  z-index: 1;
  .lamppost{
    position: absolute;
    width: 28px;
    height: 80px;
    background: url(../../../../assets/wfs/overview/lamppost-bg1.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    z-index: 3;
  }
  .device-alarm{
    background: url(../../../../assets/wfs/overview/lamppost-bg2.png) no-repeat;
    background-size: 100% 100%;
  }
}
.lamppost-f{
  position: absolute;
  top: 72.5%;
  left: 80.5%;
  z-index: 100;
  width: 50px;
  height: 75px;
  background: url(../../../../assets/wfs/overview/lamppost-bg4.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.lamppost-f-alarm{
  background: url(../../../../assets/wfs/overview/lamppost-bg4-alarm.png) no-repeat;
  background-size: 100% 100%;
}
.lamppost-double{
  position: absolute;
  top: 54.5%;
  left: 67.7%;
  z-index: 100;
  width: 55px;
  height: 66px;
  background: url(../../../../assets/wfs/overview/lamppost-bg3.png) no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.lamppost-double-alarm{
  background: url(../../../../assets/wfs/overview/lamppost-bg3-alarm.png) no-repeat;
  background-size: 100% 100%;
}
.device-model-wrap{
  position: absolute;
  z-index: 999;
}
.park-area-block{
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(49, 141, 255, 0.4);
  box-shadow: 0px 2px 13px 0px rgba(21, 29, 85, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 500;
  z-index: 2;
}
</style>

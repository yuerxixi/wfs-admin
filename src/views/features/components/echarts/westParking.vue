<template>
  <div>
    <div class="vessel-img">
      <div
        v-for="item in parkingData"
        :key="item.lamppostId"
        :class="['lamppost', {'device-alarm': item.status === 0}]"
        :style="{top: item.top, left: item.left}"
        @click.stop="showModel($event, item)"
      />
      <div class="park-area-block" style="top: 5%;left: 27.4%;">D</div>
      <div class="park-area-block" style="top: 3.6%;left: 37.4%;">C</div>
      <div class="park-area-block" style="top: 4.2%;left: 43.7%;">B</div>
      <div class="park-area-block" style="top: 7%;left: 50.6%;">A</div>
      <div class="park-area-block" style="top: 27%;left: 69.6%;">E</div>
      <div class="park-area-block" style="top: 69.6%;left: 52.4%;">C</div>
      <div class="park-area-block" style="top: 69.2%;left: 61.7%;">B</div>
      <div class="park-area-block" style="top: 69.5%;left: 71.6%;">A</div>
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
  name: 'WestParking',
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
          lamppostId: 'W01-2F',
          status: 1,
          top: '-5%',
          left: '24.6%',
          deviceList: []
        },
        {
          lamppostId: 'W02-2F',
          status: 1,
          top: '-6.5%',
          left: '28.5%',
          deviceList: []
        },
        {
          lamppostId: 'W03-2F',
          status: 1,
          top: '8.5%',
          left: '25.5%',
          deviceList: []
        },
        {
          lamppostId: 'W04-2F',
          status: 1,
          top: '-6.5%',
          left: '36%',
          deviceList: []
        },
        {
          lamppostId: 'W05-2F',
          status: 1,
          top: '6.7%',
          left: '36%',
          deviceList: []
        },
        {
          lamppostId: 'W06-2F',
          status: 1,
          top: '-6.5%',
          left: '43.8%',
          deviceList: []
        },
        {
          lamppostId: 'W07-2F',
          status: 1,
          top: '6.7%',
          left: '44.5%',
          deviceList: []
        },
        {
          lamppostId: 'W08-2F',
          status: 1,
          top: '-2.5%',
          left: '49.8%',
          deviceList: []
        },
        {
          lamppostId: 'W09-2F',
          status: 1,
          top: '6.2%',
          left: '51.6%',
          deviceList: []
        },
        {
          lamppostId: 'W10-2F',
          status: 1,
          top: '3.2%',
          left: '55%',
          deviceList: []
        },
        {
          lamppostId: 'W11-2F',
          status: 1,
          top: '9.5%',
          left: '66.1%',
          deviceList: []
        },
        {
          lamppostId: 'W12-2F',
          status: 1,
          top: '15.5%',
          left: '71%',
          deviceList: []
        },
        {
          lamppostId: 'W13-2F',
          status: 1,
          top: '25.5%',
          left: '68.1%',
          deviceList: []
        },
        {
          lamppostId: 'W14-2F',
          status: 1,
          top: '29.5%',
          left: '74%',
          deviceList: []
        },
        {
          lamppostId: 'W01',
          status: 1,
          top: '65.5%',
          left: '51.2%',
          deviceList: []
        },
        {
          lamppostId: 'W02',
          status: 1,
          top: '65.5%',
          left: '64%',
          deviceList: []
        },
        {
          lamppostId: 'W03',
          status: 1,
          top: '65.5%',
          left: '74.6%',
          deviceList: []
        },
        {
          lamppostId: 'W04',
          status: 1,
          top: '60.5%',
          left: '84.6%',
          deviceList: []
        },
        {
          lamppostId: 'W05',
          status: 1,
          top: '46.5%',
          left: '80.6%',
          deviceList: []
        },
        {
          lamppostId: 'W06',
          status: 1,
          top: '76%',
          left: '84.6%',
          deviceList: []
        },
        {
          lamppostId: 'W07',
          status: 1,
          top: '76%',
          left: '40.6%',
          deviceList: []
        },
        {
          lamppostId: '西区-30米高杆灯',
          status: 1,
          top: '51.5%',
          left: '20.6%',
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
          // if (lamppost && lamppost.lamppostId === 'W02-2F') {
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
  background: url(../../../../assets/wfs/overview/west-parking-bg.png) no-repeat;
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
  left: 66.5%;
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
  box-shadow: 0 2px 13px 0 rgba(21, 29, 85, 0.5);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 500;
  z-index: 2;
}
</style>

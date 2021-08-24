<template>
  <div>
    <div class="container">
      <div :class="['parkBg', bgClass]">{{ datetime }}</div>
      <div class="title" style="margin-top: 30px;">总车位数</div>
      <div class="parkNum">
        <div v-for="(item, index) in totals" :key="index" class="num">{{ item }}</div>
      </div>
      <div class="title" style="margin-top: 22px;">空余车位数</div>
      <div class="parkNum">
        <div v-for="(item, index) in surpluses" :key="index" class="num">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTempParkData } from '../../../api/info/infoPublish'
export default {
  name: 'ParkTitle',
  data() {
    return {
      areaId: '',
      total: 0,
      surplus: 0,
      totals: [],
      surpluses: [],
      bgClass: 'west-two-B',
      dsq: null,
      dsq2: null,
      datetime: ''
    }
  },
  mounted() {
    this.init()
    this.clockUpdate()
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.dsq)
  },
  methods: {
    clockUpdate() {
      this.dsq2 = setInterval(() => {
        this.updateTime()
      }, 1000)
    },
    updateTime() {
      const cd = new Date()
      const time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2)
      const date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth() + 1, 2) + '-' + this.zeroPadding(cd.getDate(), 2)
      this.datetime = `${date} ${time}`
    },
    zeroPadding(num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
    init() {
      this.areaId = this.$route.query.areaId || ''
      this.getTempPark()
      // 初始化开启定时器
      this.dsq = setInterval(() => {
        this.getTempPark()
      }, 1000 * 120)
    },
    // 获取停车位数据
    getTempPark() {
      getTempParkData({ areaId: this.areaId }).then(res => {
        console.log(res)
        this.total = res.data.total
        this.surplus = res.data.left
        this.totals = res.data.total.split('')
        this.surpluses = res.data.left.split('')
        for (let i = 0, len = 3 - this.totals.length; i < len; i++) {
          this.totals.splice(0, 0, '0')
        }
        for (let i = 0, len = 3 - this.surpluses.length; i < len; i++) {
          this.surpluses.splice(0, 0, '0')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  width: 240px;
  height: 480px;
  padding: 16px 6px 0;
  background: linear-gradient(180deg, #0E90FF, #4891F9, #72BEFF);
  .parkBg{
    width: 228px;
    height: 200px;
    background-size: 228px 220px;
  }
  .title{
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    margin-left: 4px;
    margin-bottom: 10px;
  }
  .parkNum{
    width: 108px;
    height: 36px;
    border: 1px solid rgba(255, 255, 255, 0.38);
    background: rgba(78, 148, 249, 0.58);
    opacity: 0.9;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .num{
      width: 30px;
      height: 30px;
      border-radius: 1px;
      background: linear-gradient(0deg, #2387FE, #006EFF, #2387FE);
      font-family: JISHUQI2;
      font-size: 26px;
      text-align: center;
      color: #FFFFFF;
    }
  }
}

//.east-one-A{
//  background: url("../../../assets/wfs/info/east-one-A.png");
//}
//.east-one-B{
//  background: url("../../../assets/wfs/info/east-one-B.png");
//}
//.east-two-A{
//  background: url("../../../assets/wfs/info/east-two-A.png");
//}
//.east-two-B{
//  background: url("../../../assets/wfs/info/east-two-B.png");
//}
//.east-two-C{
//  background: url("../../../assets/wfs/info/east-two-C.png");
//}
//.east-two-D{
//  background: url("../../../assets/wfs/info/east-two-D.png");
//}
//.east-two-E{
//  background: url("../../../assets/wfs/info/east-two-E.png");
//}
//.east-two-F{
//  background: url("../../../assets/wfs/info/east-two-F.png");
//}
//
//.west-one-A{
//  background: url("../../../assets/wfs/info/west-one-A.png");
//}
//.west-one-B{
//  background: url("../../../assets/wfs/info/west-one-B.png");
//}
//.west-one-C{
//  background: url("../../../assets/wfs/info/west-one-C.png");
//}
//.west-two-A{
//  background: url("../../../assets/wfs/info/west-two-A.png");
//}
//.west-two-B{
//  background: url("../../../assets/wfs/info/west-two-B.png");
//}
//.west-two-C{
//  background: url("../../../assets/wfs/info/west-two-C.png");
//}
//.west-two-D{
//  background: url("../../../assets/wfs/info/west-two-D.png");
//}
//.west-two-E{
//  background: url("../../../assets/wfs/info/west-two-E.png");
//}
</style>

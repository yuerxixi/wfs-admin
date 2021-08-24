<template>
  <div>
    <div v-if="showParking === 0" class="park-content">
      <img class="img-bg" src="../../../assets/wfs/info/big-led-bg.png">
      <div class="park-wrap">
        <div class="title">
          <span>扬州广陵服务区</span>
          <span style="display: inline-block">欢迎您！</span>
        </div>
        <div class="icon-wrap">
          <img src="../../../assets/wfs/info/icon-info-1.png" style="width: 17.6px;height: 29.7px;">
          <img src="../../../assets/wfs/info/icon-info-2.png" style="width: 24.7px;height: 29px;">
          <img src="../../../assets/wfs/info/icon-info-3.png" style="width: 23.5px;height: 29.8px;">
          <img src="../../../assets/wfs/info/icon-info-4.png" style="width: 26.9px;height: 27.6px;">
          <img src="../../../assets/wfs/info/icon-info-5.png" style="width: 24px;height: 23.5px;">
          <img src="../../../assets/wfs/info/icon-info-6.png" style="width: 28px;height: 25.4px;">
          <img src="../../../assets/wfs/info/icon-info-7.png" style="width: 36px;height: 36px;">
        </div>
        <div class="park-num-wrap">
          <div class="park-col">
            <span class="title">大型车</span>
            <div><span class="num">139</span><span class="dw">余</span></div>
          </div>
          <div class="park-col">
            <span class="title">小型车</span>
            <div><span class="num">005</span><span class="dw">余</span></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="showParking === 1" class="bottom-park-content">
      <div class="park-col">
        <span class="title">一层</span>
        <span class="num">139</span>
      </div>
      <div class="park-col">
        <span class="title">二层</span>
        <span class="num">026</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParkBigLed',
  data() {
    return {
      showParking: 1
    }
  }
}
</script>

<style scoped lang="scss">
.park-content{
  width: 960px;
  height: 720px;
  background: linear-gradient(0deg, #010B19, #191E26);
  display: flex;
  .img-bg{
    width: 432px;
    height: 483px;
    margin: 130px 16px 0 30px;
  }
  .park-wrap{
    padding: 25px 18px 29px 0;
    width: 100%;
    height: 100%;
    //background: #00a0e9;
    >.title{
      width: 100%;
      height: 311px;
      background: #131A25;
      box-shadow: 0px 1px 6px 4px #28394F inset;
      font-size: 54px;
      font-weight: bold;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    >.icon-wrap{
      width: 100%;
      height: 60px;
      margin-top: 8px;
      padding-left: 28px;
      background: #131A25;
      box-shadow: 0px 1px 6px 4px #28394F inset;
      display: flex;
      align-items: center;
      img{
        margin-left: 28px;
      }
    }
    >.park-num-wrap{
      width: 100%;
      height: 278px;
      background: #131A25;
      box-shadow: 0px 1px 6px 4px #28394F inset;
      margin-top: 8px;
      padding: 48px 0 55px 0;
      display: flex;
      .park-col{
        flex: 0 0 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 32px;
        &:first-child{
          border-right: 3px solid #18263B;
        }
        .title{
          font-size: 38px;
          font-weight: bold;
          color: #FFFFFF;
          margin-bottom: 10px;
        }
        .num{
          font-size: 78px;
          font-weight: bold;
          color: #00FF48;
        }
        .dw{
          font-size: 30px;
          font-weight: bold;
          color: #FFFFFF;
        }
      }
    }
  }
}
.bottom-park-content{
  width: 960px;
  height: 250px;
  background: linear-gradient(0deg, #010B19, #191E26);
  display: flex;
  align-items: center;
  color: #fff;
  //padding: 55px 18px;
  .park-col{
    flex: 0 0 50%;
    height: 140px;
    display: flex;
    align-items: center;
    &:first-child{
      border-right: 4px solid #1B2330;
    }
    .title{
      margin-left: 40px;
      font-size: 64px;
      font-weight: bold;
    }
    .num{
      margin-left: 40px;
      font-size: 118px;
      font-weight: bold;
      color: #00FF48;
    }
  }
}
</style>

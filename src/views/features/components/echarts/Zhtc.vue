<template>
  <div class="zhtc-wrap">
    <div class="trigger-chart">
      <span
        class="dname"
        :class="{active: active === 1}"
        @click="triggerChart(1)"
      >西区</span>
      <span
        class="dname"
        :class="{active: active === 2}"
        @click="triggerChart(2)"
      >东区</span>
    </div>
    <div v-if="active === 1" class="park-wrap">
      <div class="park-col" style="margin-left: 32px">
        <span class="title">总车位</span>
        <span class="num">{{ westData.all && westData.all.total }}</span>
      </div>
      <div class="park-col" style="margin-left: 48px">
        <span class="title">剩余（小车 / 总数）</span>
        <span class="num"><span style="color: #FFA200">{{ westData.small && westData.small.left }}/</span>{{ westData.all && westData.all.left }}</span>
      </div>
      <div class="park-col" style="margin-left: 40px">
        <span class="title">占用车位</span>
        <span class="num" style="color: #FF0C00">{{ westData.all && westData.all.used }}</span>
      </div>
    </div>
    <div v-else class="park-wrap">
      <div class="park-col" style="margin-left: 32px">
        <span class="title">总车位</span>
        <span class="num">{{ eastData.all && eastData.all.total }}</span>
      </div>
      <div class="park-col" style="margin-left: 48px">
        <span class="title">剩余（小车 / 总数）</span>
        <span class="num"><span style="color: #FFA200">{{ eastData.small && eastData.small.left }}/</span>{{ eastData.all && eastData.all.left }}</span>
      </div>
      <div class="park-col" style="margin-left: 40px">
        <span class="title">占用车位</span>
        <span class="num" style="color: #FF0C00">{{ eastData.all && eastData.all.used }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { parkListView } from '../../../../api/generator/generator'

export default {
  name: 'Zhtc',
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    }
  },
  data() {
    return {
      active: 1,
      eastData: {},
      westData: {}
    }
  },
  mounted() {
    // 智慧停车
    parkListView().then(res => {
      this.eastData = JSON.parse(JSON.stringify(res.data.east))
      this.westData = JSON.parse(JSON.stringify(res.data.west))
      // this.overView.zhtcData = res.data
    })
  },
  // watch: {
  //   data(newVal, oldVal) {
  //     this.eastData = JSON.parse(JSON.stringify(newVal.east))
  //     this.westData = JSON.parse(JSON.stringify(newVal.west))
  //   }
  // },
  methods: {
    triggerChart(value) {
      this.active = value
    }
  }
}
</script>

<style scoped lang="scss">
.zhtc-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 14px;
  .trigger-chart{
    width: 92%;
    border-bottom: 1px solid rgba(48, 71, 113, 1);
    display: flex;
    .dname{
      width: 84px;
      text-align: center;
      padding: 0 14px 8px;
      font-size: 16px;
      cursor: pointer;
      &:first-child{
        margin-left: 14px;
      }
      &:last-child{
        margin-left: 60px;
      }
    }
    .active{
      border-bottom: 2px solid rgba(255, 191, 0, 1);
      color: #FFBF00;
    }
  }
  .park-wrap{
    display: flex;
    .park-col{
      display: flex;
      flex-direction: column;
      margin-top: 14px;
      .title{
        font-size: 16px;
      }
      .num{
        margin-top: 12px;
        font-size: 36px;
        font-weight: bold;
        font-family: OVERVIEW-NUM;
      }
    }
  }
}

</style>

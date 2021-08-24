<template>
  <div class="gjsj-wrap">
    <div class="top-content">
      <div class="left-wrap">
        <div class="sj-row">
          <span class="title">累计事件总数</span>
          <span class="num">{{ alarmInfoData.total }}</span>
        </div>
        <div class="sj-row">
          <span class="title">未处理事件数</span>
          <span class="num" style="color: #FFA200">{{ alarmInfoData.undoTotal }}</span>
        </div>
      </div>
      <div class="right-wrap">
        <div class="sj-row">
          <span class="title">今日事件数</span>
          <span class="num">{{ alarmInfoData.totalToday }}</span>
        </div>
        <div class="sj-row">
          <span class="title">未处理事件数</span>
          <span class="num">{{ alarmInfoData.undoTotalToday }}</span>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <el-table ref="table" v-loading="loading" :highlight-current-row="false" :data="alarmManagementData" header-row-class-name="header-row" row-class-name="body-row">
        <el-table-column prop="deviceName" width="90" label="告警设备" />
        <el-table-column prop="alertTypeTitle" class-name="red-col" width="80" label="告警类型" />
        <el-table-column prop="relationArea" width="130" label="设备区域" />
        <el-table-column prop="createTime" width="160" label="告警时间" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getAlarmInfoData, getAlarmListData } from '../../../../api/visual/generalOverview'
export default {
  name: 'Gjsj',
  data() {
    return {
      loading: false,
      alarmManagementData: [],
      alarmInfoData: {},
      dsq: null
    }
  },
  mounted() {
    this.getAlarmInfo()
    this.getAlarmList()
  },
  beforeDestroy() {
    clearInterval(this.dsq)
  },
  methods: {
    getAlarmInfo() {
      getAlarmInfoData().then(res => {
        this.alarmInfoData = res.data
      })
    },
    getAlarmList() {
      getAlarmListData().then(res => {
        res.data.forEach(item => {
          if (item.alertType === 1) {
            item.alertTypeTitle = '离线告警'
          } else if (item.alertType === 2) {
            item.alertTypeTitle = '故障告警'
          }
          if (item.relationArea) {
            item.relationArea = item.relationArea.replace('扬州广陵智慧服务区/', '')
            item.relationArea = item.relationArea.replace('扬州广陵服务区/', '')
          }
        })
        this.alarmManagementData = res.data
        if (this.alarmManagementData.length > 3) {
          this.getright_table()
        }
      })
    },
    getright_table() {
      const this_ = this
      this.$nextTick(() => {
        const div = document.getElementsByClassName('el-table__body-wrapper')[0]
        div.style.height = '120px'
        const t = document.getElementsByClassName('el-table__body')[0]
        this.dsq = setInterval(() => {
          // if (1 === 1) {
          const data = this_.alarmManagementData[0]
          setTimeout(() => {
            this_.alarmManagementData.push(data)
            t.style.transition = 'all .5s'
            t.style.marginTop = '-39px'
          }, 500)
          setTimeout(() => {
            this_.alarmManagementData.splice(0, 1)
            t.style.transition = 'all 0s ease 0s'
            t.style.marginTop = '0'
          }, 1000)
          // }
        }, 2500)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.gjsj-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 14px;
  .top-content{
    flex: 0 0 70px;
    display: flex;
    .left-wrap{
      width: 188px;
      height: 70px;
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #103886, rgba(12, 35, 76, 0));
    }
    .right-wrap{
      width: 188px;
      height: 70px;
      margin-left: 17px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(90deg, #004F87, rgba(12, 35, 76, 0));
    }
    .sj-row{
      width: 100%;
      display: flex;
      align-items: center;
      padding-right: 16px;
      .title{
        margin-left: 16px;
        flex: 0 0 84px;
        font-size: 14px;
      }
      .num{
        flex: auto;
        margin-left: 18px;
        font-size: 24px;
        font-weight: bold;
        font-family: OVERVIEW-NUM;
      }
      &:last-child{
        margin-top: 4px;
      }
    }
  }
  .bottom-content{
    flex: auto;
    margin-top: 15px;
  }
}
>>> .el-table{
  background-color: transparent !important;
  &::before{
    width: 0;
  }
}
>>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: transparent;
}
>>> .header-row{
  th{
    background-color: #0D2651 !important;
    color: #fff;
    border-bottom: none;
  }
}
>>> .body-row{
  background-color: transparent !important;
  td{
    color: #fff;
    border-bottom: none;
  }
  .red-col{
    color: #FF0C00;
  }
}
</style>

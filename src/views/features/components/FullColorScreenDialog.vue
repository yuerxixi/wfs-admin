<template>
  <el-dialog
    :title="dialogData.title"
    :visible.sync="dialogVisible"
    width="360px"
    center
    append-to-body
    :close-on-press-escape="false"
    @open="showDialog"
    @close="handleClose"
  >
    <div class="container">
      <div class="row">
        <span class="title">名称：</span>
        <span class="name">{{ deviceData.name }}</span>
      </div>
      <div class="row" :class="{'on-line': deviceData.status === 1, 'off-line': deviceData.status === 0}">
        <span class="title">状态：</span>
        <span class="circle" />
        <span class="status">{{ deviceData.status === 1 ? '在线' : deviceData.status === 0 ? '离线' : '' }}</span>
      </div>
      <div class="row">
        <span class="title">当前画面：</span>
        <img v-if="deviceData.pic" class="now-img" :src="deviceData.pic">
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getScreenProgramData } from '../../../api/visual/generalOverview'
export default {
  name: 'FullColorScreenDialog',
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
      dialogVisible: false,
      deviceData: {}
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    showDialog() {
      this.deviceData = {}
      getScreenProgramData({
        terminalId: this.dialogData.terminalId
      }).then(res => {
        if (res.data.pic) {
          res.data.pic = 'data:image/png;base64,' + res.data.pic
        }
        this.deviceData = res.data
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dialog{
  width: 360px!important;
  height: 330px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #067BFF;
  box-shadow: 0 11px 13px 0 rgba(3, 6, 29, 0.3);
  border-radius: 4px;
  margin-top: 30vh!important;
  .el-dialog__header{
    width: 358px;
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
    padding: 0;
  }
}

.container{
  width: 100%;
  height: 284px;
  padding-top: 25px;
  color: #FFFFFF;
  .row{
    display: flex;
    margin-bottom: 30px;
    .title{
      flex: 0 0 88px;
      height: 14px;
      font-size: 14px;
      margin-right: 17px;
      text-align: right;
    }
    .name{
      height: 12px;
      font-size: 14px;
    }
    .now-img{
      width: 200px;
      height: 140px;
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
}
</style>

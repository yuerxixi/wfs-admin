<template>
  <el-dialog
    title="信息详情"
    :visible.sync="dialogVisible"
    width="848px"
    center
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="showDialog"
    @close="handleClose"
  >
    <div class="dialog-left-wrap">
      <div class="title-wrap">
        <span class="title">信息内容</span>
      </div>
      <div class="body-wrap">
        <div class="row-wrap"><span class="row-bt">信息标题</span><span class="cont">{{ dialogData.messageTitle }}</span></div>
        <div class="row-wrap"><span class="row-bt">内容描述</span><span class="cont">{{ dialogData.messageDescribe }}</span></div>
        <div class="row-wrap"><span class="row-bt">投放设备</span>
          <el-tooltip class="item" effect="dark" :content="dialogData.deviceName" placement="top-start">
            <span class="cont">{{ dialogData.deviceName }}</span>
          </el-tooltip>
          <!--          <span class="cont">{{ dialogData.deviceId }}啊啊啊啊啊啊啊啊啊啊啊啊啊啊</span>-->
        </div>
        <div class="row-wrap"><span class="row-bt">投放时间</span><span class="cont">{{ tfsj }}</span></div>
        <div class="row-wrap"><span class="row-bt">投放时段</span><span class="cont">{{ dialogData.messageInterval }}</span></div>
        <div class="row-wrap"><span class="row-bt">信息状态</span><span class="cont" style="color: #425ED1">{{ dialogData.stateName }}</span></div>
        <div class="row-wrap"><span class="row-bt">异常设备</span>
          <!--          <span class="cont">{{ dialogData.errorDevice }}</span>-->
          <el-tooltip class="item" effect="dark" :content="dialogData.errorDevice" placement="top-start">
            <span class="cont" style="color: red;">{{ dialogData.errorDevice }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="dialog-right-wrap">
      <div class="title-wrap">
        <span class="title">投放策略</span>
      </div>
      <div class="launch-strategy-wrap">
        <div v-for="item in messageList" :key="item.id">
          <div v-if="item.messageType === 1" style="display: flex;flex-direction: column;margin-top: 25px;width: 300px;">
            <span style="font-size: 16px;color: #666666;margin-bottom: 9px">文本（{{ item.fileTime }}分钟）</span>
            <!--            <el-input v-model="item.messageContent" :readonly="true" />-->
            <el-button
              type="info"
              style="width: 120px;"
              @click="showEditorInfo(item)"
            >查看详情</el-button>
          </div>
          <div v-else-if="item.messageType === 2" style="display: flex;flex-direction: column;margin-top: 25px;width: 138px;">
            <span style="font-size: 16px;color: #666666;margin-bottom: 9px">图片({{ item.fileTime }}分钟)</span>
            <img :src="item.httpUrl" style="width: 138px;height: 86px;">
          </div>
          <div v-else-if="item.messageType === 3" style="display: flex;flex-direction: column;margin-top: 25px;width: 138px;">
            <span style="font-size: 16px;color: #666666;margin-bottom: 9px">视频({{ item.fileTime }}分钟)</span>
            <img :src="item.httpUrl" style="width: 138px;height: 86px;">
            <!--            <video style="width: 138px;height: 86px;">-->
            <!--              <source :src="item.httpUrl">-->
            <!--            </video>-->
          </div>
        </div>
      </div>
    </div>
    <read-info-editor-dialog
      :visible.sync="readInfoVisible"
      :message-data="readMessageData"
    />
  </el-dialog>
</template>

<script>
import { deepClone } from '../../../utils/common'
import ReadInfoEditorDialog from './ReadInfoEditorDialog'

export default {
  name: 'ReadInfoDialog',
  components: { ReadInfoEditorDialog },
  props: {
    readVisible: [Boolean],
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
      readInfoVisible: false,
      messageList: [],
      readMessageData: {}
    }
  },
  computed: {
    tfsj() {
      return this.dialogData.timeType === 1 ? `${this.dialogData.messageTime.split(';')[0]} 至 ${this.dialogData.messageTime.split(';')[1]}` : this.dialogData.messageTime
    }
  },
  watch: {
    readVisible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    showDialog() {
      this.messageList = deepClone(this.dialogData.tMessageContentList)
      this.messageList.forEach(item => {
        item.messageContent = decodeURI(item.messageContent)
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('update:readVisible', this.dialogVisible)
    },
    showEditorInfo(data) {
      this.readMessageData = data
      this.readInfoVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dialog__body{
  display: flex;
}
.dialog-left-wrap{
  width: 412px;
  height: 368px;
  padding-left: 5px;
  .body-wrap{
    padding-left: 36px;
    padding-top: 20px;
    border-right: 1px solid #DDDDDD;
    .row-wrap{
      height: 48px;
      display: flex;
      align-items: center;
      .row-bt{
        font-size: 16px;
        color: #666666;
      }
      .cont{
        display: inline-block;
        width: 220px;
        margin-left: 32px;
        font-size: 16px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.dialog-right-wrap{
  width: 435px;
  height: 368px;
  padding-left: 57px;
  .launch-strategy-wrap{
    padding: 0px 33px 0 11px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
}
.title-wrap{
  border-left: 4px solid #4B60D7;
  //margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title{
    height: 19px;
    font-size: 16px;
    color: #111111;
    font-weight: 500;
    margin-left: 12px;
  }
}
</style>

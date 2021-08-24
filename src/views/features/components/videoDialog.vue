<template>
  <el-dialog
    :title="`${dialogData.deviceName} 视频`"
    :visible.sync="dialogVisible"
    width="820px"
    center
    append-to-body
    :close-on-press-escape="false"
    @open="showDialog"
    @close="handleClose"
  >
    <div class="container">
      <video-player
        ref="videoPlayer"
        class="video-player vjs-custom-skin"
        :playsinline="false"
        :options="playerOptions"
      />
    </div>
  </el-dialog>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { getVideoLiveData } from '../../../api/visual/generalOverview'
export default {
  name: 'VideoDialog',
  components: {
    videoPlayer
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
      dialogVisible: false,
      deviceData: {},
      playerOptions: {
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '819:560', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'application/x-mpegURL', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: '' // 视频url地址
        }],
        // poster: require('xxxxx'), // 你的封面地址
        // width: 400, // 播放器宽度
        // height: 300,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
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
      getVideoLiveData({
        deviceId: this.dialogData.deviceId
      }).then(res => {
        this.playerOptions.sources[0].src = res.data[0].url
      })
    },
    handleClose() {
      this.playerOptions.sources[0].src = null
      this.dialogVisible = false
      this.$emit('update:visible', this.dialogVisible)
    }
  }
}
</script>

<style lang="scss" scoped>
>>> .el-dialog{
  width: 821px!important;
  height: 615px;
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
    padding: 12px;
  }
}
.container{
  height: 542px;
}
>>> .vjs-modal-dialog-content{
  padding: 0;
}
</style>

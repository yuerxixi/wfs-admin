<template>
  <div class="app-container">
    <!-- 左侧下拉树 -->
    <el-card class="box-card">
      <div class="left-wrap">
        <el-input
          v-model="filterTreeText"
          placeholder="输入关键字进行过滤"
          size="mini"
          suffix-icon="el-icon-search"
          style="margin-bottom: 10px;"
        />
        <el-tree
          ref="tree"
          v-loading="loading"
          class="filter-tree"
          :data="treeData"
          node-key="indexCode"
          :props="defaultTreeProps"
          default-expand-all
          :filter-node-method="filterTreeNode"
          @current-change="currentChange"
        />
      </div>
      <!-- 右侧视频列表 -->
      <div class="right-wrap">
        <!--列表展示-->
        <div class="video-wrap">
          <div
            v-for="(item, index) in videoData"
            :key="index"
            ref="videoWrap"
            class="videoCol"
            :class="{ ['videoCol' + rows]: true, isActive: item.active }"
            @click="selVideoDiv(index)"
          >
            <div class="topTitle">
              <span>{{ item.title }}</span>
              <i v-show="item.title" class="el-icon-close" style="color: #fff;font-size: 24px;margin-right: 6px;" @click="closeVideoPlayer(index)" />
            </div>
            <video-player
              v-if="JSON.stringify(item.options) !== '{}'"
              ref="videoPlayer"
              class="video-player vjs-custom-skin"
              :playsinline="false"
              :options="item.options"
            />
            <div v-else class="initPlayer" />
          </div>
        </div>
        <!--底部工具栏-->
        <div class="tool-wrap">
          <div class="ico-row-wrap">
            <div v-for="(item, index) in iconData" :key="index" style="display: flex;align-items: center">
              <div class="vimg" :class="{ check: item.isCheck }" @click="changeVideoRows(item.order)">
                <div class="bgimg" :class="`img${item.order}`" />
              </div>
              <div v-if="index !== 4" class="vhr" />
            </div>
          </div>
          <div class="icon-params-wrap">
            <template
              v-for="(item, index) in videoParams"
            >
              <el-tooltip :key="item.id" class="item" effect="dark" :content="`${item.title}: ${item.paramValue}`" placement="bottom-start">
                <svg-icon
                  class="video-icon"
                  :icon-class="item.iconName"
                  @click="updateParams(item)"
                />
              </el-tooltip>
              <div
                v-if="index !== 4"
                :key="item.id + 1"
                class="vhr"
              />
              <el-slider
                :key="item.id + 2"
                v-model="item.paramValue"
                vertical
                :min="10"
                :step="10"
                :class="['video-slider' + index, {'show-slider': item.active}]"
                height="100px"
                @change="changeVideoParams($event, item)"
              />
            </template>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import { getParkDeviceTreeData, getVideoDeviceUrl, updateVideoParams } from '../../api/video/realTimeMonitor'
import { deepClone } from '../../utils/common'
// import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'

export default {
  name: 'RealTimeMonitor',
  components: {
    videoPlayer
  },
  data() {
    return {
      treeData: [],
      defaultTreeProps: {
        children: 'children',
        label: 'name'
      },
      filterTreeText: '',
      loading: false,
      // 视频数据
      videoData: [],
      // 下方选择x * x 图标
      iconData: [],
      // 当前视频行列数，表示 n * n
      rows: 1,
      // 当前选中视频框序号，0开始计数
      thisVideoCount: 0,
      // 初始化播放数组地址
      initPlayerCount: -1,
      playerOptions: {
        autoplay: true, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
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
      },
      videoParams: [
        {
          id: 'brightness',
          title: '亮度',
          active: false,
          iconName: 'video-brightness',
          paramValue: 0
        },
        // {
        //   id: 'hue',
        //   title: '灰度',
        //   active: false,
        //   iconName: 'video-hue',
        //   paramValue: 0
        // },
        {
          id: 'contrast',
          title: '对比度',
          active: false,
          iconName: 'video-contrast',
          paramValue: 0
        },
        {
          id: 'saturation',
          title: '饱和度',
          active: false,
          iconName: 'video-saturation',
          paramValue: 0
        }
      ]
    }
  },
  watch: {
    filterTreeText(value) {
      this.$refs.tree.filter(value)
    }
  },
  mounted() {
    this.initVideo()
  },
  methods: {
    // 左侧过滤 树
    filterTreeNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 初始化页面数据
    initVideo() {
      // 加载树结构
      this.getTreeDevice()
      // 重新设置视频流数据
      this.setVideoData()
      // 初始化iconData
      for (let i = 1; i <= 4; i++) {
        if (this.rows === i) {
          this.iconData.push({
            isCheck: true,
            order: i
          })
        } else {
          this.iconData.push({
            isCheck: false,
            order: i
          })
        }
      }
    },
    // 加载树结构
    getTreeDevice() {
      this.loading = true
      getParkDeviceTreeData().then(async res => {
        this.loading = false
        this.treeData = res.list
        await this.getVideoPlayer(this.treeData)
      })
    },
    // 重新设置视频流数据
    setVideoData() {
      this.videoData = []
      for (let i = 0, len = this.rows * this.rows; i < len; i++) {
        this.videoData.push({
          cameraIndexCode: '',
          title: '',
          active: false,
          options: {},
          brightness: 0, // 亮度
          // hue: 0, // 灰度
          contrast: 0, // 对比度
          saturation: 0 // 饱和度
        })
      }
      // 默认选择第一个视频框
      this.selVideoDiv(0)
    },
    // 选中当前视频框
    selVideoDiv(_index) {
      this.videoData.forEach((item, index) => {
        item.active = _index === index
        if (_index === index) {
          this.videoParams[0].paramValue = item.brightness * 10
          // this.videoParams[1].paramValue = item.hue * 10
          this.videoParams[1].paramValue = item.contrast * 10
          this.videoParams[2].paramValue = item.saturation * 10
        }
      })
      this.thisVideoCount = _index
    },
    // 选中左侧树
    currentChange(obj, node) {
      // console.log(obj, node)
      // console.log(obj.parent, node.parent.data)
      if (obj.type === 'camera') {
        getVideoDeviceUrl({ cameraIndexCode: obj.indexCode }).then(res => {
          this.videoData[this.thisVideoCount].cameraIndexCode = obj.indexCode
          this.videoData[this.thisVideoCount].title = `${node.parent.parent.data.name}/${node.parent.data.name}/${obj.name}`
          // this.videoData[this.thisVideoCount].options = Object.assign({}, this.playerOptions)
          this.videoData[this.thisVideoCount].options = deepClone(this.playerOptions)
          this.videoData[this.thisVideoCount].options.sources[0].src = res.url
          this.videoData[this.thisVideoCount].brightness = res.data.brightness
          // this.videoData[this.thisVideoCount].hue = res.data.hue
          this.videoData[this.thisVideoCount].contrast = res.data.contrast
          this.videoData[this.thisVideoCount].saturation = res.data.saturation
          // 设置video参数值
          this.videoParams[0].paramValue = res.data.brightness * 10
          // this.videoParams[1].paramValue = res.data.hue * 10
          this.videoParams[1].paramValue = res.data.contrast * 10
          this.videoParams[2].paramValue = res.data.saturation * 10
          // 设置播放器的宽高比例
          this.setVideoPlayerWidth()
        })
      }
    },
    // 设置播放器的宽高比例
    setVideoPlayerWidth() {
      this.$nextTick(() => {
        // console.log('this.$refs.videoWrap', this.$refs.videoWrap[0].offsetWidth, this.$refs.videoWrap[0].offsetHeight - 37)
        this.videoData.forEach(item => {
          if (JSON.stringify(item.options) !== '{}') {
            item.options.aspectRatio = `${this.$refs.videoWrap[0].offsetWidth}:${this.$refs.videoWrap[0].offsetHeight - 37}`
          }
        })
      })
    },
    // 改变视频框布局， n * n
    async changeVideoRows(order) {
      this.rows = order
      this.setVideoData()
      this.iconData.forEach(item => {
        item.isCheck = item.order === order
      })
      // 初始化加载视频
      this.initPlayerCount = -1
      await this.getVideoPlayer(this.treeData)
    },
    // 初始化加载视频
    async getVideoPlayer(data) {
      if (data && data.length > 0) {
        for (const item of data) {
          if (item.type === 'camera' && this.initPlayerCount < this.rows * this.rows - 1) {
            this.initPlayerCount++
            const res = await getVideoDeviceUrl({ cameraIndexCode: item.indexCode })
            // console.log(res)
            const node = this.$refs.tree.getNode(item.indexCode)
            this.videoData[this.initPlayerCount].cameraIndexCode = item.indexCode
            this.videoData[this.initPlayerCount].title = `${node.parent.parent.data.name}/${node.parent.data.name}/${item.name}`
            // this.videoData[this.initPlayerCount].options = Object.assign({}, this.playerOptions)
            this.videoData[this.initPlayerCount].options = deepClone(this.playerOptions)
            this.videoData[this.initPlayerCount].options.sources[0].src = res.url
            this.videoData[this.initPlayerCount].brightness = res.data.brightness
            // this.videoData[this.initPlayerCount].hue = res.data.hue
            this.videoData[this.initPlayerCount].contrast = res.data.contrast
            this.videoData[this.initPlayerCount].saturation = res.data.saturation
            if (this.initPlayerCount === 0) {
              this.videoParams[0].paramValue = res.data.brightness * 10
              // this.videoParams[1].paramValue = res.data.hue * 10
              this.videoParams[1].paramValue = res.data.contrast * 10
              this.videoParams[2].paramValue = res.data.saturation * 10
            }
            // 设置播放器的宽高比例
            this.setVideoPlayerWidth()
          } else {
            await this.getVideoPlayer(item.children)
          }
        }
      }
    },
    // 关闭播放
    closeVideoPlayer(index) {
      this.videoData.splice(index, 1, {
        cameraIndexCode: '',
        title: '',
        active: false,
        options: {},
        brightness: 0, // 亮度
        // hue: 0, // 灰度
        contrast: 0, // 对比度
        saturation: 0 // 饱和度
      })
    },
    // 弹出参数设置
    updateParams(data) {
      if (this.videoData[this.thisVideoCount].cameraIndexCode !== '') {
        if (data.active) {
          data.active = false
          data.iconName = data.iconName.substring(0, data.iconName.length - 5)
        } else {
          data.active = true
          data.iconName += '-high'
        }
      }
    },
    // 设置参数
    changeVideoParams(value, item) {
      let queryParams = {}
      if (item.id === 'brightness') {
        queryParams = {
          cameraIndexCode: this.videoData[this.thisVideoCount].cameraIndexCode,
          brightness: value / 10,
          hue: 6,
          contrast: this.videoData[this.thisVideoCount].contrast,
          saturation: this.videoData[this.thisVideoCount].saturation
        }
        this.videoData[this.thisVideoCount].brightness = value / 10
      } else if (item.id === 'contrast') {
        queryParams = {
          cameraIndexCode: this.videoData[this.thisVideoCount].cameraIndexCode,
          brightness: this.videoData[this.thisVideoCount].brightness,
          hue: 6,
          contrast: value / 10,
          saturation: this.videoData[this.thisVideoCount].saturation
        }
        this.videoData[this.thisVideoCount].contrast = value / 10
      } else if (item.id === 'saturation') {
        queryParams = {
          cameraIndexCode: this.videoData[this.thisVideoCount].cameraIndexCode,
          brightness: this.videoData[this.thisVideoCount].brightness,
          hue: 6,
          contrast: this.videoData[this.thisVideoCount].contrast,
          saturation: value / 10
        }
        this.videoData[this.thisVideoCount].saturation = value / 10
      }
      // console.log(queryParams)
      updateVideoParams(queryParams).then(res => {
        item.active = 0
        item.iconName = item.iconName.substring(0, item.iconName.length - 5)
      }).catch(() => {
        item.active = 0
        item.iconName = item.iconName.substring(0, item.iconName.length - 5)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__multi-value{
  margin-bottom: 0;
}
::v-deep .vue-treeselect__multi-value-item{
  border: 0;
  padding: 0;
}
>>> .el-card__body{
  display: flex;
  height: 100%;
}
.left-wrap{
  flex: 0 0 15%;
  height: 100%;
  border-right: 1px solid #DDDDDD;
  padding-right: 20px;
  margin-right: 20px;
}
.right-wrap{
  flex: 0 0 84%;
  height: 100%;
  background: #0F1624;
}
.filter-tree{
  height: 92%;
  background: none!important;
  overflow: auto;
}
.video-wrap{
  width: 100%;
  height: 93%;
  padding: 10px 20px 10px;
  display: flex;
  flex-flow: row wrap;
  .videoCol{
    //background: #000;
    margin-top: 0.4%;
    margin-right: 0.5%;
    cursor: pointer;
    border: 2px solid #0F1624;
    display: flex;
    flex-direction: column;
    .topTitle{
      height: 34px;
      line-height: 32px;
      //background: rgba(0, 0, 0, 0.6);
      background: #000;
      //opacity: 0.6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span{
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
      }
    }
    .initPlayer{
      flex: auto;
      background: #000;
    }
    video{
      //width: 100%;
      background: #000;
      flex: 1 1 90%;
      outline: none;
    }
  }
  .isActive{
    border: 2px solid #1890FF;
  }
  .videoCol1{
    width: 100%;
    height: 100%;
    margin-right: 0;
  }
  .videoCol2{
    width: 49.5%;
    height: 49.4%;
  }
  .videoCol2:nth-child(2n){
    margin-right: 0;
  }
  .videoCol3{
    width: 32.6%;
    height: 32.6%;
  }
  .videoCol3:nth-child(3n){
    margin-right: 0;
  }
  .videoCol4{
    width: 24.25%;
    height: 24.25%;
  }
  .videoCol4:nth-child(4n){
    margin-right: 0;
  }
  .videoCol5{
    width: 19.2%;
    height: 19.2%;
  }
  .videoCol5:nth-child(5n){
    margin-right: 0;
  }
}
.tool-wrap{
  height: 52px;
  padding: 0 20px;
  background: linear-gradient(180deg, #192438, #000000);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .ico-row-wrap{
    height: 36px;
    background: linear-gradient(0deg, #0C131F, #020204);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.48);
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 0 5px;
    .vimg{
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      &:hover{
        background: linear-gradient(0deg, #0A101A, #243352, #020203);
      }
      .bgimg{
        width: 16px;
        height: 16px;
        background-size: 100% 100%;
      }
      .img1{
        background: url("../../assets/wfs/video/icon-row1.png") no-repeat;
      }
      .img2{
        background: url("../../assets/wfs/video/icon-row2.png") no-repeat;
      }
      .img3{
        background: url("../../assets/wfs/video/icon-row3.png") no-repeat;
      }
      .img4{
        background: url("../../assets/wfs/video/icon-row4.png") no-repeat;
      }
      .img5{
        background: url("../../assets/wfs/video/icon-row5.png") no-repeat;
      }
    }
    .check{
      background: linear-gradient(0deg, #0A101A, #243352, #020203);
      .img1{
        background: url("../../assets/wfs/video/icon-row-high1.png") no-repeat;
      }
      .img2{
        background: url("../../assets/wfs/video/icon-row-high2.png") no-repeat;
      }
      .img3{
        background: url("../../assets/wfs/video/icon-row-high3.png") no-repeat;
      }
      .img4{
        background: url("../../assets/wfs/video/icon-row-high4.png") no-repeat;
      }
      .img5{
        background: url("../../assets/wfs/video/icon-row-high5.png") no-repeat;
      }
    }
  }
  .vhr{
    width: 1px;
    height: 17px;
    background: #19213B;
    box-shadow: 0 1px 0 0 #000000;
  }
  .icon-params-wrap{
    position: relative;
    height: 36px;
    margin-right: 4px;
    padding-right: 4px;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.48);
    background: linear-gradient(0deg, #0C131F, #020204);
    border-radius: 2px;
    //overflow: hidden;
    .video-icon{
      width: 48px;
      height: 26px;
      padding: 0 12px;
      cursor: pointer;
      outline: none;
    }
    .video-slider0{
      position: absolute;
      top: -102px;
      left: 4px;
      display: none;
    }
    .video-slider1{
      position: absolute;
      top: -102px;
      left: 54px;
      display: none;
    }
    .video-slider2{
      position: absolute;
      top: -102px;
      left: 103px;
      display: none;
    }
    .video-slider3{
      position: absolute;
      top: -102px;
      left: 152px;
      display: none;
    }
    .show-slider{
      display: block;
    }
  }
}
</style>

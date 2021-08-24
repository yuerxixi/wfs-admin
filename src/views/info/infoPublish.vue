<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="operate-btn">
      <el-button type="primary" round icon="el-icon-plus" @click="showInfoDialog({}, 'add')">信息发布</el-button>
    </div>

    <el-card class="box-card">
      <div class="head-container">
        <div class="search-text">
          <div>
            <span style="margin-right: 6px;font-size: 14px;">状态</span>
            <el-select v-model="queryParam.state" size="mini" clearable placeholder="请选择状态" style="width: 180px;">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div>
            <span style="margin-right: 6px;font-size: 14px;">类型</span>
            <el-select v-model="queryParam.messageType" size="mini" clearable placeholder="请选择类型" style="width: 180px;">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <el-button size="mini" icon="el-icon-search" type="primary" style="margin-right: 10px" @click="toQuery">搜 索</el-button>
          <el-button size="mini" icon="el-icon-refresh-left" @click="resetQuery()">重 置</el-button>
        </div>
      </div>
      <!--列表展示-->
      <el-table ref="table" v-loading="loading" highlight-current-row :data="infoPublishListData" row-class-name="rowClass" max-height="660px" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
        <el-table-column label="序号" type="index" :index="indexMethod" width="120" />
        <el-table-column prop="messageTitle" show-overflow-tooltip label="标题" />
        <el-table-column prop="deviceName" show-overflow-tooltip label="投放设备" />
        <el-table-column prop="messageDescribe" show-overflow-tooltip label="内容描述" />
        <el-table-column prop="stateName" show-overflow-tooltip label="状态" width="140" />
        <el-table-column prop="messageTimeFormat" show-overflow-tooltip label="投放时间" />
        <el-table-column prop="messageInterval" show-overflow-tooltip label="投放时段" width="110" />
        <el-table-column label="操作" width="300px" align="center" fixed="right">
          <template v-slot="{ row }">
            <el-button size="mini" style="margin-right: 3px;" type="text" @click="showRemoteControlDialog(row)">远程控制</el-button>
            <el-button size="mini" style="margin-right: 3px;" type="text" @click="showReadInfoDialog(row)">详情</el-button>
            <el-button v-if="row.state !== 1 && row.state !== 3" size="mini" style="margin-right: 3px;" type="text" @click="showInfoDialog(row, 'edit')">修改</el-button>
            <el-button v-if="row.state !== 1 && row.state !== 3" size="mini" style="margin-right: 3px;" type="text" @click="handleStartData(row)">启用</el-button>
            <el-button v-if="row.state === 1" size="mini" style="margin-right: 3px;" type="text" @click="handleStopData(row)">停用</el-button>
            <el-button v-if="row.state !== 1" size="mini" style="margin-right: 3px;" type="text" @click="handleDelData(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page.sync="currentPage"
        :page-size="queryParam.limit"
        background
        layout="total, prev, pager, next"
        @current-change="pageChangeHandler"
      />
      <infoPublishDialog
        :visible.sync="infoPublishVisible"
        :dialog-data="dialogData"
        :dialog-tree-data="dialogTreeData"
        @refresh="refresh"
      />
      <read-info-dialog
        :read-visible.sync="readInfoVisible"
        :dialog-data="dialogData"
      />
      <remote-control-dialog
        :visible.sync="remoteControlVisible"
        :dialog-data="dialogData"
        @refresh="refresh"
      />
    </el-card>
  </div>
</template>

<script>
import {
  getInfoPublishListData,
  deleteInfoPublish,
  stopInfoPublish,
  startInfoPublish,
  getInfoFiles,
  getLEDParkTreeData,
  getLEDDeviceTreeData
} from '../../api/info/infoPublish'
import RemoteControlDialog from './components/RemoteControlDialog'

export default {
  name: 'InfoPublish',
  components: {
    RemoteControlDialog,
    ReadInfoDialog: () => import('./components/readInfoDialog'),
    infoPublishDialog: () => import('./components/infoPublishDialog')
  },
  data() {
    return {
      infoPublishListData: [],
      loading: false,
      stateOptions: [
        {
          value: 0,
          label: '未开始'
        }, {
          value: 1,
          label: '进行中'
        }, {
          value: 2,
          label: '已暂停'
        }, {
          value: 3,
          label: '已过期'
        }
      ],
      typeOptions: [
        {
          value: '1',
          label: '文本'
        }, {
          value: '2',
          label: '图片'
        }, {
          value: '3',
          label: '视频'
        }
      ],
      currentId: 0,
      dialogFlag: false,
      dialogType: '',
      infoPublishVisible: false,
      readInfoVisible: false,
      remoteControlVisible: false,
      dialogData: {},
      dialogTreeData: [],
      queryParam: {
        page: 1,
        limit: 10,
        state: '',
        messageType: ''
      },
      total: 0,
      currentPage: 1,
      operationTime: '',
      operationSS: 0
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化加载数据
    initData() {
      this.getList()
      this.getLEDTree()
    },
    // 加载列表数据
    getList() {
      this.loading = true
      getInfoPublishListData(this.queryParam).then(res => {
        // console.log(res)
        this.loading = false
        res.page.list.forEach(item => {
          const stateObj = this.stateOptions.find(item2 => {
            return item.state === item2.value
          })
          item.stateName = stateObj.label
          if (item.timeType === 1) {
            item.messageTimeFormat = `${item.messageTime.split(';')[0]} 至 ${item.messageTime.split(';')[1]}`
          } else {
            item.messageTimeFormat = item.messageTime
          }
        })
        this.infoPublishListData = res.page.list
        this.total = res.page.totalCount
        this.currentPage = res.page.currPage
      }).catch(() => {
        this.loading = false
      })
    },
    indexMethod(index) {
      return this.queryParam.limit * (this.currentPage - 1) + index + 1
    },
    // 加载LED树数据
    getLEDTree() {
      getLEDParkTreeData().then(res => {
        this.changeDataStructure(res.list)
        this.dialogTreeData = res.list
      })
    },
    // 改变树的数据结构
    changeDataStructure(data) {
      if (data.length) {
        data.forEach(item => {
          if (item.resourceType === 'parkFloor') {
            getLEDDeviceTreeData({ indexCode: item.indexCode, deviceType: '显示屏' }).then(res => {
              res.data.forEach(item => {
                item.name = item.deviceName
              })
              item.children = res.data
            })
          } else if (item.children && item.children.length > 0) {
            this.changeDataStructure(item.children)
          }
        })
      }
    },
    // 重新请求数据
    refresh() {
      // 获取list数据
      this.getList()
    },
    // 删除数据
    handleDelData(row) {
      const json = {
        messageId: row.messageId
      }
      this.$confirm('删除后无法找回，确认删除此信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.loading = true
        deleteInfoPublish(json).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.infoPublishListData.length === 1 && this.queryParam.page > 1) {
              this.queryParam.page--
            }
            this.refresh()
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        // 取消
      })
    },
    // 显示编辑页
    showInfoDialog(row, dtype) {
      // if (dtype === 'edit') {
      // getInfoFiles({ messageId: row.messageId }).then(res => {
      //   // console.log(res)
      //   // 还原投放内容
      //   res.data.forEach(item => {
      //     if (item.messageType === 2) {
      //       item.accept = 'image/jpeg,image/png'
      //       item.uploadTip = '仅供上传jpg/png'
      //       item.option = { fileType: '2' }
      //       item.fileList = [{ name: item.oldFileName, url: `${process.env.VUE_APP_UPLOAD_API}/jh-file/${item.messageContent}` }]
      //       // item.fileList = [{ name: item.oldFileName, url: `${process.env.VUE_APP_BASE_API}/api/plough_file/${item.messageContent}` }]
      //     } else if (item.messageType === 3) {
      //       item.accept = 'audio/mp4,video/mp4'
      //       item.uploadTip = '仅供上传mp4'
      //       item.option = { fileType: '3' }
      //       item.fileList = [{ name: item.oldFileName, url: `${process.env.VUE_APP_UPLOAD_API}/jh-file/${item.messageContent.replace('mp4', 'jpg')}` }]
      //       // item.fileList = [{ name: item.oldFileName, url: `${process.env.VUE_APP_BASE_API}/api/plough_file/${item.messageContent.replace('mp4', 'jpg')}` }]
      //     }
      //     if (!item.fileList) {
      //       item.fileList = []
      //       item.option = {}
      //     }
      //   })
      //   this.dialogData = row
      //   this.dialogData.tMessageContentList = res.data
      //   this.dialogData.dtype = dtype
      //   this.infoPublishVisible = true
      // })
      // this.dialogData = row
      // this.dialogData.tMessageContentList = res.data
      // this.dialogData.dtype = dtype
      // this.infoPublishVisible = true
      // } else {
      //   this.infoPublishVisible = true
      //   this.dialogData = row
      //   this.dialogData.dtype = dtype
      // }
      this.infoPublishVisible = true
      this.dialogData = row
      this.dialogData.dtype = dtype
    },
    // 显示详情
    showReadInfoDialog(row) {
      getInfoFiles({ messageId: row.messageId }).then(res => {
        res.data.forEach(item => {
          if (item.messageType === 2) {
            item.httpUrl = `${process.env.VUE_APP_UPLOAD_API}/jh-file/${item.messageContent}`
            // item.httpUrl = `${process.env.VUE_APP_BASE_API}/api/plough_file/${item.messageContent}`
          } else if (item.messageType === 3) {
            item.httpUrl = `${process.env.VUE_APP_UPLOAD_API}/jh-file/${item.messageContent.replace('mp4', 'jpg')}`
            // item.httpUrl = `${process.env.VUE_APP_BASE_API}/api/plough_file/${item.messageContent.replace('mp4', 'jpg')}`
          }
        })
        this.dialogData = row
        this.dialogData.tMessageContentList = res.data
        this.readInfoVisible = true
      })
    },
    // 显示远程控制弹框
    showRemoteControlDialog(row) {
      this.dialogData = row
      this.remoteControlVisible = true
    },
    // 改变当前页
    pageChangeHandler(page) {
      this.queryParam.page = page
      this.getList()
    },
    // 重置查询
    resetQuery() {
      this.queryParam.state = ''
      this.queryParam.messageType = ''
      this.getList()
    },
    // 查询
    toQuery() {
      this.getList()
    },
    // 启用数据
    handleStartData(row) {
      const json = {
        messageId: row.messageId
      }
      if (this.intervalTime(10)) {
        this.$confirm('是否启用该信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          this.loading = true
          startInfoPublish(json).then(res => {
            if (res.code === 200 || res.code === 600) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.operationTime = new Date().getTime()
              this.refresh()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          // 取消
        })
      } else {
        this.$message({
          type: 'warning',
          message: `操作频繁，请于${this.operationSS}秒后重试!`
        })
      }
    },
    // 停用数据
    handleStopData(row) {
      const json = {
        messageId: row.messageId
      }
      if (this.intervalTime(10)) {
        this.$confirm('暂停后将不再投放此信息，确认暂停?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          this.loading = true
          stopInfoPublish(json).then(res => {
            if (res.code === 200 || res.code === 600) {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.operationTime = new Date().getTime()
              this.refresh()
            } else {
              this.$message({
                type: 'error',
                message: res.message
              })
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {
          // 取消
        })
      } else {
        this.$message({
          type: 'warning',
          message: `操作频繁，请于${this.operationSS}秒后重试!`
        })
      }
    },
    // 如果间隔时间小于timeSS，返回false，否则返回true
    intervalTime(timeSS) {
      const nowTime = new Date().getTime()
      if (this.operationTime === '') {
        return true
      } else {
        const ss = Math.floor((nowTime - this.operationTime) / 1000)
        this.operationSS = timeSS - ss
        return ss >= timeSS
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
>>> .rowClass{
  height: 60px;
}
</style>

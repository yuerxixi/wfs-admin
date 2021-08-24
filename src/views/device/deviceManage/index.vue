<!--设备管理的主页面-->
<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="operate-btn">
      <el-button
        v-for="(btn, index) in operateBtn"
        :key="index"
        type="primary"
        round
        @click="roleButtonCommand(btn)"
      >{{ btn }}</el-button>
    </div>
    <el-card class="box-card">
      <!-- 搜索 -->
      <div class="head-container">
        <div class="search-text">
          <div>
            <span style="margin-right: 6px;">设备类型</span>
            <el-select
              v-model="Mix_searchConditions.deviceType"
              clearable
              size="mini"
              style="width: 180px;"
              placeholder="请选择"
              @change="typeChange"
            >
              <el-option
                v-for="item in searchOption.deviceType"
                :key="item.name"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </div>
          <div>
            <span style="margin-right: 6px;">设备型号</span>
            <el-select
              v-model="Mix_searchConditions.deviceModel"
              clearable
              size="mini"
              style="width: 180px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in searchOption.deviceModel"
                :key="item.name"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <span style="margin-right: 6px;">关联区域</span>
            <el-select
              v-model="Mix_searchConditions.areaId"
              clearable
              size="mini"
              style="width: 180px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in searchOption.deviceArea"
                :key="item.name"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <span style="margin-right: 6px;">设备名称</span>
            <el-input
              v-model="Mix_searchConditions.deviceName"
              size="mini"
              clearable
              placeholder="输入名称或者描述搜索"
              style="width: 180px;"
            />
          </div>
          <el-button
            size="mini"
            icon="el-icon-search"
            type="primary"
            style="margin-right: 10px"
            @click="search"
          >搜 索</el-button>
          <el-button
            size="mini"
            icon="el-icon-refresh-left"
            @click="reset"
          >重 置</el-button>
        </div>
      </div>
      <!--设备管理-->
      <el-table
        ref="table"
        highlight-current-row
        :data="tableData"
        :header-cell-style="{ background: '#DDDDDD', color: '#606266' }"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="deviceType" width="160" label="设备类型" />
        <el-table-column prop="deviceModel" width="160" label="设备型号" />
        <el-table-column prop="terminalId" label="终端ID" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="relationArea" label="关联区域" />
        <el-table-column prop="lamppostId" label="关联灯杆" />
        <el-table-column
          label="操作"
          width="300px"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              v-for="btn in scopeBtn"
              :key="btn.index"
              type="text"
              size="small"
              @click.native.prevent="changeRow(scope, btn)"
            >{{ btn }}</el-button>
            <el-button
              v-show="
                scope.row.deviceType === '灯杆' ||
                  scope.row.deviceType === '灯具'
              "
              type="text"
              size="small"
              @click.native.prevent="changeRow(scope, '远程控制')"
            >远程控制</el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="changeRow(scope, '删除')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="total"
        :current-page.sync="currentPage"
        :page-size="Mix_searchConditions.pageSize"
        background
        layout="total, prev, pager, next"
        @current-change="pageChangeHandler"
      />
    </el-card>
    <add-device
      :visible.sync="showDialog.addDeviceVisible"
      :title="dialogType"
      :row-info="rowInfo"
      :search-option="searchOption"
      @refreshForm="getTableData"
      @changeTreeName="changeTreeName"
      @refreshTree="getDailogTree"
    />
    <device-associated
      :visible.sync="showDialog.deviceAssociatedVisible"
      :title="dialogType"
      :row-info="relateRowInfo"
      :get-stree="getStree"
      :dialog-tree-data="dialogTreeData"
      @refreshForm="getTableData"
      @rowTitle="rowTitle"
      @removeRowInfo="removeRowInfo"
    />
    <remote-control
      :visible.sync="showDialog.remoteControlVisible"
      :title="dialogType"
      :get-stree="getStree"
      @refreshForm="getTableData"
    />
    <remote-control-cell
      :visible.sync="showDialog.remoteControlCellVisible"
      :title="dialogType"
      :device-id="rowInfo.deviceId"
      :row-info="rowInfo"
      @refreshForm="getTableData"
    />
    <import-files
      :visible.sync="showDialog.importVisible"
      :mix_import-conditions="Mix_importConditions"
      :mix-search-conditions="Mix_searchConditions"
      @refresh-upload="getTableData"
    />
  </div>
</template>

<script>
import AddDevice from './components/AddDevice/AddDevice'
import DeviceAssociated from './components/DeviceAssociated/DeviceAssociated'
import RemoteControl from './components/RemoteControl/RemoteControl'
import RemoteControlCell from './components/RemoteControlCell/RemoteControlCell'
import { getTableFetch, getDeviceDel, deviceTypeModel, excelExport } from '../../../api/device/deviceManage'
import { deviceTypeList, deviceArea, dictionaryModels } from '../../../api/device/public'
import ImportFiles from '../../../components/ImportFiles/import-files'
import { downloadFile } from '../../../utils/common'
import { parkDevices, parkTreeList } from '../../../api/light/light'

export default {
  name: 'Device',
  components: { ImportFiles, RemoteControlCell, RemoteControl, DeviceAssociated, AddDevice },
  data() {
    return {
      /* 表格相关 */
      tableData: [],
      Mix_searchConditions: {
        currPage: 1,
        pageSize: 10
      },
      // 筛选器下拉数据
      searchOption: {
        deviceType: [], // 设备类型
        deviceModel: [], // 设备型号
        deviceArea: [] // 关联区域
      },
      // 导入
      Mix_importConditions: {
        title: '设备导入',
        templateName: '扬州广陵智慧服务区设备管理模版',
        uploadUrl: '/api/device/excel/import', // 导入接口
        url: '/api/device/excel/download' // 下载模版接口
      },
      // 弹窗显示
      dialogType: '',
      dialogTreeData: [],
      showDialog: {
        addDeviceVisible: false, // 新增设备
        deviceAssociatedVisible: false, // 关联设备
        remoteControlVisible: false, // 远程控制
        remoteControlCellVisible: false, // 远程控制
        importVisible: false // 导入
      },
      operateBtn: [
        '新增设备',
        '设备关联',
        '远程控制',
        '导入',
        '导出'
      ],
      checked: [],
      scopeBtn: ['修改', '设备关联'],
      rowInfo: {}, // 用于行间操作传递参数
      relateRowInfo: {}, // 用于区别于设备关联的入口及传递参数
      lamppostId: null,
      total: 0,
      currentPage: 1,
      loading: false,
      getStree: false // 用于判断在新增后重新获取树型结构
    }
  },
  created() {
    this.getTableData()
    this.getSearchData()
    this.getDailogTree()
  },
  mounted() {
  },
  methods: {
    // 筛选器的下拉数据
    getSearchData() {
      deviceTypeList().then(res => {
        this.searchOption.deviceType = res.data.deviceType.map(
          (item, index) => ({
            value: index,
            label: item
          })
        )
      })
      // 关联区域
      deviceArea().then(res => {
        this.searchOption.deviceArea = res.list.map((item, index) => ({
          value: item.floorSyscode,
          label: `扬州广陵服务区/${item.parkName}/${item.floorName}`
        }))
      })
      this.typeChange('')
    },
    // 设备型号下拉框
    typeChange(e) {
      delete this.Mix_searchConditions.deviceModel
      if (e === '') {
        // 全部型号
        dictionaryModels({}).then(res => {
          this.searchOption.deviceModel = res.data.map((item, index) => ({
            value: item.id,
            label: item.deviceModel
          }))
        })
      } else {
        // 选择设备类型后的对应型号
        deviceTypeModel({ deviceType: e }).then(res => {
          this.searchOption.deviceModel = res.data.list.map((item, index) => ({
            value: item.id,
            label: item.deviceModel
          }))
        })
      }
    },
    // 表格数据
    getTableData() {
      getTableFetch(this.Mix_searchConditions).then(res => {
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.currentPage = res.data.currPage
      })
    },
    getDailogTree() {
      parkTreeList().then(res => {
        this.dialogTreeData = res.list
        this.changeDataStructure(res.list)
      })
    },
    changeDataStructure(data) {
      if (data.length) {
        data.forEach(item => {
          if (item.resourceType === 'parkFloor') {
            parkDevices({ indexCode: item.indexCode, deviceType: '灯杆' }).then(res => {
              res.data.forEach(item => {
                item.name = `${item.deviceModel}-${item.deviceName}`
              })
              item.children = res.data
            })
          } else if (item.children && item.children.length > 0) {
            this.changeDataStructure(item.children)
          }
        })
      }
    },
    // 改变当前页
    pageChangeHandler(page) {
      this.Mix_searchConditions.currPage = page
      this.getTableData()
    },
    search() {
      this.Mix_searchConditions.currPage = 1
      this.getTableData()
    },
    reset() {
      this.typeChange('')
      this.Mix_searchConditions = {
        currPage: 1,
        pageSize: 10
      }
      this.getTableData()
    },
    roleButtonCommand(command) {
      switch (command) {
        case '新增设备':
          this.showDialog.addDeviceVisible = true
          this.dialogType = '新增设备'
          this.getStree = false
          break
        case '设备关联':
          this.showDialog.deviceAssociatedVisible = true
          this.dialogType = '关联设备'
          this.relateRowInfo = {}
          break
        case '远程控制':
          this.showDialog.remoteControlVisible = true
          this.dialogType = '远程控制'
          break
        case '导入':
          this.showDialog.importVisible = true
          break
        case '导出':
          if (this.checked.length < 1) {
            this.$message({
              message: '请选择要导出的数据',
              type: 'warning'
            })
          } else {
            this.$confirm('确定导出吗?', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              customClass: 'el-message-box-oppositeBtns',
              type: 'warning'
            }).then(() => {
              excelExport({ list: this.checked }).then(response => {
                downloadFile(response, '设备管理数据列表')
                this.$message({
                  type: 'success',
                  message: '导出成功!'
                })
                this.getTableData()
              })
            })
          }
          break
        default:
          break
      }
    },
    fileFilter(response, text) {
      const a = document.createElement('a')
      const blob = new Blob([response], {
        type: 'application/vnd.ms-excel'
      })
      this.downloadUrl = window.URL.createObjectURL(blob)
      a.setAttribute('href', this.downloadUrl)
      a.setAttribute('download', `${text}.xlsx`)
      a.click()
    },
    changeRow(rowInfo, command) {
      this.rowInfo = rowInfo.row
      switch (command) {
        case '修改':
          this.showDialog.addDeviceVisible = true
          this.dialogType = '修改设备'
          this.getStree = false
          break
        case '设备关联':
          this.showDialog.deviceAssociatedVisible = true
          this.dialogType = '关联设备'
          this.relateRowInfo = this.rowInfo
          break
        case '远程控制':
          this.showDialog.remoteControlCellVisible = true
          this.dialogType = '远程控制'
          break
        case '删除':
          var num = this.tableData.length
          console.log(num)
          if (this.rowInfo.lamppostId === null) {
            this.$confirm(
              '确认删除?',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'el-message-box-oppositeBtns',
                type: 'warning'
              }
            )
              .then(() => {
                getDeviceDel({ deviceId: this.rowInfo.deviceId }).then(res => {
                  if (res.code === 200) {
                    if (num === 1) {
                      this.Mix_searchConditions.currPage > 1 ? this.Mix_searchConditions.currPage -= 1 : this.Mix_searchConditions.currPage
                    }
                    this.getTableData()
                    this.getStree = true
                    this.$message({ message: '删除成功', type: 'success' })
                  } else {
                    this.$message({
                      message: '灯杆还存在关联设备',
                      type: 'error'
                    })
                  }
                })
              })
              .catch(() => {})
          } else {
            this.$confirm(
              '此设备已关联其他设备，删除后将同步删除关联状态，确认删除?',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'el-message-box-oppositeBtns',
                type: 'warning'
              }
            )
              .then(() => {
                getDeviceDel({ deviceId: this.rowInfo.deviceId }).then(res => {
                  if (num === 1) {
                    this.Mix_searchConditions.currPage > 1 ? this.Mix_searchConditions.currPage -= 1 : this.Mix_searchConditions.currPage
                  }
                  this.getTableData()
                  this.getStree = true
                  this.$message({ message: '删除成功', type: 'success' })
                })
              })
              .catch(() => {})
          }

          break
        default:
          break
      }
    },
    // 行进入的关联设备的标签名称
    rowTitle() {
      if (!(this.relateRowInfo.deviceId === undefined)) {
        let title = ''
        if (this.relateRowInfo.deviceName !== '') {
          title = ` - ${this.relateRowInfo.deviceName}`
        }

        if (
          this.relateRowInfo.relationArea !== '' &&
          !(this.relateRowInfo.relationArea === null)
        ) {
          title = `${title} - ${this.relateRowInfo.relationArea}`
        }
        this.dialogType = `${this.dialogType}(${
          this.relateRowInfo.deviceType
        } - ${this.relateRowInfo.deviceModel}${title})`
      }
    },
    changeTreeName() {
      this.getStree = true
    },
    // 关闭弹窗后清除relateRowInfo的值
    removeRowInfo() {
      this.relateRowInfo = {}
    },
    // 触发单选
    selectionChange(val) {
      this.checked = val
      console.log(this.checked)
    },
    checkboxT(row) {
      return row.level >= this.level
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;
  color: #303133;
  font-size: 15px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-pagination {
  z-index: 99;
}
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__multi-value {
  margin-bottom: 0;
}
::v-deep .vue-treeselect__multi-value-item {
  border: 0;
  padding: 0;
}
::v-deep .el-table__row {
  height: 65px;
}
</style>

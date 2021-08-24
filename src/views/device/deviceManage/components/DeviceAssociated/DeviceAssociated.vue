<!--设备关联-->
<template>
  <el-dialog
    id="equipmentAssociated"
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    center
    :width="notRowClick ? '1700px' : '1450px'"
    :before-close="handleClose"
  >
    <el-row class="container">
      <el-col v-show="notRowClick" :span="4">
        <div class="contain-tree">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :highlight-current="isHighlight"
            @current-change="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="notRowClick ? 10 : 11">
        <div class="table-relative">
          <div class="table-relative-title">
            <b />
            <b>添加关联设备</b>
          </div>
          <div style="margin:20px;">
            <!-- 搜索 -->
            <div class="head-container">
              <div class="search-text">
                <div>
                  <span>设备类型</span>
                  <el-select
                    v-model="Mix_searchConditions1.deviceType"
                    clearable
                    :disabled="!notRowClick && rowInfo.deviceType !== '灯杆'"
                    size="mini"
                    style="width: 170px;margin-top: 10px;"
                    placeholder="请选择"
                    @change="typeChange(1)"
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
                  <span>设备型号</span>
                  <el-select
                    v-model="Mix_searchConditions1.deviceModel"
                    clearable
                    size="mini"
                    style="width: 170px;margin-top: 10px;"
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
                <el-button
                  size="mini"
                  icon="el-icon-search"
                  type="primary"
                  style="margin-right: 10px;margin-top: 22px;"
                  @click="search(1)"
                >搜 索</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-refresh-left"
                  style="margin-top: 22px;"
                  @click="reset(1)"
                >重 置</el-button>
              </div>
            </div>
            <!--角色管理-->
            <el-table
              ref="table"
              height="446"
              highlight-current-row
              :data="tableDataOther"
              :header-cell-style="{ background: '#DDDDDD', color: '#606266' }"
              @current-change="handleCurrentChange"
            >
              <el-table-column prop="deviceType" label="设备类型" />
              <el-table-column prop="deviceModel" label="设备型号" />
              <el-table-column prop="deviceName" label="设备名称" />
              <el-table-column label="操作" width="70" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click.native.prevent="changeRow(scope, 'crux')"
                  >关联</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="notRowClick ? 10 : 12">
        <div class="table-relative">
          <div class="table-unrelative">
            <b
              style="display: inline-block;width: 4px;height: 16px;background: #4B60D7;margin-right: 5px"
            />
            <b style="font-size: 18px;color: #111111">已关联设备</b>
          </div>
          <div style="margin:20px;">
            <!-- 搜索 -->
            <div class="head-container">
              <div class="search-text">
                <div>
                  <span>设备类型</span>
                  <el-select
                    v-model="searchConditions.deviceType"
                    clearable
                    :disabled="!notRowClick && rowInfo.deviceType !== '灯杆'"
                    size="mini"
                    style="width: 170px;"
                    placeholder="请选择"
                    @change="typeChange(2)"
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
                  <span>设备型号</span>
                  <el-select
                    v-model="searchConditions.deviceModel"
                    clearable
                    size="mini"
                    style="width: 170px;"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in searchOption.deviceModel2"
                      :key="item.name"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <el-button
                  size="mini"
                  icon="el-icon-search"
                  type="primary"
                  style="margin-right: 7px"
                  @click="search(2)"
                >搜 索</el-button>
                <el-button
                  size="mini"
                  icon="el-icon-refresh-left"
                  @click="reset(2)"
                >重 置</el-button>
              </div>
            </div>
            <!--角色管理-->
            <el-table
              ref="table"
              height="446"
              highlight-current-row
              :data="tableDataDevices"
              :header-cell-style="{ background: '#DDDDDD', color: '#606266' }"
              @current-change="handleCurrentChange"
            >
              <el-table-column prop="deviceType" label="设备类型" />
              <el-table-column prop="deviceModel" label="设备型号" />
              <!-- <el-table-column prop="deviceId" label="设备ID" /> -->
              <el-table-column prop="deviceName" label="设备名称" />
              <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click.native.prevent="changeRow(scope, 'del')"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button type="primary" round :loading="loading" @click="saveBtn">保存</el-button>
      <el-button round @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { dictionaryModels } from '../../../../../api/device/public'
import {
  deviceLamppostOthers,
  deviceLamppostDevices,
  deviceTypeList,
  deviceRelated,
  deviceRelateOthers,
  deviceRelateDevices,
  deviceTypeModel
} from '@/api/device/deviceManage'
export default {
  name: 'DeviceAssociated',
  props: {
    visible: [Boolean],
    title: [String],
    rowInfo: [Object],
    getStree: [Boolean],
    dialogTreeData: { type: Array, default() { return [] } }
  },
  data() {
    return {
      /* 表格相关 */
      tableDataOther: [],
      tableDataDevices: [],
      Mix_searchConditions1: {},
      searchConditions: {},
      // 筛选器下拉数据
      searchOption: {
        deviceType: [], // 设备类型
        deviceModel: [], // 设备型号
        deviceModel2: [] // 设备型号
      },
      dialogVisible: false,
      deptName: '',
      defaultProps: { children: 'children', label: 'name' },
      lamppostId: undefined,
      isHighlight: false,
      notRowClick: true, // 不是行间点击进入
      loading: false,
      treeData: []
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      val ? this.$emit('rowTitle') : ''
      console.log(this.dialogTreeData, 'dialogTreeData')
      this.treeData = JSON.parse(JSON.stringify(this.dialogTreeData))
    },
    rowInfo(val) {
      this.notRowClick = false
      if (val.deviceId === undefined) {
        this.notRowClick = true
      } else {
        this.lamppostId = this.rowInfo.lamppostId
        this.Mix_searchConditions1.deviceId = this.searchConditions.deviceId =
          val.deviceId
        const params = {
          deviceId: val.deviceId
        }
        this.getDeviceOtherList(params)
        this.getDeviceList(params)
      }
      if (val.deviceId !== undefined && val.deviceType !== '灯杆') {
        // 行间设备关联非灯杆类型需要禁止选择
        this.Mix_searchConditions1.deviceType = this.searchConditions.deviceType =
          val.deviceType
        this.typeChange(1)
        this.typeChange(2)
      } else {
        this.typeChange('')
      }
    }
  },
  mounted() {
    this.getSearchData()
    this.typeChange('')
  },
  methods: {
    // 获取列表
    getDeviceOtherList(params) {
      if (this.notRowClick) {
        deviceLamppostOthers(params).then(res => {
          this.tableDataOther = res.data
        })
      } else {
        deviceRelateOthers(params).then(res => {
          this.tableDataOther = res.data
        })
      }
    },
    getDeviceList(params) {
      if (this.notRowClick) {
        deviceLamppostDevices(params).then(res => {
          this.tableDataDevices = res.data
        })
      } else {
        console.log(params)
        deviceRelateDevices(params).then(res => {
          this.tableDataDevices = res.data
        })
      }
    },
    // 选择下拉框数据
    getSearchData() {
      deviceTypeList().then(res => {
        this.searchOption.deviceType = res.data.deviceType.map(
          (item, index) => ({
            value: index,
            label: item
          })
        )
      })
    },
    typeChange(index, num) {
      // console.log(index)
      // console.log(num)
      // index---1：关联设备 2：已关联设备
      // num---置空哪一个
      // 选择设备类型时清空设备型号重新获取
      if (index === 1) {
        delete this.Mix_searchConditions1.deviceModel
      } else if (index === 2) {
        delete this.searchConditions.deviceModel
      }
      if (index === '') {
        // 全部型号
        dictionaryModels({}).then(res => {
          if (num === 1) {
            this.searchOption.deviceModel = res.data.map((item, index) => ({
              value: item.id,
              label: item.deviceModel
            }))
          } else if (num === 2) {
            this.searchOption.deviceModel2 = res.data.map((item, index) => ({
              value: item.id,
              label: item.deviceModel
            }))
          } else {
            this.searchOption.deviceModel = res.data.map((item, index) => ({
              value: item.id,
              label: item.deviceModel
            }))
            this.searchOption.deviceModel2 = res.data.map((item, index) => ({
              value: item.id,
              label: item.deviceModel
            }))
          }
        })
      } else {
        // 选择设备类型后的对应型号

        deviceTypeModel({
          deviceType:
            index === 1
              ? this.Mix_searchConditions1.deviceType
              : this.searchConditions.deviceType
        }).then(res => {
          if (index === 1) {
            this.searchOption.deviceModel = res.data.list.map(
              (item, index) => ({
                value: item.id,
                label: item.deviceModel
              })
            )
          } else if (index === 2) {
            this.searchOption.deviceModel2 = res.data.list.map(
              (item, index) => ({
                value: item.id,
                label: item.deviceModel
              })
            )
          }
        })
      }
    },
    search(index) {
      if (this.notRowClick && this.lamppostId === undefined) {
        this.$message({ message: '请先选择要关联的灯杆', type: 'error' })
      } else {
        if (index === 1) {
          this.getDeviceOtherList(this.Mix_searchConditions1)
        } else if (index === 2) {
          this.getDeviceList(this.searchConditions)
        }
      }
    },
    reset(index) {
      if (index === 1) {
        this.Mix_searchConditions1 = {}
      } else {
        this.searchConditions = {}
      }
      if (!this.notRowClick) {
        if (this.rowInfo.deviceType !== '灯杆') {
          this.Mix_searchConditions1.deviceType = this.rowInfo.deviceType
          this.searchConditions.deviceType = this.rowInfo.deviceType
          this.typeChange(index)
        } else {
          this.typeChange('', index)
        }
        this.Mix_searchConditions1.deviceId = this.rowInfo.deviceId
        this.searchConditions.deviceId = this.rowInfo.deviceId
      } else {
        this.typeChange('', index)
        if (index === 1) {
          this.Mix_searchConditions1 = {}
        } else {
          this.searchConditions = {}
        }
        this.Mix_searchConditions1.lamppostId = this.lamppostId
        this.searchConditions.lamppostId = this.lamppostId
      }

      if (!(this.notRowClick && this.lamppostId === undefined)) {
        if (index === 1) {
          this.getDeviceOtherList(this.Mix_searchConditions1)
        } else if (index === 2) {
          // const params = this.Mix_searchConditions1
          this.getDeviceList(this.Mix_searchConditions1)
        }
      }
    },

    // 关联
    changeRow(row, operation) {
      if (operation === 'crux') {
        if (this.notRowClick && this.lamppostId === undefined) {
          this.$message({ message: '请先选择要关联的灯杆', type: 'error' })
        } else if (
          !this.notRowClick &&
          this.rowInfo.deviceType !== '灯杆' &&
          this.tableDataDevices.length > 0
        ) {
          this.$message({ message: '只能关联一个灯杆', type: 'error' })
        } else {
          this.tableDataDevices.push(this.tableDataOther[row.$index])
          this.tableDataOther.splice(row.$index, 1)
        }
      } else if (operation === 'del') {
        this.tableDataOther.push(this.tableDataDevices[row.$index])
        this.tableDataDevices.splice(row.$index, 1)
      }
    },
    saveBtn() {
      const parmes = {
        lamppostId: '',
        list: []
      }

      if (!this.notRowClick && this.rowInfo.deviceType !== '灯杆') {
        parmes.list.push({ deviceId: this.rowInfo.deviceId })
        parmes.isLamppost = 0
        if (this.tableDataDevices.length === 1) {
          parmes.lamppostId = this.tableDataDevices[0].deviceId
        }
      } else {
        parmes.lamppostId =
          this.rowInfo.deviceType === '灯杆'
            ? this.rowInfo.deviceId
            : this.lamppostId
        if (this.tableDataDevices.length > 0) {
          this.tableDataDevices.forEach(item => {
            parmes.list.push({ deviceId: item.deviceId })
          })
        }
      }
      this.loading = true
      deviceRelated(parmes).then(res => {
        if (res.code === 200) {
          const data = {}
          if (this.notRowClick) {
            data.lamppostId = this.lamppostId
          } else {
            data.deviceId = this.rowInfo.deviceId
            // data.deviceType = this.rowInfo.deviceType;
          }
          // this.getDeviceOtherList(data);
          // this.getDeviceList(data);
          this.handleClose()

          this.Mix_searchConditions1 = {}
          this.searchConditions = {}
          this.$emit('refreshForm')
          this.$message({ message: '保存成功', type: 'success' })
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 触发单选
    handleCurrentChange(val) {},
    handleClose(done) {
      this.dialogVisible = this.isHighlight = false
      this.lamppostId = undefined
      this.loading = false
      this.tableDataOther = []
      this.tableDataDevices = []
      this.Mix_searchConditions1 = {}
      this.searchConditions = {}
      this.$emit('update:visible', this.showDialog)
      this.$emit('removeRowInfo')
    },
    handleNodeClick(data) {
      this.isHighlight = true
      this.lamppostId = data.deviceId
      this.Mix_searchConditions1 = {}
      this.searchConditions = {}
      this.Mix_searchConditions1.lamppostId = this.searchConditions.lamppostId =
        data.deviceId
      // 判断是否可继续展开
      if (data.resourceType === undefined) {
        this.getDeviceOtherList(this.Mix_searchConditions1)
        this.getDeviceList(this.searchConditions)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#equipmentAssociated {
  .container {
    height: 570px;
    width: 100%;
    border: 1px solid #dddddd;
    margin-top: 30px;
    border-radius: 4px;
    .contain-tree {
      height: 568px;
      overflow-y: scroll;
      background: #f2f2f2;
      border-right: solid #dddddd 1px;
      border-top-left-radius: 4px;
      padding-top: 20px;
      ::v-deep .el-tree {
        background: #f2f2f2;
      }
    }
    .table-relative {
      position: relative;
      height: 568px;
      border-right: solid #dddddd 1px;
      .table-relative-title {
        display: flex;
        justify-content: start;
        align-items: center;
        margin-left: 20px;
        padding-top: 20px;
        :first-child {
          display: inline-block;
          width: 4px;
          height: 16px;
          background: #4b60d7;
          margin-right: 5px;
        }
        :last-child {
          font-size: 18px;
          color: #111111;
        }
      }
    }
    .table-unrelative {
      display: flex;
      justify-content: start;
      align-items: center;
      margin-left: 20px;
      padding-top: 20px;
    }
  }
}

.el-input--medium .el-input__inner {
  background: #f2f2f2 !important;
}
::v-deep .el-dialog--center .el-dialog__body {
  padding: 20px 25px;
}
::v-deep .el-col {
  overflow: hidden;
}
::v-deep .el-table {
  overflow: scroll;
  height: 446px;
}
::v-deep .el-table::before {
  height: 0;
}
::-webkit-scrollbar {
  display: none;
}
::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: rgb(81, 101, 213);
}
</style>

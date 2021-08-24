<template>
  <el-dialog
    id="RemoteControl"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    center
    width="1300px"
    :before-close="handleClose"
  >
    <el-row class="container">
      <div class="table-relative">
        <div class="table-relative-title">
          <b />
          <b>设备列表</b>
        </div>
        <div style="margin:20px;">
          <!-- 搜索 -->
          <div class="head-container">
            <div class="search-text">
              <div>
                <span>设备类型</span>
                <el-select
                  v-model="Mix_searchConditions.deviceType"
                  clearable
                  size="mini"
                  style="width: 120px;"
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
                <span>设备型号</span>
                <el-select
                  v-model="Mix_searchConditions.deviceModel"
                  clearable
                  size="mini"
                  style="width: 120px;"
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
                <span>开关状态</span>
                <el-select
                  v-model="Mix_searchConditions.on"
                  clearable
                  size="mini"
                  style="width: 120px;"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in searchOption.on"
                    :key="item.name"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div>
                <span>当前亮度</span>
                <el-select
                  v-model="Mix_searchConditions.light"
                  clearable
                  size="mini"
                  style="width: 120px;"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in searchOption.light"
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
                @click="getDeviceList"
              >搜 索</el-button>
              <el-button
                size="mini"
                icon="el-icon-refresh-left"
                @click="reset"
              >重 置</el-button>
            </div>
          </div>
          <!--角色管理-->
          <el-table
            ref="table"
            size="small"
            height="360"
            highlight-current-row
            :data="tableData"
            :header-cell-style="{ background: '#DDDDDD', color: '#606266' }"
            @selection-change="selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="deviceType" label="设备类型" />
            <el-table-column prop="deviceModel" label="设备型号" />
            <el-table-column prop="deviceId" label="设备ID" />
            <el-table-column prop="deviceName" label="设备名称" />
            <el-table-column label="开关状态">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="info(scope.row.id)"
                >{{ scope.row.on }}</el-button>
              </template>
            </el-table-column>
            <el-table-column label="当前亮度">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="info(scope.row.id)"
                >{{ scope.row.light }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;position: absolute;bottom: 10px">
            <div style="margin-right: 60px">
              <span style="margin-right: 10px">开关控制：</span>
              <el-radio-group v-model="radio1">
                <el-radio
                  v-for="(item, index) in option"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </div>
            <div>
              <span style="margin-right: 10px">亮度调节：</span>
              <el-radio-group v-model="radio2">
                <el-radio
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  :disabled="radio1 === 0 ? true : false"
                >{{ item.value }}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!--分页组件-->
          <!-- <pagination /> -->
        </div>
      </div>
    </el-row>
    <div slot="footer">
      <el-button type="primary" round @click="saveBtn" :loading="loading">保存</el-button>
      <el-button round @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  deviceLampsList,
  deviceDimmingCommand,
  parkTreeList,
  deviceParkDevices,
  deviceTypeModel
} from '@/api/device/deviceManage'
import { dictionaryModels } from '../../../../../api/device/public'
export default {
  name: 'RemoteControl',

  props: {
    visible: [Boolean],
    title: [String],
    getStree: [Boolean]
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      deptName: '',
      tableData: [],
      Mix_searchConditions: {},
      lamppostId: undefined,
      searchOption: {
        deviceType: [
          {
            value: 1,
            label: '灯具'
          },
          {
            value: 2,
            label: '灯杆'
          }
        ],
        deviceModel: [],
        on: [
          {
            value: 0,
            label: '关灯'
          },
          {
            value: 1,
            label: '开灯'
          }
        ],
        light: [
          {
            value: 20,
            label: '20'
          },
          {
            value: 40,
            label: '40'
          },
          {
            value: 60,
            label: '60'
          },
          {
            value: 80,
            label: '80'
          },
          {
            value: 100,
            label: '100'
          }
        ]
      },
      deptDatas: [],
      radio1: '',
      radio2: '',
      checkedDeviceList: [],
      option: [{ value: '开灯', label: 1 }, { value: '关灯', label: 0 }],
      options: [
        { value: '20%', label: 20 },
        { value: '40%', label: 40 },
        { value: '60%', label: 60 },
        { value: '80%', label: 80 },
        { value: '100%', label: 100 }
      ]
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    radio1(newVal) {
      if (newVal === 0 || newVal === '') {
        this.radio2 = ''
      } else {
        this.radio2 = this.radio2 === '' ? 20 : this.radio2
      }
    }
  },
  mounted() {
    this.typeChange('')
  },
  methods: {
    getDeviceList() {
      // const params = this.Mix_searchConditions
      // this.searchOption.deviceModel.some(item => {
      //   if (item.label === this.Mix_searchConditions.deviceModel) {
      //     params.deviceModel = item.value
      //   }
      // })
      // if (this.lamppostId === undefined) {
      //   this.$message({ message: '请先选择灯杆', type: 'error' })
      // } else {
      deviceLampsList(this.Mix_searchConditions).then(res => {
        this.tableData = res.data
        if (res.data.length === 1) {
          this.radio1 = res.data[0].on === '关' ? 0 : 1
          console.log(res.data[0].light.replace('%', ''))
          this.radio2 = Number(res.data[0].light.replace('%', ''))
        } else {
          this.radio1 = ''
          this.radio2 = ''
        }
      })
      // }
    },
    getTreeData() {
      parkTreeList({}).then(res => {
        let data = []
        data = res.list
        data = this.eachAllList(data)
        this.treeData = data
      })
    },
    eachAllList(data) {
      if (data.length) {
        data.forEach(item => {
          if (item.resourceType === 'parkFloor') {
            deviceParkDevices({
              indexCode: item.indexCode,
              deviceType: '灯杆'
            }).then(res => {
              res.data.forEach(item => {
                item.name = `${item.deviceModel}-${item.deviceName}`
              })
              item.children = res.data
            })
          } else if (item.children && item.children.length > 0) {
            this.eachAllList(item.children)
          }
        })
        return data
      }
    },
    // 选择下拉框数据
    // typeChange() {
    //   dictionaryModels({}).then(res => {
    //     this.searchOption.deviceModel = res.data.map((item, index) => ({
    //       value: item.id,
    //       label: item.deviceModel
    //     }));
    //   });
    // },

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

    reset() {
      this.Mix_searchConditions = {}
      this.Mix_searchConditions.lamppostId = this.lamppostId
      this.getDeviceList()
    },
    saveBtn() {
      if (this.checkedDeviceList.length === 0) {
        this.$message({ message: '请选择设备', type: 'error' })
        return false
      } else if (this.radio1 === '') {
        this.$message({ message: '请先选择开关', type: 'error' })
        return false
      }
      const params = {
        list: this.checkedDeviceList,
        on: this.radio1,
        light: this.radio1 === '0' ? 0 : this.radio2
      }
      this.loading = true
      deviceDimmingCommand(params).then(res => {
        this.checkedDeviceList = []
        this.reset()
        this.handleClose()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    selectionChangeHandler(val) {
      this.checkedDeviceList = []
      val.forEach(item => {
        this.checkedDeviceList.push({ deviceId: item.deviceId })
      })
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        // this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.menuIds = []
        val.menus.forEach(function(data) {
          _this.menuIds.push(data.id)
        })
        this.showButton = true
      }
    },
    handleClose(done) {
      this.Mix_searchConditions = {}
      this.radio1 = ''
      this.radio2 = ''
      this.tableData = []
      this.lamppostId = undefined
      this.dialogVisible = false
      this.loading = false
      this.$emit('update:visible', this.showDialog)
    }
  }
}
</script>

<style lang="scss" scoped>
#RemoteControl {
  .container {
    height: 550px;
    width: 100%;
    border: 1px solid #dddddd;
    margin-top: 20px;
    border-radius: 4px;
    .contain-tree {
      height: 548px;
      background: #f2f2f2;
      border-right: solid #dddddd 1px;
      border-top-left-radius: 4px;
      padding-top: 20px;
      ::v-deep .el-tree {
        background: #f2f2f2;
      }
    }
    .table-relative {
      height: 548px;
      /*border-right: solid #DDDDDD 1px;*/
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
::v-deep .contain-tree {
  overflow-y: scroll;
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

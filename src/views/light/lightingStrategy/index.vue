<template>
  <div class="app-container">
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
      <!--表格渲染-->
      <el-table ref="table" style="width: 100%;" :data="tableData" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
        <el-table-column type="index" width="100" prop="id" label="序号" :index="indexMethod"/>
        <el-table-column width="150" :show-overflow-tooltip="true" prop="taskName" label="策略名称" />
        <el-table-column :show-overflow-tooltip="true" prop="taskTime" label="执行时间" />
        <el-table-column :show-overflow-tooltip="true" prop="switchData" label="开关任务" />
        <el-table-column :show-overflow-tooltip="true" prop="lightData" label="调关任务" />
        <el-table-column label="执行设备" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click.native.prevent="changeRow(scope,'查看设备')">查看设备</el-button>
          </template>
        </el-table-column>
        <el-table-column label="执行状态" width="120" align="center" fixed="right">
          <template slot-scope="scope">
            <span>{{ scope.row.taskStatus === 0 ? '执行中' : (scope.row.taskStatus === 1 ? '暂停' : '过期') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.taskStatus !== 0" type="text" size="small" @click.native.prevent="changeRow(scope,'修改')">修改</el-button>
            <el-button v-if="scope.row.taskStatus === 0" type="text" size="small" @click.native.prevent="changeRow(scope,'停用')">停用</el-button>
            <el-button v-if="scope.row.taskStatus === 1 || scope.row.taskStatus === 2" type="text" size="small" @click.native.prevent="changeRow(scope,'启用')">启用</el-button>
            <el-button v-if="scope.row.taskStatus !== 0" type="text" size="small" @click.native.prevent="changeRow(scope,'删除')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :total="total"
        :current-page.sync="currentPage"
        :page-size="Mix_searchConditions.limit"
        background
        layout="total, prev, pager, next"
        @current-change="pageChangeHandler"
      />
      <add-strategy
        :visible.sync="showDialog.strategyVisible"
        :title="dialogType"
        :row-info="rowInfo"
        :dialog-tree-data="dialogTreeData"
        @refreshForm="getTableData"
      />
      <check-device
        :visible.sync="showDialog.checkDeviceVisible"
        :title="dialogType"
        :row-info="rowInfo"
        @refreshForm="getTableData"
      />
      <remote-control
        :visible.sync="showDialog.remoteControlVisible"
        :title="dialogType"
        :get-stree="true"
      ></remote-control>
    </el-card>
  </div>
</template>

<script>
import AddStrategy from './addStrategy/addStrategy'
import { getTableList, lightTaskDelete, lightTaskOper, parkDevices, parkTreeList } from '../../../api/light/light'
import CheckDevice from './checkDevice/checkDevice'
import RemoteControl from '../../device/deviceManage/components/RemoteControl/RemoteControl'
export default {
  name: 'Syst',
  components: { RemoteControl, CheckDevice, AddStrategy },
  data() {
    return {
      /* 表格相关 */
      tableData: [],
      Mix_searchConditions: {
        page: 1,
        limit: 12
      },
      total: 0,
      currentPage: 1,
      operateBtn: [
        '远程控制',
        '新增策略'
      ],
      // 弹窗显示
      dialogType: '',
      dialogTreeData: [],
      showDialog: {
        strategyVisible: false, // 新增策略
        checkDeviceVisible: false, // 查看设备
        remoteControlVisible: false // 查看设备
      },
      // 列表行内操作按钮
      rowInfo: {}
    }
  },
  created() {
    this.getTableData()
  },
  mounted() {
    this.getDailogTree()
  },
  methods: {
    // 获取表格数据
    getTableData() {
      getTableList(this.Mix_searchConditions).then((res) => {
        this.tableData = res.page.list
        this.total = res.page.totalCount
        this.currentPage = res.page.currPage
      })
    },
    getDailogTree() {
      // 获取弹框内树结构
      parkTreeList().then(res => {
        this.dialogTreeData = res.list
        this.changeDataStructure(res.list)
      })
    },
    changeDataStructure(data) {
      if (data.length) {
        data.forEach(item => {
          if (item.resourceType === 'parkFloor') {
            parkDevices({ indexCode: item.indexCode, deviceType: '灯具' }).then(res => {
              item.children = res.data
            })
          } else if (item.children && item.children.length > 0) {
            this.changeDataStructure(item.children)
          }
        })
      }
    },
    pageChangeHandler(page) {
      console.log(page)
      this.Mix_searchConditions.page = page
      this.getTableData()
    },
    indexMethod(index) {
      return this.Mix_searchConditions.limit * (this.currentPage - 1) + index + 1
    },
    roleButtonCommand(command) {
      switch (command) {
        case '远程控制':
          this.showDialog.remoteControlVisible = true
          this.dialogType = '远程控制'
          break
        case '新增策略':
          this.showDialog.strategyVisible = true
          this.dialogType = '新增策略'
          break
        default:
          break
      }
    },
    // 改变行内数据
    changeRow(rowInfo, command) {
      this.rowInfo = rowInfo.row
      switch (command) {
        case '修改':
          this.showDialog.strategyVisible = true
          this.dialogType = '修改策略'
          break
        case '查看设备':
          this.showDialog.checkDeviceVisible = true
          this.dialogType = '查看设备'
          break
        case '停用':
          this.$confirm('确定停用该策略吗?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'el-message-box-oppositeBtns',
            type: 'warning'
          }).then(() => {
            lightTaskOper({
              ids: this.rowInfo.id,
              taskStatus: 1
            }).then(res => {
              this.$message.success('停用成功')
              this.getTableData()
            })
          })
          break
        case '启用':
          this.$confirm('确定启用该策略吗?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'el-message-box-oppositeBtns',
            type: 'warning'
          }).then(() => {
            lightTaskOper({
              ids: this.rowInfo.id,
              taskStatus: 0
            }).then(res => {
              this.$message.success('启用成功')
              this.getTableData()
            })
          })
          break
        case '删除':
          var num = this.tableData.length
          this.$confirm('删除后无法找回，确认删除此照明策略？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'el-message-box-oppositeBtns',
            type: 'warning'
          }).then(() => {
            lightTaskDelete([this.rowInfo.id]).then(res => {
              if (num === 1) {
                this.Mix_searchConditions.page > 1 ? this.Mix_searchConditions.page -= 1 : this.Mix_searchConditions.page
              }
              this.$message.success('删除成功')
              this.getTableData()
            })
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

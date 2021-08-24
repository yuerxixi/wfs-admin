<!--新增字典的主页面-->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <!--表格渲染-->
      <el-table ref="table" :data="tableData" style="width: 100%;" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
        <el-table-column :selectable="checkboxT" type="index" width="100" prop="id" label="序号" />
        <el-table-column :show-overflow-tooltip="true" prop="deviceType" label="设备类型" />
        <el-table-column :show-overflow-tooltip="true" prop="deviceModel" label="设备型号" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-for="btn in scopeBtn" :key="btn.index" type="text" size="small" @click.native.prevent="changeRow(scope,btn)">{{ btn }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page.sync="currentPage"
        :page-size="Mix_searchConditions.limit"
        background
        layout="total, prev, pager, next"
        @current-change="pageChangeHandler"
      />
      <add-dictionaries
        :visible.sync="showDialog.addDictionariesVisible"
        :title="dialogType"
        :row-info="rowInfo"
        @refreshForm="getTableData"
      />
    </el-card>
  </div>
</template>

<script>
import { getTableFetch } from '../../../api/device/deviceDictionary'
import AddDictionaries from './components/AddDictionaries'
export default {
  name: 'DeviceDictionary',
  components: { AddDictionaries },
  data() {
    return {
      /* 表格相关 */
      tableData: [],
      Mix_searchConditions: {
        currPage: 1,
        pageSize: 12
      },
      total: 0,
      currentPage: 1,
      /* 弹框相关 */
      dialogType: '',
      showDialog: {
        // 弹窗显示
        addDictionariesVisible: false // 新增字典
      },
      // 列表行内操作按钮
      scopeBtn: ['修改'],
      rowInfo: {}
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      getTableFetch(this.Mix_searchConditions).then((res) => {
        this.tableData = res.data.list
        this.total = res.data.totalCount
      })
    },
    pageChangeHandler(page) {
      console.log(page)
      this.Mix_searchConditions.page = page
      this.getTableData()
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    // changeRow(index, rows) {
    //   console.log(rows)
    //   this.showDialog.addDictionariesVisible = true
    //   this.dialogType = '修改字典'
    // },
    // 列表操作数据
    changeRow(rowInfo, command) {
      this.rowInfo = rowInfo.row
      console.log(rowInfo)
      switch (command) {
        case '修改':
          this.showDialog.addDictionariesVisible = true
          this.dialogType = '修改字典'
          break
        // case '删除':
        //   this.$confirm('确定删除吗?', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     customClass: 'el-message-box-oppositeBtns',
        //     type: 'warning'
        //   }).then(() => {})
        //   break
        default:
          break
      }
    },
    // openDialog() {
    //   this.showDialog.addDictionariesVisible = true
    //   this.dialogType = '新增字典'
    // },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>

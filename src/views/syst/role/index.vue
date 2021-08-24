<template>
  <div class="app-container">
    <div class="operate-btn">
      <el-button v-for="item in operateBtn" :key="item.index" type="primary" round @click="roleButtonCommand(item)">{{ item }}</el-button>
    </div>
    <el-card class="box-card">
      <el-col :span="4">
        <div style="height:800px;padding-right: 20px;border-right: solid #DDDDDD 1px;">
          <!-- 搜索 -->
          <el-input
            v-model="filterTreeText"
            clearable
            placeholder=""
            prefix-icon="el-icon-search"
            class="filter-item"
            size="mini"
            style="width: 100%;margin-bottom: 10px"
          />
          <div style="height:750px;overflow-y: scroll;">
            <el-tree
              ref="tree"
              class="filter-tree"
              :data="treeData"
              :props="defaultProps"
              node-key="roleId"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <div style="display: flex;justify-content: space-between">
                  <span style="font-size: 14px;color: #333333;width: 200px">{{ node.label }}</span>
                  <div @click.stop.prevent>
                    <el-dropdown v-if="data.leaf=== 1" style="position: absolute;right: 10px" trigger="click" @command="handleCommand($event,data)">
                      <span class="el-dropdown-link"><i class="el-icon-more" /></span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="detail">权限详情</el-dropdown-item>
                        <el-dropdown-item command="edit">修改角色</el-dropdown-item>
                        <el-dropdown-item command="delete">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <!--表格渲染-->
        <div style="padding-left: 20px;">
          <el-table ref="table" :data="tableData" style="width: 100%;" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
            <el-table-column type="index" width="100" :index="indexMethod" label="序号" />
            <el-table-column :show-overflow-tooltip="true" prop="nickname" label="用户姓名" />
            <el-table-column :show-overflow-tooltip="true" prop="username" label="登陆账号" />
            <el-table-column :show-overflow-tooltip="true" prop="roleNameList" label="所属角色" />
            <el-table-column :show-overflow-tooltip="true" prop="mobile" label="手机号码" />
            <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" />
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
        </div>
      </el-col>
      <new-role
        :visible.sync="showDialog.newRoleVisible"
        :title="dialogType"
        :selected-node="selectedNode"
        @refreshForm="getTreeData"
        @refreshTableForm="getTableData"
      />
      <new-user
        :visible.sync="showDialog.newUserVisible"
        :title="dialogType"
        :roles="roles"
        :row-info="rowInfo"
        @refreshForm="getTableData"
      />
    </el-card>
  </div>
</template>

<script>
import { getTableList, getTreeList, userDelete, roleDelete, initPassword, roleTreeInfo } from '../../../api/syst/syst'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import NewRole from './NewRole/NewRole'
import NewUser from './NewUser/NewUser'
export default {
  name: 'Role',
  components: { NewUser, NewRole },
  data() {
    return {
      /* 表格相关 */
      tableData: [],
      Mix_searchConditions: {
        page: 1,
        limit: 12
      },
      // 树数据
      treeData: [],
      roles: [],
      lazy: true,
      selectedNode: {},
      defaultProps: { children: 'children', label: 'roleName', isLeaf: 'leaf' },
      data: [
        { name: '全景展示', id: 35, children: [{ name: '综合概览', id: 41 }] },
        { name: '设备管理', id: 34, children: [{ name: '设备字典', id: 38 }, { name: '设备管理', id: 39 }] },
        { name: '照明管理', id: 33, children: [{ name: '照明策略', id: 40 }] },
        { name: '停车管理', id: 4, children: [{ name: '停车场管理', id: 6 }, { name: '停车区管理', id: 7 }] },
        { name: '视频监控', id: 44, children: [{ name: '视频监控', id: 45 }, { name: '录像回放', id: 46 }] },
        { name: '告警管理', id: 32, children: [{ name: '告警管理', id: 37 }] },
        { name: '信息发布', id: 31, children: [{ name: '信息发布', id: 36 }] },
        { name: '系统管理', id: 1, children: [{ name: '权限管理', id: 2 }] }
      ],
      filterTreeText: '',
      total: 0,
      currentPage: 1,
      pageSize: 0,
      // 弹框
      dialogType: '',
      menList: '',
      operateBtn: ['新增角色', '新增用户'],
      showDialog: {
        newRoleVisible: false, // 新增角色
        newUserVisible: false // 新增用户
      },
      // 列表行内操作按钮
      scopeBtn: ['修改', '删除', '密码初始化'],
      rowInfo: {}
    }
  },
  watch: {
    filterTreeText(value) {
      this.$refs.tree.filter(value)
    }
  },
  mounted() {
    this.getTableData()
    this.getTreeData()
    this.treeData = [{
      leaf: 0,
      createTime: null,
      createUserId: 1,
      menuIdList: null,
      remark: null,
      roleId: '',
      roleName: '所有角色',
      children: []
    }]
  },
  methods: {
    // 获取树数据
    getTreeData(node) {
      this.treeData = [{
        leaf: 0,
        createTime: null,
        createUserId: 1,
        menuIdList: null,
        remark: null,
        roleId: '',
        roleName: '所有角色',
        children: []
      }]
      getTreeList().then((res) => {
        res.page.list.forEach(item => {
          item.leaf = 1
        })
        this.roles = res.page.list
        res.page.list.forEach(item => {
          this.$refs.tree.append(item, this.treeData.children)
        })
        this.pageSize = res.page.pageSize
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.roleName.indexOf(value) !== -1
    },
    // 获取表格数据
    getTableData() {
      getTableList(this.Mix_searchConditions).then((res) => {
        this.tableData = res.page.list
        this.total = res.page.totalCount
        this.currentPage = res.page.currPage
      })
    },
    indexMethod(index) {
      return this.Mix_searchConditions.limit * (this.currentPage - 1) + index + 1
    },
    pageChangeHandler(page) {
      this.Mix_searchConditions.page = page
      this.getTableData()
    },
    // 树上操作按钮
    handleCommand(command, data) {
      this.selectedNode = data
      switch (command) {
        case 'edit':
          this.showDialog.newRoleVisible = true
          this.dialogType = '修改角色'
          break
        case 'detail':
          roleTreeInfo(data.roleId).then(res => {
            this.menList = []
            res.menuList.forEach(item => {
              this.menList += item.name + '  '
            })
            this.$alert(this.menList, '权限详情', {
              confirmButtonText: '关闭'
            })
          })
          break
        case 'delete':
          this.$confirm('删除角色后，此角色关联的用户将没有该权限，确认删除？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'el-message-box-oppositeBtns',
            type: 'warning'
          }).then(() => {
            roleDelete([data.roleId]).then(res => {
              this.$message.success('删除成功')
              this.getTreeData()
            })
          })
          break
        default:
          break
      }
    },
    // 列表操作数据
    changeRow(rowInfo, command) {
      this.rowInfo = rowInfo.row
      console.log(rowInfo)
      switch (command) {
        case '修改':
          this.showDialog.newUserVisible = true
          this.dialogType = '修改用户'
          break
        case '删除':
          var num = this.tableData.length
          this.$confirm('确定删除吗?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'el-message-box-oppositeBtns',
            type: 'warning'
          }).then(() => {
            userDelete([this.rowInfo.userId]).then(res => {
              if (num === 1) {
                this.Mix_searchConditions.page > 1 ? this.Mix_searchConditions.page -= 1 : this.Mix_searchConditions.page
              }
              this.$message.success('删除成功')
              this.getTableData()
            })
          })
          break
        case '密码初始化':
          this.$confirm('确定重置密码吗?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'el-message-box-oppositeBtns',
            type: 'warning'
          }).then(() => {
            initPassword(this.rowInfo.userId).then(res => {
              this.$message.success('重置成功')
            })
          })
          break
        default:
          break
      }
    },
    // 表头操作按钮
    roleButtonCommand(command) {
      switch (command) {
        case '新增角色':
          this.showDialog.newRoleVisible = true
          this.dialogType = '新增角色'
          break
        case '新增用户':
          this.showDialog.newUserVisible = true
          this.dialogType = '新增用户'
          break
        default:
          break
      }
    },
    nodeClick(data) {
      if (data.leaf === 0) {
        this.Mix_searchConditions = {
          page: 1,
          limit: 12
        }
        this.getTableData()
      } else if (data.leaf === 1) {
        this.Mix_searchConditions.roleId = data.roleId
        this.getTableData()
      }
    },
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
  ::v-deep .el-tree {
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    background: #ffffff;
  }
  ::v-deep .el-icon-more:before {
    content: "\E794";
    color: #c0c4cc;
    font-size: 14px;
  }
  ::v-deep .el-icon-more{
    cursor: pointer;
    margin-left: 3px;
    transform: rotate(90deg);
    /*width: 18px;*/
    /*height: 18px;*/
    /*border-radius: 4em;*/
    /*background-color: rgba(130, 132, 138, 0.2);*/
  }
</style>

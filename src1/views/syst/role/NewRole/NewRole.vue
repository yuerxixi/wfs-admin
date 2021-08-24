<template>
  <el-dialog
    id="NewRole"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="880px"
    center
    @open="showDialog"
    @close="handleClose"
  >
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" style="margin-top: 20px" label-width="50px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色名称：" prop="roleName" label-width="300px">
            <el-input
              v-model="formData.roleName"
              placeholder="请输入角色名称"
              :maxlength="15"
              clearable
              style="width: 350px;"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <div class="headline-role">
              <div> <b class="icon-blue" /> <b style="font-size: 18px;">角色权限</b></div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-tree
              ref="tree"
              :data="data"
              :props="defaultProps"
              node-key="id"
              :default-checked-keys="selectedItemPermissionsElement"
              show-checkbox
              accordion
              @check="(click, checked)=>{handleCheckChange(click, checked)}"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <div class="cutline" />
        </el-col>
        <el-col :span="16">
          <el-form-item label-width="0px">
            <div class="headline-user"> <b class="icon-blue" /><b style="font-size: 18px;">关联用户</b></div>
          </el-form-item>
          <el-table ref="table" max-height="320" highlight-current-row :data="NotRoleList" :header-cell-style="{background:'#DDDDDD',color:'#606266'}" @selection-change="selectionChange">
            <el-table-column type="selection" width="50" label="序号" />
            <el-table-column :show-overflow-tooltip="true" prop="nickname" label="用户姓名" />
            <el-table-column :show-overflow-tooltip="true" prop="username" label="登陆账号" />
            <el-table-column :show-overflow-tooltip="true" prop="roleNameList" label="所属角色" />
            <el-table-column :show-overflow-tooltip="true" prop="mobile" label="手机号码" />
          </el-table>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button :loading="loading" type="primary" round @click="handelConfirm">保存</el-button>
      <el-button v-if="title === '新增角色'" :loading="loading" round @click="handleAgain('formData')">继续添加</el-button>
      <el-button round @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTableList, roleTreeInfo, submitTargetForm } from '../../../../api/syst/syst'
export default {
  name: 'NewRole',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: undefined },
    selectedNode: { type: Object, default: () => {} }
  },
  data() {
    return {
      selectedItemPermissionsElement: [], // 默认勾选的节点的 key 的数组
      data: [
        { name: '全景展示', id: 35, children: [{ name: '综合概览', id: 41 }] },
        { name: '设备管理', id: 34, children: [{ name: '设备字典', id: 38 }, { name: '设备管理', id: 39 }] },
        { name: '照明管理', id: 33, children: [{ name: '照明策略', id: 40 }] },
        { name: '停车管理', id: 4, children: [{ name: '停车场管理', id: 6 }] },
        { name: '视频监控', id: 44, children: [{ name: '视频监控', id: 45 }, { name: '录像回放', id: 46 }] },
        { name: '告警管理', id: 32, children: [{ name: '告警管理', id: 37 }] },
        { name: '信息发布', id: 31, children: [{ name: '信息发布', id: 36 }] },
        { name: '系统管理', id: 1, children: [{ name: '权限管理', id: 2 }] }
      ],
      defaultProps: { children: 'children', label: 'name' },
      dialogVisible: false,
      checkAll: false,
      loading: false,
      NotRoleList: [],
      total: 0,
      currentPage: 1,
      pageSize: 0,
      Mix_searchConditions: {
        page: undefined,
        limit: undefined
      },
      formData: {
        roleName: '',
        menuIdList: [],
        userIdList: []
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }, { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    // 获取表格数据
    getTableData() {
      getTableList(this.Mix_searchConditions).then((res) => {
        this.NotRoleList = res.page.list
        this.total = res.page.totalCount
        this.currentPage = res.page.currPage
        if (this.title === '修改角色') {
          this.$nextTick(() => {
            this.NotRoleList.forEach(item => {
              item.roleIdList.forEach(i => {
                if (i === this.selectedNode.roleId) {
                  this.$refs.table.toggleRowSelection(item)
                }
              })
            })
          })
        }
      })
    },
    handleCheckChange(click, checked) {
      if (checked.halfCheckedKeys.length) {
        this.formData.menuIdList = [... checked.checkedKeys, ... checked.halfCheckedKeys]
      } else {
        this.formData.menuIdList = checked.checkedKeys
      }
    },
    // 获取未关联表格数据
    getInfoData() {
      roleTreeInfo(this.selectedNode.roleId).then(res => {
        console.log(res)
        this.formData.roleName = res.role.roleName
        this.formData.roleId = res.role.roleId
        this.formData.menuIdList = res.role.menuIdList
        const setCheckedKeys = []
        res.menuList.forEach(i => {
          setCheckedKeys.push(i.menuId)
        })
        this.$refs.tree.setCheckedKeys(setCheckedKeys)
      })
    },
    handleClose() {
      this.$refs.elForm.resetFields()
      this.formData = {
        roleName: '',
        userIdList: [],
        menuIdList: []
      }
      this.$refs.tree.setCheckedKeys([])
      this.dialogVisible = false
      this.loading = false
      this.$emit('update:visible', this.dialogVisible)
    },
    showDialog() {
      this.getTableData()
      if (this.title === '修改角色') {
        console.log(this.formData, 'daadwthis.formData.menuIdList')
        this.getInfoData()
      }
    },
    // 触发单选
    selectionChange(val) {
      this.formData.userIdList = []
      val.forEach(i => {
        this.formData.userIdList.push(i.userId)
      })
      // console.log(this.formData.userIdList, 'val')
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        console.log(this.formData)
        if (this.formData.menuIdList && !this.formData.menuIdList.length) {
          return this.$message({ message: '请选择角色权限', type: 'error' })
        } else {
          this.loading = true
          const url = this.title === '新增角色' ? '/oauth/sys/role/saveRoleAndBindUser' : '/oauth/sys/role/update'
          submitTargetForm(url, this.formData).then((res) => {
            if (this.title === '修改角色') {
              this.$message({ message: '修改成功', type: 'success' })
            } else {
              this.$message({ message: '新增成功', type: 'success' })
            }
            this.handleClose()
            this.loading = false
            this.$emit('refreshForm')
            this.$emit('refreshTableForm')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleAgain() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        if (!this.formData.menuIdList.length) {
          return this.$message({ message: '请选择角色权限', type: 'error' })
        } else {
          this.loading = true
          const url = '/oauth/sys/role/saveRoleAndBindUser'
          submitTargetForm(url, this.formData).then((res) => {
            this.$message({ message: '新增成功', type: 'success' })
            this.$refs.elForm.resetFields()
            this.formData = {
              roleName: '',
              userIdList: [],
              menuIdList: []
            }
            this.$refs.tree.setCheckedKeys([])
            this.getTableData()
            this.dialogVisible = true
            this.loading = false
            this.$emit('update:visible', this.dialogVisible)
            this.$emit('refreshForm')
            this.$emit('refreshTableForm')
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #NewRole{
    ::v-deep .el-form-item{
      margin-bottom: 0;
    }
    .contain-tree{
      height: 320px;
      background: #F2F2F2;
      padding-top:10px;
      ::v-deep .el-tree{
        background: #F2F2F2;
      }
    }
    .headline-role{
      display: flex;
      margin-top: 20px;
      div{
        display: flex;
        justify-content: start;
        align-items: center;
        margin-right: 70px;
      }
    }
    .icon-blue{
      display: inline-block;
      width: 4px;
      height: 16px;
      background: #4B60D7;
      margin-right: 5px
    }
    .cutline{
      width:30px;
      height: 370px;
      border-right: solid #DDDDDD 1px;
      margin-top: 20px;
    }
    .headline-user{
      display: flex;
      justify-content: start;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 5px;
    }
  }

</style>

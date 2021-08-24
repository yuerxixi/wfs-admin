<template>
  <el-dialog
    id="NewRole"
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    center
    width="580px"
    @open="showDialog"
    @close="handelClose"
  >
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="150px" style="width: 450px;margin-top: 20px">
      <el-form-item label="登陆账号" prop="username">
        <el-input
          v-model="formData.username"
          placeholder="请输入登陆账号"
          :disabled="title === '修改用户'"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="title === '新增用户'" label="登陆密码" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="请输入登陆密码"
          clearable
        />
      </el-form-item>
      <el-form-item label="用户姓名" prop="nickname">
        <el-input
          v-model="formData.nickname"
          placeholder="请输入用户姓名"
          clearable
          :disabled="title === '修改用户'"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="formData.mobile"
          placeholder="请输入手机号码"
          clearable
        />
      </el-form-item>
      <el-form-item label="所属角色" prop="roleIdList">
        <el-select v-model="formData.roleIdList" :disabled="title === '修改用户'" :multiple="true" placeholder="请选择" style="width: 300px;">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="loading" round @click="handelConfirm('formData')">保存</el-button>
      <el-button v-if="title === '新增用户'" :loading="loading" round @click="handleAgain('formData')">继续添加</el-button>
      <el-button round @click="handelClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { submitTargetForm, userInfo } from '../../../../api/syst/syst'
import { validatePhone, validatePassword, validateUsername } from '../../../../utils/validate'
export default {
  name: 'NewUser',
  props: {
    visible: { type: Boolean },
    title: { type: String },
    roles: { type: Array, default: () => [] },
    rowInfo: { type: Object, default: () => {} }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      formData: {
        username: '',
        password: '',
        nickname: '',
        mobile: '',
        roleIdList: []
      },
      option: [],
      rules: {
        username: [{ required: true, validator: validateUsername, trigger: 'blur' }, { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }, { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        mobile: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        roleIdList: [{ required: true, message: '请选择所属角色', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handelClose() {
      this.$refs.elForm.resetFields()
      this.formData = {
        username: '',
        password: '',
        nickname: '',
        mobile: '',
        roleIdList: []
      }
      this.dialogVisible = false
      this.loading = false
      this.$emit('update:visible', this.dialogVisible)
    },
    showDialog() {
      this.option = this.roles.map(item => {
        return { label: item.roleName, value: item.roleId }
      })
      if (this.title === '修改用户') {
        for (const i in this.formData) {
          this.formData[i] = this.rowInfo[i]
        }
        this.formData.userId = this.rowInfo.userId
        userInfo(this.rowInfo.userId).then(res => {
          this.formData.roleIdList = res.user.roleIdList
        })
      }
    },
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.loading = true
        const url = this.title === '新增用户' ? '/oauth/sys/user/save' : '/oauth/sys/user/update'
        submitTargetForm(url, this.formData).then((res) => {
          if (this.title === '修改用户') {
            this.$message({ message: '修改成功', type: 'success' })
          } else {
            this.$message({ message: '新增成功', type: 'success' })
          }
          this.handelClose()
          this.loading = false
          this.$emit('refreshForm')
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleAgain() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.loading = true
        const url = '/oauth/sys/user/save'
        submitTargetForm(url, this.formData).then((res) => {
          this.$message({ message: '新增成功', type: 'success' })
          this.$refs.elForm.resetFields()
          this.formData = {
            username: '',
            password: '',
            nickname: '',
            mobile: '',
            roleIdList: []
          }
          this.loading = false
          this.dialogVisible = true
          this.$emit('update:visible', this.dialogVisible)
          this.$emit('refreshForm')
        }).catch(() => {
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

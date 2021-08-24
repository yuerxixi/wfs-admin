<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    center
    @open="showDialog"
    @close="handleClose"
  >
    <el-form ref="elForm" :inline="true" :model="formData" :rules="rules" size="small" label-width="120px" style="margin-top: 30px;">
      <el-button type="text" style="position: absolute;top:70px;right: 20px" @click="addDevice">+新增型号</el-button>
      <el-form-item
        label="设备类型"
        prop="deviceType"
      >
        <el-select
          v-model="formData.deviceType"
          placeholder="请选择"
          style="width: 300px"
          disabled
        >
          <el-option
            v-for="item in searchOption.deviceType"
            :key="item.name"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <div v-for="(item,index) in formData.list" :key="index">
        <el-form-item :prop="item.deviceModel">
          <label slot="label">设备型号{{ index+1 }}</label>
          <el-input v-model="item.deviceModel" placeholder="请输入设备型号" style="width: 300px;margin-right: 10px" />
          <el-button v-if="formData.list.length > 1" type="text" @click="deleteDevice(item, index)">删除</el-button>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="loading" round @click="handelConfirm">保 存</el-button>
      <el-button round @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deviceTypeExistmodel, submitTargetForm, dictionaryDelete } from '../../../../api/device/public'
export default {
  name: 'AddDictionaries',
  props: {
    visible: { type: Boolean },
    title: { type: String },
    rowInfo: { type: Object, default: () => {} }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      formData: {
        deviceType: '',
        list: [{ deviceModel: '' }]
      },
      searchOption: {
        deviceType: [] // 设备类型下拉列表
      },
      rules: {
        deviceType: [{ required: true, message: '请选择设备类型', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    showDialog() {
      console.log(this.rowInfo)
      deviceTypeExistmodel({ deviceType: this.rowInfo.deviceType }).then(res => {
        this.formData = { ... res.data }
      })
    },
    // 新增型号
    addDevice() {
      this.formData.list.push({ deviceModel: '' })
    },
    // 删除型号
    deleteDevice(data, index) {
      console.log(data)
      if (data.id) {
        dictionaryDelete({
          id: data.id
        }).then(res => {
          if (res.code === 200) {
            this.formData.list.splice(index, 1)
          }
        })
      } else {
        this.formData.list.splice(index, 1)
      }
    },
    // 提交表单
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        this.loading = true
        for (let i = 0; i < this.formData.list.length; i++) {
          console.log(this.formData.list[i].deviceModel === '')
          if (this.formData.list[i].deviceModel === '') {
            return this.$message({ message: '设备型号不能为空', type: 'error' })
          }
        }
        const url = '/api/dictionary/add'
        submitTargetForm(url, this.formData).then((res) => {
          this.$message({ message: '修改成功', type: 'success' })
          this.loading = false
          this.handleClose()
          this.$emit('refreshForm')
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 关闭弹框
    handleClose() {
      this.$refs.elForm.resetFields()
      this.formData = {
        deviceType: '',
        list: [{ deviceModel: '' }]
      }
      this.dialogVisible = false
      this.loading = false
      this.$emit('update:visible', this.dialogVisible)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-tempalte{
  position: relative;
  padding: 10px 10px 10px 0;
  width: 330px;
  border-radius: 4px;
  background: #F8F8F8;

  ::v-deep .el-form-item {
    margin-bottom: 4px;
  }
  ::v-deep .el-dialog__body {
    padding: 25px 25px 0px;
  }
}
.remove-button{
  position: absolute;
  bottom: 103px;
  right: -52px;
}
</style>

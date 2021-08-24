<template>
  <el-dialog
    id="NewRole"
    :title="title"
    :visible.sync="dialogVisible"
    center
    width="550px"
    :before-close="handleClose"
  >
    <el-form
      ref="elForm"
      size="medium"
      label-width="120px"
      style="width: 470px;margin-top: 20px"
    >
      <el-form-item label="设备ID" prop="">
        {{ rowInfo.deviceId }}
      </el-form-item>
      <el-form-item label="设备名称" prop="">
        {{ rowInfo.deviceName }}
      </el-form-item>
      <el-form-item label="照明策略" prop="">
        {{ rowInfo.on === 1 ? '开灯' : '关灯' }} {{ '（亮度 ' + rowInfo.light + '%）' }}
      </el-form-item>
      <el-form-item label="亮度调节" prop="field108">
        <el-radio-group v-model="light">
          <el-radio
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="on===0?true:false"
          >{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开关控制" prop="field108">
        <el-radio-group v-model="on" style="">
          <el-radio
            v-for="(item, index) in option"
            :key="index"
            :label="item.label"
            :value="item.value"
          >{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="primary" round :loading="loading" @click="handelConfirm">保存</el-button>
      <el-button round @click="close">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { deviceDimmingCommand } from '@/api/device/deviceManage'
export default {
  name: 'RemoteControlCell',
  props: {
    visible: [Boolean],
    title: [String],
    rowInfo: [Object],
    deviceId: [String]
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      checkAll: false,
      // cities: cityOptions,
      isIndeterminate: true,
      light: '',
      on: '',
      option: [{ value: '开灯', label: 1 }, { value: '关灯', label: 0 }],
      options: [
        { value: '20%', label: 20 },
        { value: '40%', label: 40 },
        { value: '60%', label: 60 },
        { value: '80%', label: 80 },
        { value: '100%', label: 100 }
      ],
      lamppostId: ''
    }
  },
  watch: {
    visible(val) {
      console.log(this.rowInfo)
      this.dialogVisible = val
    },
    on(newVal) {
      if (newVal === 0 || newVal === '') {
        this.light = ''
      } else {
        this.light = this.light === '' ? 20 : this.light
      }
    }
  },
  methods: {
    handelConfirm() {
      if (this.on === '') {
        this.$message({ message: '请先选择开关', type: 'error' })
      } else {
        const params = {
          lamppostId: '',
          deviceId: this.deviceId,
          on: this.on,
          light: this.light === 0 ? 0 : this.light,
          deviceType: this.rowInfo.deviceType
        }
        this.loading = true
        deviceDimmingCommand(params).then(res => {
          this.$message({ message: '保存成功', type: 'success' })
          this.close()
          this.$emit('refreshForm')
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleClose(done) {
      this.light = ''
      this.on = ''
      this.dialogVisible = false
      this.$emit('update:visible', this.showDialog)
    },
    close() {
      this.light = ''
      this.on = ''
      this.loading = false
      this.$emit('update:visible', false)
    }
    // handelConfirm() {
    //   this.$refs["elForm"].validate(valid => {
    //     if (!valid) return;
    //     this.close();
    //   });
    // }
  }
}
</script>

<style lang="scss" scoped></style>

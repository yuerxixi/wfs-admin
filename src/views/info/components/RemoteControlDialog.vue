<template>
  <el-dialog
    title="远程控制"
    :visible.sync="remoteControlVisible"
    width="550px"
    center
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="showDialog"
    @close="handleClose"
  >
    <el-form
      ref="elForm"
      :model="formData"
      size="medium"
      label-width="120px"
      style="width: 470px;margin-top: 20px"
    >
      <el-form-item label="开关控制" prop="switch">
        <el-radio-group v-model="formData.switch" style="">
          <el-radio
            v-for="(item, index) in option"
            :key="index"
            :label="item.label"
            :value="item.value"
            @change="changeSwitch"
          >{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间" prop="switch">
        <el-date-picker
          v-model="formData.startDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          :disabled="formData.switch === '0'"
          :clearable="false"
          placeholder="请选择开始时间"
        />
      </el-form-item>
      <el-form-item label="亮度调节" prop="light">
        <el-radio-group v-model="formData.light">
          <el-radio
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="formData.switch === '0'"
          >{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="primary" round :loading="loading" @click="handleSave">保存</el-button>
      <el-button round @click="handleClose">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { setControlScreen } from '../../../api/info/infoPublish'
export default {
  name: 'RemoteControlDialog',
  props: {
    dialogData: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      remoteControlVisible: false,
      option: [{ value: '开屏', label: '1' }, { value: '关屏', label: '0' }],
      options: [
        { value: '20%', label: '2' },
        { value: '40%', label: '4' },
        { value: '60%', label: '6' },
        { value: '80%', label: '8' },
        { value: '100%', label: '10' }
      ],
      formData: {
        light: '',
        switch: '',
        startDate: ''
      },
      loading: false,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  watch: {
    visible(val) {
      this.remoteControlVisible = val
    }
  },
  methods: {
    showDialog() {
      this.formData.light = this.dialogData.screenBright ? this.dialogData.screenBright : ''
      this.formData.switch = this.dialogData.screenSwitch ? this.dialogData.screenSwitch : ''
      this.formData.startDate = this.dialogData.screenOpenTime ? this.dialogData.screenOpenTime : ''
    },
    changeSwitch(value) {
      if (value === '0') {
        this.formData.light = ''
        this.formData.startDate = ''
      } else {
        this.formData.light = this.formData.light === '' ? '2' : this.formData.light
      }
    },
    handleSave() {
      if (this.formData.switch === '') {
        this.$message({ message: '请选择开关', type: 'error' })
        return
      } else if (this.formData.switch === '1' && this.formData.startDate === '') {
        this.$message({ message: '请选择开始时间', type: 'error' })
        return
      } else if (this.formData.switch === '1' && this.formData.light === '') {
        this.$message({ message: '请选择亮度', type: 'error' })
        return
      }
      this.loading = true
      setControlScreen({
        messageId: this.dialogData.messageId,
        deviceId: this.dialogData.deviceId,
        screenSwitch: this.formData.switch,
        screenBright: this.formData.light,
        screenOpenTime: this.formData.startDate
      }).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.loading = false
        this.remoteControlVisible = false
        this.$emit('refresh')
      }).catch(() => {
        this.loading = false
      })
    },
    handleClose() {
      this.remoteControlVisible = false
      this.$emit('update:visible', this.remoteControlVisible)
    }
  }
}
</script>

<style scoped>

</style>

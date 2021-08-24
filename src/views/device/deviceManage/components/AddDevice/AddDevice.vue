<!--新增设备-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    center
    width="570px"
    @open="showDialog"
    @close="handleClose"
  >
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="130px"
      style="margin-top: 30px"
    >
      <el-row>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select
            v-model="formData.deviceType"
            style="width: 300px"
            placeholder="请选择"
            :disabled="title === '修改设备'"
            @change="typeChange($event, 'deviceType')"
          >
            <el-option
              v-for="item in searchOption.deviceType"
              :key="item.name"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-select
            v-model="formData.deviceModel"
            style="width: 300px"
            placeholder="请选择"
            :disabled="title === '修改设备'"
            @change="typeChange($event, 'deviceModel')"
          >
            <el-option
              v-for="item in searchOption.deviceModel"
              :key="item.name"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.deviceType === '灯杆'"
          label="关联区域"
          prop="areaId"
        >
          <el-select
            v-model="formData.areaId"
            style="width: 300px;"
            placeholder="请选择"
            :disabled="title === '修改设备'"
          >
            <el-option
              v-for="item in searchOption.deviceArea"
              :key="item.name"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.deviceType === '显示屏' || (formData.deviceType === '灯具' && title === '修改设备') || (formData.deviceType === '灯箱' && title === '修改设备')"
          label="终端ID"
          prop="terminalId"
        >
          <el-input
            v-model="formData.terminalId"
            placeholder="请输入终端ID"
            style="width: 300px"
            clearable
            :disabled="title === '修改设备'"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.deviceType === '灯杆' || formData.deviceType === '摄像头'"
          label="设备ID"
          prop="deviceId"
        >
          <el-input
            v-model="formData.deviceId"
            placeholder="请输入设备ID"
            style="width: 300px"
            clearable
            :disabled="title === '修改设备'"
          />
        </el-form-item>
        <el-form-item
          v-if="(formData.deviceType === '灯具' && title !== '修改设备') || (formData.deviceType === '灯箱' && title !== '修改设备') "
          label="imei"
          prop="imei"
        >
          <el-input
            v-model="formData.imei"
            placeholder="请输入imei"
            style="width: 300px"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="(formData.deviceType === '灯具' && title !== '修改设备') || (formData.deviceType === '灯箱' && title !== '修改设备')"
          label="uid"
          prop="uid"
        >
          <el-input
            v-model="formData.uid"
            placeholder="请输入uid"
            style="width: 300px"
            clearable
          />
        </el-form-item>
        <el-form-item label="设备名称：" prop="deviceName">
          <el-input
            v-model="formData.deviceName"
            clearable
            placeholder="请输入"
            style="width: 300px;"
          />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            style="width: 300px"
            clearable
          />
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="loading" round @click="handelConfirm">保存</el-button>
      <el-button
        v-if="title === '新增设备'"
        round
        :loading="loading"
        @click="handleAgain"
      >继续添加</el-button>
      <el-button round @click="cancleBtn">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  deviceArea,
  deviceTypeExistmodel,
  deviceTypeList,
  submitTargetForm,
  // deviceGenerateid,
  deviceFindbyid,
  dictionaryModels
} from '../../../../../api/device/public'
export default {
  name: 'AddDevice',
  components: {},
  props: {
    visible: { type: Boolean },
    title: { type: String },
    rowInfo: { type: Object, default: () => {} }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false,
      searchOption: {
        deviceType: [], // 设备类型
        deviceModel: [], // 设备型号
        deviceArea: [] // 关联区域
      },
      formData: {
        deviceType: '',
        imei: '',
        uid: '',
        deviceModel: '',
        deviceId: '',
        deviceName: '',
        areaId: '',
        terminalId: '',
        remark: ''
      },
      rules: {
        deviceType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        deviceModel: [
          { required: true, message: '请选择设备型号', trigger: 'blur' }
        ],
        terminalId: [
          { required: true, message: '请输入终端ID', trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '请输入uid', trigger: 'blur' }
        ],
        imei: [
          { required: true, message: '请输入imei', trigger: 'blur' }
        ],
        deviceId: [
          { required: true, message: '请输入设备ID', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择关联区域', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  created() {},
  mounted() {},
  methods: {
    showDialog() {
      deviceTypeList().then(res => {
        this.searchOption.deviceType = res.data.deviceType.map(
          (item, index) => ({
            value: index,
            label: item
          })
        )
      })
      deviceArea().then(res => {
        this.searchOption.deviceArea = res.list.map((item, index) => ({
          value: item.floorSyscode,
          label: `扬州广陵服务区/${item.parkName}/${item.floorName}`
        }))
      })
      if (this.title === '修改设备') {
        dictionaryModels().then(res => {
          this.searchOption.deviceModel = res.data.map((item, index) => ({
            value: item.id,
            label: item.deviceModel
          }))
        })
        deviceFindbyid({
          deviceId: this.rowInfo.deviceId
        }).then(res => {
          for (const i in this.formData) {
            this.formData[i] = res.data[i]
          }
        })
      }
    },
    typeChange(e, value) {
      switch (value) {
        // 设备类型发生改变以后请求选择的设备类型对应的设备型号
        case 'deviceType':
          deviceTypeExistmodel({ deviceType: e }).then(res => {
            this.formData.deviceModel = ''
            this.formData.deviceId = ''
            this.searchOption.deviceModel = res.data.list.map(
              (item, index) => ({
                value: item.id,
                label: item.deviceModel
              })
            )
          })
          break
        // 设备类型和设备型号发生改变，生成出对应的设备ID
        // case 'deviceModel':
        //   this.$forceUpdate()
        //   deviceGenerateid({
        //     deviceModel: e
        //   }).then(res => {
        //     // this.$set(this.formData,deviceId,res.data.deviceId)
        //     this.formData.deviceId = res.data.deviceId
        //   })
        //   break
        default:
          break
      }
    },
    // 提交表单
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        const url = '/api/device/save '
        if (this.formData.deviceType === '灯杆') {
          this.searchOption.deviceArea.forEach(item => {
            if (item.value === this.formData.areaId) {
              this.formData.relationArea = item.label
            }
          })
        }
        this.loading = true
        submitTargetForm(url, this.formData).then(res => {
          if (this.title === '新增设备') {
            this.$message({ message: '新增成功', type: 'success' })
          } else {
            this.$message({ message: '修改成功', type: 'success' })
          }
          this.$emit('changeTreeName')
          this.$emit('refreshTree')
          this.handleClose()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleAgain() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        const url = '/api/device/save '
        if (this.formData.deviceType === '灯杆') {
          this.searchOption.deviceArea.forEach(item => {
            if (item.value === this.formData.areaId) {
              this.formData.relationArea = item.label
            }
          })
        }
        this.loading = true
        submitTargetForm(url, this.formData).then(res => {
          this.dialogVisible = true
          this.$refs.elForm.resetFields()
          this.formData = {
            deviceType: '',
            imei: '',
            uid: '',
            deviceModel: '',
            deviceId: '',
            deviceName: '',
            areaId: '',
            terminalId: '',
            remark: ''
          }
          this.loading = false
          this.$emit('refreshForm')
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 关闭弹框
    handleClose() {
      this.$emit('refreshForm')
      this.$refs.elForm.resetFields()
      this.formData = {
        deviceType: '',
        imei: '',
        uid: '',
        deviceModel: '',
        deviceId: '',
        deviceName: '',
        areaId: '',
        terminalId: '',
        remark: ''
      }
      this.dialogVisible = false
      this.loading = false
      this.$emit('update:visible', this.dialogVisible)
    },
    // 取消
    cancleBtn() {
      if (
        this.formData.deviceType !== '' ||
        this.formData.deviceModel !== '' ||
        this.formData.deviceName !== '' ||
        this.formData.remark !== ''
      ) {
        this.$emit('refreshForm')
        this.$refs.elForm.resetFields()
        this.formData = {
          deviceType: '',
          imei: '',
          uid: '',
          deviceModel: '',
          deviceId: '',
          deviceName: '',
          areaId: '',
          terminalId: '',
          remark: ''
        }
        this.dialogVisible = false
        this.$emit('update:visible', this.dialogVisible)
      } else {
        this.handleClose()
      }
    }
  }
}
</script>

<style scoped></style>

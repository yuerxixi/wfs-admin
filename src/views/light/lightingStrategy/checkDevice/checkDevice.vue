<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="1200px"
    height="530px"
    center
    @open="showDialog"
    @close="close"
  >
    <div style="height:550px">
      <el-table ref="table" style="width: 100%;" :data="tableData" max-height="530" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
        <el-table-column type="index" width="55" label="序号" />
        <el-table-column prop="deviceType" width="120" label="设备类型" />
        <el-table-column prop="deviceModel" label="设备型号" />
        <el-table-column prop="deviceId" label="设备ID" />
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="relationArea" label="关联区域" />
        <el-table-column prop="lamName" label="关联灯杆" />
      </el-table>
  </div>

  </el-dialog>
</template>

<script>
import { deviceDetails } from '../../../../api/light/light'

export default {
  name: 'CheckDevice',
  props: {
    visible: [Boolean],
    title: { type: String, default: 'default' },
    rowInfo: { type: Object, default: () => {} }
  },
  data() {
    return {
      dialogVisible: false,
      /* 表格相关 */
      tableData: [],
      deviceIds: []
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      console.log(this.rowInfo)
      this.deviceIds = this.rowInfo.deviceIds.map(item => ({
        deviceId: item
      }))
    }
  },
  methods: {
    getTableData() {
      deviceDetails({ list: this.deviceIds }).then((res) => {
        this.tableData = res.data
      })
    },
    showDialog() {
      this.getTableData()
    },
    close() {
      this.dialogVisible = false
      this.tableData = []
      this.$emit('update:visible', this.dialogVisible)
    }
  }
}
</script>

<style scoped>

</style>

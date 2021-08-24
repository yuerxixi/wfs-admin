<!--数据导入弹窗组件-->
<template>
  <el-dialog
    v-if="showDialog"
    class="import-files"
    :title="Mix_importConditions.title"
    center
    width="600px"
    :visible.sync="showDialog"
    :before-close="closeDialog"
  >
    <batch-import
      :data-items="dataItems"
      :data-info="dataInfo"
      :mix-search-conditions="Mix_searchConditions"
      :upload-url="Mix_importConditions.uploadUrl"
      @closeDialog="closeDialog"
      @refresh-upload-success="refreshUploadSuccess"
    >
      <!--下载数据模板-->
      <template slot="downloadModel">
        <span class="cursor-pointer" style="color: #404AD1; margin-left: 9px;cursor: pointer" @click="handleCommand('base')">下载导入模板</span>
      </template>
    </batch-import>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="dataItems.active === 1" type="primary" round @click="submitUpload">开始导入</el-button>
      <el-button v-if="dataItems.active !==2" round @click="closeDialog">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { commonDownloadTemp } from './service/download'
import BatchImport from './batch-import'
import { downloadFile } from '../../utils/common'

export default {
  components: { BatchImport },
  props: {
    visible: Boolean,
    Mix_searchConditions: {
      type: Object
    },
    Mix_importConditions: {
      type: Object
    }
  },
  data() {
    return {
      dataItems: {
        active: 1, // 当前步骤
        fileType: '', // 上传文件类型
        startImport: false, // 是否开始上传
        operateMethod: false // 是否有数据重复时的操作方式选项
      },
      dataInfo: {
        // updateFlag: 1
      },
      showDialog: false // 是否展示弹框
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.showDialog = val
        this.dataItems.active = 1
      }
    }
  },
  methods: {
    // 下载模板
    handleCommand(command) {
      commonDownloadTemp(this.Mix_importConditions.url).then((response) => {
        downloadFile(response, this.Mix_importConditions.templateName)
      })
    },
    // 关闭弹框
    closeDialog() {
      this.dataItems.fileType = ''
      this.dataItems.active = 1
      this.dataItems.startImport = false
      this.showDialog = false
      this.$emit('update:visible', this.showDialog)
    },
    // 提交
    submitUpload() {
      console.log(this.dataItems)
      if (this.dataItems.fileType !== '' || this.dataItems.fileType === 'xls' || this.dataItems.fileType === 'xlsx') {
        if (this.dataItems.active++ > 2) this.dataItems.active = 1
        this.dataItems.startImport = true
      } else {
        this.$message({ showClose: true, message: '请选择文件', type: 'error' })
      }
    },
    refreshUploadSuccess(data) {
      this.$emit('refresh-upload', data)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .not-covered {
    color: #f00;
  }
</style>

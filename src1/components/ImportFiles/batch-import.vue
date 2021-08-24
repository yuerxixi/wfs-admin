<!--数据导入弹窗组件-->
<template>
  <div class="tree-import">
    <el-steps id="step" :space="200" :active="dataItems.active" v-show="dataItems.active !== 3">
      <el-step title="上传文件"></el-step>
      <el-step title="导入数据"></el-step>
      <el-step title="导入结果"></el-step>
    </el-steps>
    <!--第一步 数据模板-->
    <div class="first-step" v-if="dataItems.active === 1">
      <p>1.请按照导入模板的格式导入数据，点击<slot name="downloadModel"></slot></p>
      <p>{{ dataItems.operateMethod ? 3 : 2 }}.选择模板文件并开始导入</p>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="fileUploadApi"
        :on-change="checkFileType"
        accept=".xls,.xlsx"
        :file-list="fileList"
        :headers="uploadHeader"
        :data="dataInfo"
        :on-success="handleComplete"
        :on-remove="handleRemove"
        :before-upload="beforrUpload"
        :with-credentials="true"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传xls、xlsx文件！</div>
      </el-upload>
    </div>
    <!--第二步 progress-->
    <div class="second-step" v-else-if="dataItems.active === 2">
      <p>数据导入中，请稍后</p>
    </div>
    <!--第三步 result-->
    <div class="third-step" v-else-if="dataItems.active === 3">
      <div v-if="resultCode === '200'">
        <ns-icon-svg class="success" icon-class="check-circle"></ns-icon-svg>
        <p class="font16">导入成功</p>
      </div>
      <div v-else>
        <ns-icon-svg class="failed" icon-class="CombinedShapeCopy"></ns-icon-svg>
        <p class="font16">设备类型字段错误，请检查修改后重新上传</p>
        <!--        <div  v-for="(item,index) in errorMessage" :key="">-->
        <!--          <P>{{ item }}</P>-->
        <!--        </div>-->
      </div>

    </div>
  </div>
</template>

<script>
import { arrContainObj } from '../utils/index'
import CommonMinxin from '../mixins/index'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  mixins: [CommonMinxin],
  props: {
    // import属性
    dataItems: {
      type: Object,
      default() {
        return {
          active: 1, // 当前的step
          startImport: false, // 是否开始导入
          operateMethod: true // 是否有数据重复时的操作方式选项
        }
      }
    },
    // 导入时传递的参数
    dataInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    // 上传url
    uploadUrl: {
      type: String,
      default: ''
    },
    funcId: {
      type: String,
      default: ''
    },
    Mix_searchConditions: {
      type: Object
    }
  },

  computed: {
    ...mapGetters([
      'fileUploadApi'
    ]),
    // 是否开始导入
    startImport() {
      return this.dataItems.startImport
    },
    // 上传url
    uploadFileUrl() {
      return this.uploadUrl
    },
    uploadHeader() {
      return Object.assign({}, {
        token: getToken()
      })
    },
    // 弹窗状态
    dialogVisible() {
      return this.dataItems.dialogVisible.visible
    },
  },
  data() {
    return {
      errorMessage: [],
      resultCode: '',
      fileList: [], // 上传的文件列表
      allowFileType: ['xls', 'xlsx'] // 允许上传的文件格式类型
    }
  },
  created() {
  },
  methods: {
    // ================== 文件上传相关操作 ====================
    // 文件类型判断
    checkFileType(file, fileList) {
      // this.fileList = fileList
      // 文件扩展名
      const extension = file.name.split('.')
      this.dataItems.fileType = extension[extension.length - 1]
      if (fileList.length > 1) {
        fileList = fileList.splice(0, 1)
      }
      // 符合类型，验证通过
      if (arrContainObj(this.allowFileType, this.dataItems.fileType)) {
        this.formData = { ...fileList[0] }
        console.log(file)
        console.log(fileList)
        return true
      } else {
        this.$message({
          showClose: true,
          message: '请选择正确的文件格式',
          type: 'error'
        })
        fileList = fileList.splice(fileList.length - 1, 1) // 删除最后一个添加的文件对象（错误文件）
      }
    },
    // 上传完成
    handleComplete(res, file, fileList) {
      if (res && res.code === 200) {
        this.resultCode = res.code
        this.$message({ message: '导入成功', type: 'success' })
        this.$emit('refresh-upload-success', res.resultData)
        this.$emit('closeDialog')
      } else {
        setTimeout(this.changeTab, 2000)
        // this.errorMessage = res.resultMsg.split('∝')
      }
    },
    beforrUpload(file) {
      console.log(file, 'sss')
    },
    changeTab() {
      this.dataItems.active = 3
    },
    // 移除文件
    handleRemove(file, fileList) {
      this.dataItems.fileType = ''
    },
    // 关闭
    cancel() {
      this.$emit('closeDialog')
    }
  },
  watch: {
    // 开始导入
    startImport(val) {
      if (val) {
        this.$refs.upload.submit()
        this.handleComplete()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .tree-import {
    height: 500px;
    #step {
      margin-left: 10%;
    }

    .first-step {
      margin-left: 10%;
      margin-top: 5%;
      .el-radio {
        margin-left: 5%;
      }
      .upload-demo {
        margin-left: 5%;
      }
      .el-dropdown-link {
        color: #409eff;
      }
      .precautions {
        width: calc(100% - 70px);
      }
      .margin-left12 {
        margin-left: 12px;
        font-size: 13px;
      }
      .precautions-div {
        margin-left: 12px;
        margin-bottom: 10px;
        p {
          line-height: 24px;
        }
      }
    }

    .second-step {
      text-align: center;
      p {
        margin-top: 10px;
      }
      margin-top: 5%;
      span {
        color: #d6d6d6;
      }
    }

    .third-step {
      text-align: center;
      margin-top: 5%;
      .success {
        font-size: 50px;
        color: #16ca38;
      }
      .failed {
        font-size: 50px;
        color: #ff0000 !important;
      }
      .font16 {
        font-weight: bold;
        font-size: 16px;
        margin: 10px 0;
      }
      .close-btn {
        margin-top: 20px;
      }
    }
    .el-step__icon {
      border-radius: 50%;
      border: 1px solid #d4d4d4;
      background: #d4d4d4;
      color: #ffffff;
    }
    .el-step__head.is-finish .el-step__icon {
      background: #0a7af8;
      border: 1px solid #0a7af8;
    }

    //==============================================
    .el-steps {
      background: white;
    }
    .is-horizontal .el-step {
      position: relative;
    }
    .is-horizontal .el-step__title {
      display: inline-block;
      height: 26px;
      line-height: 26px;
    }
    .el-step__title {
      font-weight: normal;
    }
    .is-horizontal .el-step__main {
      display: inline-block;
      position: absolute;
      top: 0px;
      padding-left: 18px;
      left: 20px;
      background: white;
    }
    .el-step__line.is-vertical {
      top: 35px;
      bottom: 7px;
    }
    .el-step__title.is-wait {
      color: #666666;
    }
    .el-step__title.is-process {
      color: #666666;
      font-weight: 400;
    }
    .treeProgress span {
      position: absolute;
      right: -25px;
    }
    .el-step__icon {
      line-height: 30px;
    }
    .el-step__title {
      width: 64px;
    }
  }
</style>

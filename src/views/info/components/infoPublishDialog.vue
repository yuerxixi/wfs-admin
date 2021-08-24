<template>
  <el-dialog
    title="信息发布"
    :visible.sync="dialogVisible"
    width="920px"
    center
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="showDialog"
    @close="handleClose"
  >
    <div class="dialog-left-wrap">
      <div class="dialog-left-top-wrap">
        <div class="title-wrap">
          <span class="title">信息发布</span>
        </div>
        <el-form ref="form" inline :model="formData" :rules="rules" size="small" label-width="100px">
          <el-form-item label="标题" prop="messageTitle">
            <el-input v-model="formData.messageTitle" clearable style="width: 374px;" size="medium" maxlength="20" />
          </el-form-item>
          <el-form-item label="内容描述">
            <el-input v-model="formData.messageDescribe" clearable style="width: 374px;" size="medium" maxlength="25" />
          </el-form-item>
          <el-form-item label="投放时间" prop="timeType" style="width: 100%;margin-bottom: 0;">
            <el-radio v-model="formData.timeType" :label="1" @change="resetTime">按日期</el-radio>
            <el-radio v-model="formData.timeType" :label="2" @change="resetTime">按星期</el-radio>
          </el-form-item>
          <div v-if="formData.timeType===1">
            <el-form-item prop="startDate" style="margin-left: 100px;">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                placeholder="开始日期"
                style="width:185px;"
                @change="dateChange($event,0)"
              />
            </el-form-item>
            <el-form-item prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd"
                placeholder="结束日期"
                style="width:185px;"
                @change="dateChange($event,1)"
              />
            </el-form-item>
          </div>
          <div v-else-if="formData.timeType===2">
            <el-form-item prop="messageTime" style="margin-left: 100px;">
              <el-checkbox-group v-model="formData.messageTime" style="width:374px;">
                <el-checkbox v-for="(item, index) in weekOption" :key="index" :label="item.label" :value="item.label" style="margin-right:6px;" />
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if="formData.timeType===1">
            <el-form-item label="投放时段" prop="startTime">
              <el-time-picker
                v-model="formData.startTime"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="开始时间"
                style="width:185px;"
                @change="timeChange($event,0)"
                @focus="timeInit"
              />
            </el-form-item>
            <el-form-item prop="endTime">
              <el-time-picker
                v-model="formData.endTime"
                value-format="HH:mm"
                format="HH:mm"
                placeholder="结束时间"
                style="width:185px;"
                @change="timeChange($event,1)"
              />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="dialog-left-bottom-wrap">
        <div class="title-wrap">
          <span class="title">投放策略</span>
          <el-button size="medium" style="margin-right: 30px;" icon="el-icon-plus" type="text" @click="addMessageContentList">新增策略</el-button>
        </div>
        <el-form v-for="(item, index) in formData.tMessageContentList" ref="form2" :key="index" inline :model="item" :rules="rules" size="small" label-width="100px" style="background: #F8F8F8;padding: 0px 0 0 0;width: 494px;margin-top: 8px;">
          <div style="text-align: right;padding: 4px 4px 0 0;"><i class="el-icon-close" style="cursor: pointer;" @click="delMessageContentList(index)" /></div>
          <el-form-item label="信息类型" prop="messageType">
            <el-select v-model="item.messageType" placeholder="请选择" style="width: 120px;" size="medium" @change="selectUploadType($event, index)">
              <el-option v-for="launchType in launchTypeOptions" :key="launchType.value" :label="launchType.label" :value="launchType.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="投放时长(分钟)" label-width="120px" prop="fileTime">
            <el-input v-model="item.fileTime" clearable style="width: 120px;" size="medium" maxlength="5" onkeyup="value=value.replace(/[^\d]/g,'')" />
          </el-form-item>
          <el-form-item v-if="item.messageType === 1" label="设备类型">
            <el-radio v-model="item.ledType" :label="1">诱导屏</el-radio>
            <el-radio v-model="item.ledType" :label="2">全彩屏</el-radio>
          </el-form-item>
          <el-form-item v-if="item.messageType === 1" label="投放内容" prop="messageContent">
            <div style="display: inline-block;width: 100px;">
              <el-button type="primary" class="message-button" style="width: 80px;" @click="showEditorDialog(item)">设置内容</el-button>
            </div>
            <!--            <el-input v-model="item.messageContent" type="textarea" maxlength="100" rows="2" style="width: 374px;" />-->
          </el-form-item>
          <el-form-item v-if="item.messageType !== 1" label="投放内容" prop="messageContent">
            <el-upload
              :action="action"
              :headers="headers"
              :multiple="false"
              :limit="1"
              :before-upload="(file)=>beforeUpload(file, index)"
              :on-success="(response, file, fileList)=>onSuccess(response, file, fileList, index)"
              :on-error="(err, file, fileList)=>onError(err, file, fileList, index)"
              :on-remove="(file, fileList)=>onRemove(file, fileList, index)"
              :file-list="item.fileList"
              :on-exceed="(files, fileList)=>onExceed(files, fileList, index)"
              show-file-list
              :accept="item.accept"
              :data="item.option"
              list-type="picture"
              class="upload-demo"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">{{ item.uploadTip }}</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="dialog-right-wrap">
      <div class="title-wrap" style="display: flex;justify-content: space-between;align-items: center">
        <div>
          <span class="title">投放设备</span>
        </div>
      </div>
      <div class="launch-device-wrap">
        <div class="device-tree">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="treeData"
            :props="defaultTreeProps"
            :default-expand-all="true"
            show-checkbox
            :expand-on-click-node="true"
            node-key="deviceId"
            :default-expanded-keys="[]"
            :default-checked-keys="defaultCheckKeys"
            @check="clickTreeNode"
          />
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="dialogLoading" type="primary" round @click="handleSave('add')">保存</el-button>
      <el-button v-if="nextAddBtn" :loading="dialogLoading" round @click="handleSave('nextAdd')">继续添加</el-button>
      <el-button round @click="handleClose">取 消</el-button>
    </span>
    <editor-dialog
      :visible.sync="editorVisible"
      :editor-data="editorData"
      @changeMessageContent="changeMessageContent"
    />
  </el-dialog>
</template>

<script>
import { saveInfoPublish, updateInfoPublish, getInfoFiles } from '../../../api/info/infoPublish'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import { flatDate, deepClone, timeChange } from '../../../utils/common'
import EditorDialog from './EditorDialog'

export default {
  name: 'InfoPublishDialog',
  components: {
    EditorDialog
  },
  props: {
    visible: [Boolean],
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogTreeData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      editorVisible: false,
      editorData: {},
      rules: {
        messageTitle: [
          { required: true, message: '请输入标题', trigger: ['blur', 'change'] }
        ],
        messageTime: [
          { required: true, message: '请选择投放时间', trigger: ['blur', 'change'] }
        ],
        startDate: [
          { required: true, message: '请选择投放开始日期', trigger: ['blur', 'change'] }
        ],
        endDate: [
          { required: true, message: '请选择投放结束日期', trigger: ['blur', 'change'] }
        ],
        timeType: [
          { required: true, message: '请选择投放日期类型', trigger: ['blur', 'change'] }
        ],
        startTime: [
          { required: true, message: '请选择投放开始时间', trigger: ['blur', 'change'] }
        ],
        endTime: [
          { required: true, message: '请选择投放结束时间', trigger: ['blur', 'change'] }
        ],
        messageType: [
          { required: true, message: '请选择信息类型', trigger: ['blur', 'change'] }
        ],
        fileTime: [
          { required: true, message: '请输入投放时长', trigger: ['blur', 'change'] }
        ],
        messageContent: [
          { required: true, message: '投放内容不能为空', trigger: ['blur', 'change'] }
        ]
      },
      launchTypeOptions: [
        {
          value: 1,
          label: '文本'
        },
        {
          value: 2,
          label: '图片'
        },
        {
          value: 3,
          label: '视频'
        }
      ],
      weekOption: [
        { value: '1', label: '周一' },
        { value: '2', label: '周二' },
        { value: '3', label: '周三' },
        { value: '4', label: '周四' },
        { value: '5', label: '周五' },
        { value: '6', label: '周六' },
        { value: '7', label: '周日' }
      ],
      formData: {
        messageTitle: '', // 标题
        messageTime: [], // 投放时间
        startDate: '', // 投放开始日期
        endDate: '', // 投放结束日期
        messageInterval: '', // 投放时段
        startTime: '', // 投放开始时段
        endTime: '', // 投放结束时段
        messageDescribe: '', // 备注
        timeType: 1,
        deviceId: '',
        deviceName: '',
        tMessageContentList: [
          {
            messageType: 1, // 投放类型
            messageContent: '', // 投放内容
            fileSize: '', // 文件大小
            fileMd5: '', // 文件md5,
            oldFileName: '', // 旧文件名
            newFileName: '', // 新文件名
            fileTime: '', // 投放时长
            fileOrder: 1,
            ledType: 1, // 设备类型
            // upload上传
            fileList: [],
            accept: '',
            uploadTip: '',
            uploadDelFlag: true,
            option: {}
          }
        ]
      },
      mFileOrder: 1,
      treeData: [],
      defaultTreeProps: {
        children: 'children',
        label: 'name'
      },
      nextAddBtn: false,
      defaultCheckKeys: [],
      // upload上传
      action: `/api/message/upload`,
      dialogLoading: false,
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  computed: {
    headers() {
      return {
        token: getToken()
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
      // 初始化弹出框
      this.initData()
      if (this.dialogData.dtype === 'add') {
        this.nextAddBtn = true
      } else if (this.dialogData.dtype === 'edit') {
        this.nextAddBtn = false
        this.formData.messageTitle = this.dialogData.messageTitle
        this.formData.messageDescribe = this.dialogData.messageDescribe
        this.formData.timeType = this.dialogData.timeType
        this.formData.deviceId = this.dialogData.deviceId || ''
        this.formData.deviceName = this.dialogData.deviceName || ''
        getInfoFiles({ messageId: this.dialogData.messageId }).then(res => {
          // console.log(res)
          // 还原投放内容
          res.data.forEach(item => {
            if (item.messageType === 2) {
              item.accept = 'image/jpeg,image/png'
              item.uploadTip = '仅供上传jpg/png'
              item.option = { fileType: '2' }
              item.fileList = [{ name: item.oldFileName, url: `${process.env.VUE_APP_UPLOAD_API}/jh-file/${item.messageContent}` }]
            } else if (item.messageType === 3) {
              item.accept = 'audio/mp4,video/mp4'
              item.uploadTip = '仅供上传mp4'
              item.option = { fileType: '3' }
              item.fileList = [{ name: item.oldFileName, url: `${process.env.VUE_APP_UPLOAD_API}/jh-file/${item.messageContent.replace('mp4', 'jpg')}` }]
            }
            item.messageContent = decodeURI(item.messageContent)
            if (!item.fileList) {
              item.fileList = []
              item.option = {}
            }
          })
          this.formData.tMessageContentList = res.data
          this.mFileOrder = this.formData.tMessageContentList[this.formData.tMessageContentList.length - 1].fileOrder
        })
        // this.formData.tMessageContentList = this.dialogData.tMessageContentList
        // this.formData.tMessageContentList.forEach(item => {
        //   item.messageContent = decodeURI(item.messageContent)
        // })
        this.formData.messageId = this.dialogData.messageId
        if (this.dialogData.timeType === 1) {
          // 还原投放时间格式
          this.formData.startDate = this.dialogData.messageTime.split(';')[0]
          this.formData.endDate = this.dialogData.messageTime.split(';')[1]
          // 还原投放时段格式
          this.formData.startTime = this.dialogData.messageInterval.split('-')[0]
          this.formData.endTime = this.dialogData.messageInterval.split('-')[1]
        } else if (this.dialogData.timeType === 2) {
          // 还原投放时间格式
          const date1 = []
          this.dialogData.messageTime.split(';').forEach(item => {
            date1.push(item)
          })
          this.formData.messageTime = date1
        }
        // this.mFileOrder = this.formData.tMessageContentList[this.formData.tMessageContentList.length - 1].fileOrder
      }
    },
    // 初始化弹出框
    initData() {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.$refs.form2[0].resetFields()
        // 初始化formData
        this.formData.messageTitle = ''
        this.formData.messageTime = []
        this.formData.startDate = ''
        this.formData.endDate = ''
        this.formData.messageInterval = ''
        this.formData.startTime = ''
        this.formData.endTime = ''
        this.formData.messageDescribe = ''
        this.formData.timeType = 1
        this.formData.deviceId = this.dialogData.deviceId || ''
        this.formData.deviceName = this.dialogData.deviceName || ''
        this.formData.tMessageContentList = [{
          messageType: 1, // 投放类型
          messageContent: '', // 投放内容
          fileSize: '', // 文件大小
          fileMd5: '', // 文件md5,
          oldFileName: '', // 旧文件名
          newFileName: '', // 新文件名
          fileTime: '', // 投放时长
          fileOrder: 1,
          ledType: 1,
          fileList: [],
          accept: '',
          uploadTip: '',
          uploadDelFlag: true,
          option: {}
        }]
        // 初始化默认选择树
        this.defaultCheckKeys = []
        this.$refs.tree.setCheckedNodes([])
        this.treeData = []
        this.dialogLoading = false
      }
      // 还原已选设备
      this.treeData = this.dialogTreeData.concat([])
      if (this.dialogData.deviceId) {
        this.dialogData.deviceId.split(';').forEach((item, index) => {
          this.defaultCheckKeys.push(item)
        })
      }
    },
    // 下拉框选择上传类型
    selectUploadType(val, index) {
      const json = this.formData.tMessageContentList[index]
      json.messageContent = ''
      json.fileSize = ''
      json.fileMd5 = ''
      json.oldFileName = ''
      json.newFileName = ''
      json.fileList = []
      if (val === 2) {
        json.option = { fileType: '2' }
        json.accept = 'image/jpeg,image/png'
        json.uploadTip = '仅供上传jpg/png'
      } else if (val === 3) {
        json.option = { fileType: '3' }
        json.accept = 'audio/mp4,video/mp4'
        json.uploadTip = '仅供上传mp4'
      }
    },
    // 清除投放时间
    resetTime() {
      this.formData.messageTime = []
      this.formData.startDate = ''
      this.formData.endDate = ''
      this.formData.startTime = ''
      this.formData.endTime = ''
      this.$refs.form.validateField('startDate')
    },
    // 显示投放内容弹出框
    showEditorDialog(data) {
      this.editorVisible = true
      this.editorData = data
    },
    // 保存投放内容
    changeMessageContent(data) {
      this.formData.tMessageContentList.forEach((item, index) => {
        if (item.fileOrder === data.fileOrder) {
          item.messageContent = data.messageContent
          this.$refs.form2[index].validateField('messageContent')
        }
      })
      this.editorVisible = false
    },
    // 保存表单
    handleSave(type) {
      if (this.validForm()) {
        const saveFormData = deepClone(this.formData)
        // 调整投放时间
        let dates = ''
        if (saveFormData.timeType === 1) {
          dates = `${saveFormData.startDate};${saveFormData.endDate}`
        } else if (saveFormData.timeType === 2) {
          saveFormData.messageTime.forEach(item => {
            dates += `${item};`
          })
          dates = dates.substring(0, dates.length - 1)
        }
        saveFormData.messageTime = dates
        // 调整投放时段
        saveFormData.messageInterval = saveFormData.timeType === 1 ? `${saveFormData.startTime}-${saveFormData.endTime}` : ''
        this.dialogLoading = true
        delete saveFormData.createTime
        delete saveFormData.updateTime
        delete saveFormData.intervalStartTime
        const username = Cookies.get('x-username')
        if (this.dialogData.dtype === 'add') {
          saveFormData.createBy = username
          saveFormData.tMessageContentList.forEach(item => {
            item.messageContent = encodeURI(item.messageContent)
          })
          saveInfoPublish(saveFormData).then(res => {
            this.$message({
              type: 'success',
              message: '新增成功!'
            })
            this.$emit('refresh')
            if (type === 'nextAdd') {
              this.dialogLoading = false
              this.initData()
            } else {
              this.dialogVisible = false
            }
          }).catch(() => {
            this.dialogLoading = false
          })
        } else if (this.dialogData.dtype === 'edit') {
          saveFormData.updateBy = username
          saveFormData.tMessageContentList.forEach(item => {
            item.messageContent = encodeURI(item.messageContent)
          })
          updateInfoPublish(saveFormData).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.dialogVisible = false
            this.$emit('refresh')
          }).catch(() => {
            this.dialogLoading = false
          })
        }
      }
    },
    // 校验
    validForm() {
      let flag = true
      this.$refs.form.validate((valid, fields) => {
        if (valid) {
          if (this.formData.tMessageContentList && this.formData.tMessageContentList.length > 0) {
            this.formData.tMessageContentList.forEach((item, index) => {
              this.$refs.form2[index].validate((valid2, fields2) => {
                if (!valid2) {
                  flag = false
                }
              })
            })
          } else {
            this.$message({
              type: 'warning',
              message: '至少添加一个投放策略!'
            })
            flag = false
          }
          if (!this.formData.deviceId) {
            flag = false
            this.$message({
              type: 'warning',
              message: '至少选择一个投放设备!'
            })
          } else if (this.formData.deviceId.split(';').length > 20) {
            flag = false
            this.$message({
              type: 'warning',
              message: '最多同时选择20个投放设备!'
            })
          }
        } else {
          flag = false
        }
      })
      return flag
    },
    // 执行日期时间校验
    dateChange(e, index) {
      if (index === 0 && this.formData.endDate) {
        if (e && flatDate(e) > flatDate(this.formData.endDate)) {
          this.formData.startDate = ''
          return this.$message.warning('开始日期不能晚于结束日期')
        }
      } else if (index === 1 && this.formData.startDate) {
        if (e && flatDate(e) < flatDate(this.formData.startDate)) {
          this.formData.endDate = ''
          return this.$message.warning('结束日期不能早于开始日期')
        }
      }
    },
    // 执行时间校验
    timeChange(e, index) {
      if (index === 0 && this.formData.endTime) {
        if (e && timeChange(e) > timeChange(this.formData.endTime)) {
          this.formData.startTime = ''
          return this.$message.warning('开始时间不能晚于结束时间')
        } else if (e && timeChange(e) === timeChange(this.formData.endTime)) {
          this.formData.startTime = ''
          this.$message.warning('开始时间不能等于结束时间')
        }
      } else if (index === 1 && this.formData.startTime) {
        if (e && timeChange(e) < timeChange(this.formData.startTime)) {
          this.formData.endTime = ''
          return this.$message.warning('结束时间不能早于开始时间')
        } else if (e && timeChange(e) === timeChange(this.formData.startTime)) {
          this.formData.endTime = ''
          this.$message.warning('开始时间不能等于结束时间')
        }
      }
    },
    timeInit(e) {
      if (!this.formData.startTime && !this.formData.endTime) {
        const date = new Date()
        const hours = date.getHours() + 1 < 10 ? `0${date.getHours() + 1}` : date.getHours() + 1
        const minutes = date.getMinutes()
        this.formData.endTime = `${hours}:${minutes}`
      }
    },
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.formData.tMessageContentList.forEach(item => {
        item.fileList = []
      })
      this.$emit('update:visible', this.dialogVisible)
    },
    // 新增策略
    addMessageContentList() {
      if (this.formData.tMessageContentList && this.formData.tMessageContentList.length < 3) {
        // 新增
        this.mFileOrder++
        this.formData.tMessageContentList.push({
          messageType: 1, // 投放类型
          messageContent: '', // 投放内容
          fileSize: '', // 文件大小
          fileMd5: '', // 文件md5,
          oldFileName: '', // 旧文件名
          newFileName: '', // 新文件名
          fileTime: '', // 投放时长
          fileOrder: this.mFileOrder,
          ledType: 1,
          // upload上传
          fileList: [],
          accept: '',
          uploadTip: '',
          uploadDelFlag: true
        })
      } else {
        this.$message({
          type: 'warning',
          message: '最多只能添加3个投放策略！'
        })
      }
    },
    // 删除策略
    delMessageContentList(index) {
      this.formData.tMessageContentList.splice(index, 1)
    },
    // 选择投放设备
    clickTreeNode(obj, checkData) {
      this.formData.deviceId = ''
      this.formData.deviceName = ''
      checkData.checkedNodes.forEach(item => {
        if (!item.children) {
          this.formData.deviceId += `${item.deviceId};`
          this.formData.deviceName += `${item.deviceName};`
        }
      })
      this.formData.deviceId = this.formData.deviceId.substring(0, this.formData.deviceId.length - 1)
      this.formData.deviceName = this.formData.deviceName.substring(0, this.formData.deviceName.length - 1)
    },
    beforeUpload(file, index) {
      const json = this.formData.tMessageContentList[index]
      json.uploadDelFlag = true
      if (json.messageType === 3) {
        const size = file.size / 1024 / 1024
        if (size > 500) {
          this.$message({
            message: '视频大小不能超过500M',
            type: 'error'
          })
          json.uploadDelFlag = false
          return false
        }
      }
    },
    onSuccess(res, file, fileList, index) {
      const json = this.formData.tMessageContentList[index]
      const { code, message, data } = res
      if (code === 200) {
        this.$message({
          message: message,
          type: 'success'
        })
        json.messageContent = data.filePath
        json.fileSize = data.fileSize
        json.fileMd5 = data.md5
        json.oldFileName = file.name
        json.newFileName = data.filePath.split('/')[1]
        if (json.option.fileType === '3') {
          json.fileList = [{ name: file.name, url: `${process.env.VUE_APP_UPLOAD_API}/jh-file/${data.filePath.replace('mp4', 'jpg')}` }]
          // json.fileList = [{ name: file.name, url: `${process.env.VUE_APP_BASE_API}/api/plough_file/${data.filePath.replace('mp4', 'jpg')}` }]
        }
      } else {
        this.$message({
          message: (message && `上传失败，失败原因：${message}`) || '上传失败',
          type: 'error'
        })
      }
    },
    onError(err, file, fileList, index) {
      const errorMsg = err.message && JSON.parse(err.message)
      this.$message({
        message: errorMsg && errorMsg.msg && `上传失败，失败原因：${errorMsg.msg}` || '上传失败',
        type: 'error'
      })
    },
    onRemove(file, fileList, index) {
      const json = this.formData.tMessageContentList[index]
      if (json.uploadDelFlag) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      }
      json.messageContent = ''
      json.fileSize = ''
      json.fileMd5 = ''
      json.oldFileName = ''
      json.newFileName = ''
    },
    onExceed() {
      this.$message({
        message: '每次只能上传一个文件',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree{
    min-height:260px;
    background: #F2F2F2;
}
.area .el-form-item__content{
    margin-left:0;
}
::v-deep .el-checkbox__label{
  padding-left:5px;
}

>>> .el-textarea__inner{
  resize: none;
}
>>> .el-dialog__body{
  display: flex;
}
>>> .el-dialog{
  margin-top: 0vh!important;
}
>>> .el-button--medium{
  padding: 2px 20px;
}
>>> .upload-demo{
  position: relative;
  width: 120px;
  height: 55px;
  .el-upload__tip{
    margin-top: -2px;
  }
  .el-upload-list{
    position: absolute;
    top: -10px;
    left: 150px;
    width: 225px;
  }
  .el-upload-list__item{
    height: 62px;
    .el-upload-list__item-thumbnail{
      width: 40px;
      height: 40px;
    }
    .el-upload-list__item-name{
      line-height: 40px;
      margin-left: -20px;
    }
  }
}
.dialog-left-wrap{
  width: 535px;
  height: 750px;
  //max-height: 800px;
  border-right: 1px solid #DDDDDD;
  margin-right: 22px;
  .dialog-left-top-wrap{
    height: 36%;
  }
  .dialog-left-bottom-wrap{
    height: 64%;
  }
}
.dialog-right-wrap{
  width: 34%;
  height: 750px;
  //max-height: 800px;
  position: relative;
  .launch-device-wrap{
    width: 330px;
    height: 703px;
    display: flex;
    .device-tree{
      width: 100%;
      height: 100%;
      padding: 0 4% 0 1%;
      margin-right: 4%;
      //border-right: 1px solid #ddd;
      .filter-tree{
        height: 100%;
        overflow: auto;
      }
    }
    .device-sel{
      width: 48%;
      height: 100%;
    }
  }
}
.title-wrap{
  border-left: 4px solid #4B60D7;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title{
    height: 19px;
    font-size: 18px;
    color: #111111;
    margin-left: 9px;
  }
}
</style>

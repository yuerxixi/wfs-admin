<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="910px"
    center
    @open="showDialog"
    @close="close"
  >
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="120px">
      <el-row>
        <el-col :span="8" style="border-right:1px solid #DDDDDD;padding-right: 30px ">
          <div style="display: flex;margin-bottom: 20px;margin-right: 20px">
            <div style="display: flex;justify-content: start;align-items: center;">
              <b style="display: inline-block;width: 4px;height: 16px;background: #4B60D7;margin-right: 5px" />
              <b style="font-size: 18px;">执行设备</b>
            </div>
          </div>
          <div style="height:530px;overflow-y: scroll;">
            <el-tree
              ref="tree"
              style="padding-top:10px;"
              show-checkbox
              :data="dialogTreeData"
              :props="defaultTreeProps"
              :default-expanded-keys="expandedKeys"
              node-key="deviceId"
              :default-checked-keys="defaultCheckKeys"
              @check="(click, checked)=>{clickTreeNode(click, checked)}"
            >
              <span slot-scope="{ node,data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>{{ data.deviceName }}</span>
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col :span="14" style="min-height:548px">
          <el-form-item label-width="80px">
            <div style="display: flex;">
              <div style="display: flex;justify-content: start;align-items: center;margin-right: 50px">
                <b style="display: inline-block;width: 4px;height: 16px;background: #4B60D7;margin-right: 5px" />
                <b style="font-size: 18px;">新增策略</b>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="任务名称" prop="taskName">
            <el-input
              v-model="formData.taskName"
              placeholder="请输入任务名称"
              :maxlength="10"
              clearable
              style="width: 380px;"
            />
          </el-form-item>
          <el-form-item label="执行时间" prop="timeType">
            <el-radio-group v-model="formData.timeType" style="margin-left: 5px">
              <el-radio :label="2">按日期</el-radio>
              <el-radio :label="1">按星期</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="formData.timeType === 1" style="margin-left:80px">
            <el-form-item prop="weekData">
              <el-checkbox-group v-model="formData.weekData" style="width:400px;margin-left: 20px">
                <el-checkbox v-for="(item, index) in weekOption" :key="index" :label="item.value" style="margin-right:6px;">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if="formData.timeType === 2" class="timeChange">
            <el-form-item prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                placeholder="请选择开始时间"
                size="small"
                value-format="yyyy-MM-dd 00:00:00"
                style="width:185px"
                :picker-options="expireTimeOption"
                :clearable="false"
                @change="timeTypeChange($event,0)"
              />
            </el-form-item>
            <el-form-item prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                size="small"
                placeholder="请选择结束时间"
                style="width:185px"
                class="end-date"
                value-format="yyyy-MM-dd 23:59:59"
                :clearable="false"
                :picker-options="expireTimeOption"
                @change="timeTypeChange($event,1)"
              />
            </el-form-item>
          </div>
          <div style="width:474px;line-height:38px;margin-left:35px;background: #FFFFFF;font-size: 15px;color: #111111;margin-bottom:10px;">
            <span style="display:flex;border-bottom: 1px solid #DDDDDD;margin-bottom:10px;"><span style="color: red">*</span>开关操作</span>
            <div style="height:40px;margin-left: 84px;display:flex">
              <div v-for="(i,index) in formData.switchData" :key="i.id" class="lightOn">
                <el-time-picker
                  v-model="i.onTime"
                  format="HH:mm:ss"
                  value-format="HH:mm:ss"
                  :placeholder="i.on === 1 ? '请选择开灯时间' : '请选择关灯时间'"
                  :picker-options="{ selectableRange: ['17:00:00 - 23:59:59', '00:00:00 - 04:59:59'] }"
                  style="width:185px;margin-left: 3px"
                  :clearable="false"
                  @change="switchChange($event,index)"
                  @focus="timeInit($event,index)"
                />
              </div>
            </div>
          </div>
          <div class="adjustTime" style="position:relative;width:474px;line-height:38px;margin-left:35px;background: #FFFFFF;font-size: 15px;font-family: Microsoft YaHei;position:relative">
            <span style="display:flex;border-bottom: 1px solid #DDDDDD;margin:0px 0px 10px 0px;width:100%;color: #111111;"><span style="color: red" />调光操作</span>
            <el-button type="text" style="position:absolute;right:0px;top:7px;" @click="addLightData">+添加</el-button>
            <div v-for="(item,index) in formData.lightData" :key="index" style="padding:0 6px;position:relative;">
              <el-col :span="12">
                <el-form-item label="调光时间">
                  <el-time-picker
                    v-model="item.lightTime"
                    format="HH:mm:ss"
                    value-format="HH:mm:ss"
                    placeholder="请选择调光时间"
                    :picker-options="{ selectableRange: ['17:00:00 - 23:59:59', '00:00:00 - 04:59:59'] }"
                    style="width:146px;"
                    size="mini"
                    :clearable="false"
                    @blur="lightTimeChange($event,index)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item label="亮度（%）">
                  <el-select v-model="item.light" placeholder="请选择亮度" style="width:120px;" size="mini">
                    <el-option v-for="i in options" :key="i.value" :label="i.label" :value="i.label" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-button type="text" @click="delLightData(item)">删除</el-button>
              </el-col>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" type="primary" round @click="handelConfirm">保存</el-button>
      <el-button v-if="this.title === '新增策略'" :loading="loading" round @click="handleAgain">继续添加</el-button>
      <el-button round @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { submitTargetForm } from '../../../../api/light/light'
import { timeChange, flatDate } from '../../../../utils/common'
export default {
  name: 'AddStrategy',
  components: { },
  props: {
    visible: [Boolean],
    title: { type: String, default: 'default' },
    rowInfo: { type: Object, default: () => {} },
    dialogTreeData: { type: Array, default() { return [] } }
  },
  data() {
    return {
      expireTimeOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      treeData: [], // 树数据
      defaultTreeProps: { children: 'children', label: 'name' },
      defaultCheckKeys: [],
      expandedKeys: [],
      data: [],
      dialogVisible: false,
      loading: false,
      options: [
        { value: 1, label: 20 },
        { value: 2, label: 40 },
        { value: 3, label: 60 },
        { value: 4, label: 80 },
        { value: 5, label: 100 }
      ],
      weekOption: [
        { value: 1, label: '周日' },
        { value: 2, label: '周一' },
        { value: 3, label: '周二' },
        { value: 4, label: '周三' },
        { value: 5, label: '周四' },
        { value: 6, label: '周五' },
        { value: 7, label: '周六' }
      ],
      areaEquipment: [], // 已选择的区域设备数组
      formData: {
        taskName: '', // 任务名称
        deviceIds: [], // 任务名称
        timeType: 2, // 任务名称
        weekData: [], // 执行类型
        startDate: '', // 按日期
        endDate: '', // 按日期
        lightData: [{ light: '', lightTime: '' }], // 调光操作
        switchData: [{ on: 1, onTime: '' }, { on: 0, onTime: '' }] // 开关操作
      },
      rules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        timeType: [{ required: true, message: '请选择执行时间', trigger: 'blur' }],
        startDate: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        weekData: [{ required: true, message: '请选择星期', trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    // 提交表单
    handelConfirm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // 开关时间为空不能提交
        for (let i = 0; i < this.formData.switchData.length; i++) {
          if (this.formData.switchData[i].onTime === '') {
            return this.$message({ message: '请选择开关时间', type: 'error' })
          }
        }
        // 调光时间、亮度为空不能提交
        for (let i = 0; i < this.formData.lightData.length; i++) {
          if (this.formData.lightData[i].lightTime === '' && this.formData.lightData[i].light > 0) {
            return this.$message({ message: '请选择调光时间', type: 'error' })
          } else if (this.formData.lightData[i].lightTime !== '' && this.formData.lightData[i].light === '') {
            return this.$message({ message: '请选择调光亮度', type: 'error' })
          }
        }
        // 设备id不能提交
        if (this.formData.deviceIds.length <= 0) {
          return this.$message({ message: '请选择执行设备', type: 'error' })
        }
        this.submitFormData = JSON.parse(JSON.stringify({ ...this.formData }))
        for (let i = 0; i < this.formData.lightData.length; i++) {
          if (this.formData.lightData[i].light === '' && this.formData.lightData[i].lightTime === '') {
            this.submitFormData.lightData = []
          }
        }
        if (this.submitFormData.timeType === 1) {
          delete this.submitFormData.startDate
          delete this.submitFormData.endDate
        } else {
          delete this.submitFormData.weekData
        }
        this.loading = true
        const url = this.title === '新增策略' ? '/api/lightTask/save' : '/api/lightTask/update'
        submitTargetForm(url, this.submitFormData).then((res) => {
          if (this.title === '修改策略') {
            this.$message({ message: '修改成功', type: 'success' })
          } else {
            this.$message({ message: '新增成功', type: 'success' })
          }
          this.loading = false
          this.close()
          this.$emit('refreshForm')
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 继续添加
    handleAgain() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        for (let i = 0; i < this.formData.switchData.length; i++) {
          if (this.formData.switchData[i].onTime === '') {
            return this.$message({ message: '请选择开关时间', type: 'error' })
          }
        }
        // 调光时间、亮度为空不能提交
        for (let i = 0; i < this.formData.lightData.length; i++) {
          if (this.formData.lightData[i].lightTime === '' && this.formData.lightData[i].light > 0) {
            return this.$message({ message: '请选择调光时间', type: 'error' })
          } else if (this.formData.lightData[i].lightTime !== '' && this.formData.lightData[i].light === '') {
            return this.$message({ message: '请选择调光亮度', type: 'error' })
          }
        }
        if (this.formData.deviceIds && this.formData.deviceIds.length <= 0) {
          return this.$message({ message: '请选择执行设备', type: 'error' })
        }
        this.submitFormData = JSON.parse(JSON.stringify({ ...this.formData }))
        for (let i = 0; i < this.formData.lightData.length; i++) {
          if (this.formData.lightData[i].light === '' && this.formData.lightData[i].lightTime === '') {
            this.submitFormData.lightData = []
          }
        }
        if (this.submitFormData.timeType === 1) {
          delete this.submitFormData.startDate
          delete this.submitFormData.endDate
        } else {
          delete this.submitFormData.weekData
        }
        this.loading = true
        const url = '/api/lightTask/save'
        submitTargetForm(url, this.formData).then((res) => {
          this.$message({ message: '新增成功', type: 'success' })
          this.dialogVisible = true
          this.loading = false
          this.$refs.elForm.resetFields()
          this.$refs.tree.setCheckedKeys([])
          this.$emit('refreshForm')
          this.formData = {
            taskName: '', // 任务名称
            deviceIds: [], // 任务名称
            timeType: 2, // 任务名称
            weekData: [], // 执行类型
            startDate: '', // 按日期
            endDate: '', // 按日期
            lightData: [{ light: '', lightTime: '' }], // 调光操作
            switchData: [{ on: 1, onTime: '' }, { on: 0, onTime: '' }] // 开关操作
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },
    // 编辑时数据回显
    showDialog() {
      console.log(this.rowInfo)
      if (this.title === '修改策略') {
        this.formData.id = this.rowInfo.id
        this.formData.taskName = this.rowInfo.taskName
        this.formData.lightData = [...this.rowInfo.originLightData]
        this.formData.switchData = [...this.rowInfo.originSwitchData]
        this.formData.deviceIds = this.rowInfo.deviceIds
        if (this.rowInfo.timeType === 1) {
          this.formData.weekData = this.rowInfo.weekData
        } else {
          this.formData.startDate = this.rowInfo.startDate
          this.formData.endDate = this.rowInfo.endDate
        }
        this.formData.timeType = this.rowInfo.timeType
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.rowInfo.deviceIds)
          this.expandedKeys = this.rowInfo.deviceIds
        })
      }
    },
    // 关闭弹窗
    close() {
      this.$refs.elForm.resetFields()
      this.formData = {
        taskName: '', // 任务名称
        deviceIds: [], // 任务名称
        timeType: 2, // 任务名称
        weekData: [], // 执行类型
        startDate: '', // 按日期
        endDate: '', // 按日期
        lightData: [{ light: '', lightTime: '' }], // 调光操作
        switchData: [{ on: 1, onTime: '' }, { on: 0, onTime: '' }] // 开关操作
      }
      this.$refs.tree.setCheckedKeys([])
      this.dialogVisible = false
      this.loading = false
      this.$emit('update:visible', this.dialogVisible)
    },
    // 选择投放设备
    clickTreeNode(click, checked) {
      if (checked.checkedKeys.length) {
        this.formData.deviceIds = checked.checkedKeys.filter(item => {
          return item !== undefined
        })
      } else {
        this.formData.deviceIds = []
      }
    },
    // 执行时间校验
    timeTypeChange(e, index) {
      console.log(e)
      if (index === 0 && this.formData.endDate && flatDate(e) >= flatDate(this.formData.endDate)) {
        this.formData.startDate = ''
        return this.$message.warning('开始时间不能晚于结束时间')
      } else if (index === 1 && this.formData.startDate && flatDate(e) <= flatDate(this.formData.startDate)) {
        this.formData.endDate = ''
        return this.$message.warning('结束时间不能早于开始时间')
      }
    },

    // 开关操作时间选择的校验
    switchChange(e, index) {
      // const start = this.formData.switchData[0].onTime
      // const end = this.formData.switchData[1].onTime
      // if (index === 0 && end && (timeChange(e) >= timeChange(end))) {
      //   this.formData.switchData[0].onTime = ''
      //   return this.$message.warning('开灯时间不能晚于关灯时间')
      // } else if (index === 1 && start && (timeChange(e) <= timeChange(start))) {
      //   this.formData.switchData[1].onTime = ''
      //   return this.$message.warning('关灯时间不能早于开灯时间')
      // }
    },
    timeInit(e, index) {
      // this.formData.switchData[0].onTime = '00:00:00'
      // this.formData.switchData[1].onTime = '17:00:00'
      // const start = this.formData.switchData[0].onTime
      // const end = this.formData.switchData[1].onTime
      // if (index === 0 && !start && !end) {
      //   const date = new Date()
      //   const hours = date.getHours() + 1 < 10 ? `0${date.getHours() + 1}` : date.getHours() + 1
      //   const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      //   const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      //   this.formData.switchData[1].onTime = `${hours}:${minutes}:${seconds}`
      // }
    },
    // 调光时间操作时间选择的校验
    lightTimeChange(e, index) {
      // const start = this.formData.switchData[0].onTime
      // const end = this.formData.switchData[1].onTime
      // if (start === '' && end === '') {
      //   this.formData.lightData[index].lightTime = ''
      //   return this.$message.warning('请先选择开关灯时间')
      // }
      // if (start === '') {
      //   this.formData.lightData[index].lightTime = ''
      //   return this.$message.warning('请先选择开灯时间')
      // }
      // if (end === '') {
      //   this.formData.lightData[index].lightTime = ''
      //   return this.$message.warning('请先选择关灯时间')
      // }
      // if (timeChange(e.value) < timeChange(start)) {
      //   this.formData.lightData[index].lightTime = ''
      //   return this.$message.warning('调光时间需在开灯时间内')
      // }
      // if (timeChange(e.value) > timeChange(end)) {
      //   this.formData.lightData[index].lightTime = ''
      //   return this.$message.warning('调光时间需在关灯时间内')
      // }
    },
    addLightData() {
      if (this.formData.lightData.length >= 5) {
        return this.$message.warning('最多新增五条')
      } else {
        this.formData.lightData.push({ light: '', lightTime: '' })
      }
    },
    delLightData(item) {
      if (this.formData.lightData && this.formData.lightData.length <= 1) {
        return this.$message.warning('请至少保留一项')
      } else {
        this.formData.lightData.splice(item.index, 1)
      }
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
  .timeChange{
    margin:0px 0 5px 97px;
    display: flex;
    .end-date{
      margin-left: -18px;
    }
  }
  ::v-deep .el-form-item el-form-item--medium{
    margin-bottom:12px;
  }

  ::v-deep .el-tree{
    min-height:530px;
    background: #F2F2F2;
  }
  .area .el-form-item__content{
    margin-left:0px;
  }

  ::v-deep .el-form-item__content{
    margin-left:25px !important;
  }

  ::v-deep .adjustTime .el-form-item__content{
    margin-left:0px !important;
  }

  ::v-deep .el-form-item{
    margin-bottom: 10px;
  }

  ::v-deep .el-form-item__label{
    text-align:left;
    padding-left:37px;
    padding-right:0px;
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #666666;
  }

  ::v-deep .adjustTime .el-form-item__label{
    padding-left:0px;
    width:75px !important;
  }
  .lightOn{
    :first-child{
      margin-right: 5px;
    }
  }

  .del{
    position: absolute;
    right:0px;
    top:10px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #4B60D7;
    cursor: pointer;
  }

  ::v-deep .el-checkbox__label{
    padding-left:5px;
  }
</style>

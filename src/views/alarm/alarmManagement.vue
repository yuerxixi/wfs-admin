<template>
  <div class="app-container">
    <el-card class="box-card">
      <!-- 搜索 -->
      <div class="head-container">
        <div class="search-text">
          <div>
            <span class="search-label">告警类型</span>
            <el-select v-model="queryParams.alertType" clearable placeholder="请选择" style="width: 180px;">
              <el-option
                v-for="item in alertTypeDictionary"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <span class="search-label">设备类型</span>
            <el-select v-model="queryParams.deviceType" clearable placeholder="请选择" style="width: 180px;" @change="selDeviceType">
              <el-option
                v-for="item in deviceTypeData"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <div>
            <span class="search-label">设备型号</span>
            <el-select v-model="queryParams.deviceModel" clearable placeholder="请选择" style="width: 180px;">
              <el-option
                v-for="item in deviceModelData"
                :key="item.id"
                :label="item.deviceModel"
                :value="item.deviceModel"
              />
            </el-select>
          </div>
          <div>
            <span class="search-label">告警时间</span>
            <el-date-picker
              v-model="queryParams.startTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions2"
              placeholder="开始时间"
              style="width: 190px;margin-right: 8px;"
              @change="timeTypeChange($event,0)"
            />
            <el-date-picker
              v-model="queryParams.endTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions2"
              placeholder="结束时间"
              style="width: 190px"
              @change="timeTypeChange($event,1)"
            />
          </div>
          <el-button size="mini" icon="el-icon-search" type="primary" style="margin-right: 10px" @click="toQuery">搜 索</el-button>
          <el-button size="mini" icon="el-icon-refresh-left" @click="resetQuery()">重 置</el-button>
        </div>
      </div>
      <!-- 弹框列表 -->
      <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialogFlag" center title="告警次数" width="620px">
        <div class="dialog-title"><span>设备名称：{{ currentSbmc }}</span><span>告警次数：{{ currentGjcs }}</span></div>
        <el-table v-loading="dialogLoading" :data="dialogData" highlight-current-row height="400px" max-height="400px" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
          <el-table-column label="序号" type="index" width="120" />
          <el-table-column prop="alertTypeTitle" label="告警类型" width="200" class-name="alarm-color" />
          <el-table-column prop="createTime" label="告警时间" />
        </el-table>
      </el-dialog>
      <!--列表展示-->
      <el-table ref="table" v-loading="loading" highlight-current-row :data="alarmListData" row-class-name="rowClass" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
        <el-table-column label="序号" type="index" :index="indexMethod" width="140" />
        <el-table-column prop="deviceType" label="设备类型" />
        <el-table-column prop="deviceModel" label="设备型号" />
        <!--        <el-table-column prop="deviceId" label="设备ID" />-->
        <el-table-column prop="deviceName" label="设备名称" />
        <el-table-column prop="alertTypeTitle" label="告警类型" />
        <el-table-column prop="createTime" label="告警时间" />
        <el-table-column prop="alertNum" label="告警次数" />
        <el-table-column label="操作" width="170px" align="center" fixed="right">
          <template v-slot="{ row }">
            <el-button size="mini" style="margin-right: 3px;" type="text" @click="handleShowDialog(row)">查看</el-button>
            <el-button v-if="row.status === 1" size="mini" style="margin-right: 3px;" type="text" @click="closeAlarm(row)">关闭告警</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page.sync="currentPage"
        :page-size="queryParams.limit"
        background
        layout="total, prev, pager, next"
        @current-change="pageChangeHandler"
      />
    </el-card>
  </div>
</template>

<script>
import { getAlarmManagerListData, getAlarmManagerDetailData, getDeviceTypeData, getDeviceModelData, closeDeviceAlarm } from '../../api/alarm/alarmManagement'
import { dictionaryModels } from '../../api/device/public'
import { flatDate } from '../../utils/common'

export default {
  name: 'AlarmManagement',
  data() {
    return {
      alarmListData: [],
      dialogData: [],
      dialogFlag: false,
      currentSbmc: '',
      currentSbId: '',
      currentGjcs: 0,
      loading: false,
      dialogLoading: false,
      total: 0,
      currentPage: 1,
      queryParams: {
        page: 1,
        limit: 10,
        alertType: '',
        deviceType: '',
        deviceModel: '',
        startTime: '',
        endTime: ''
      },
      pickerOptions2: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      dialogQueryParams: {
        page: 1,
        limit: 100,
        deviceId: '',
        sidx: 'create_time',
        order: 'desc'
      },
      alertTypeDictionary: [
        {
          label: '离线告警',
          value: 1
        },
        {
          label: '故障告警',
          value: 2
        }
      ],
      deviceTypeData: [],
      deviceModelData: []
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化获取数据
    initData() {
      this.getAlarmList()
      this.getDeviceType()
      this.selDeviceType('')
    },
    // 获取list数据
    getAlarmList() {
      this.loading = true
      getAlarmManagerListData(this.queryParams).then(res => {
        if (res.page.list) {
          this.loading = false
          res.page.list.forEach(item => {
            item.alertTypeTitle = this.getNameFromValue(this.alertTypeDictionary, item.alertType)
          })
          this.alarmListData = res.page.list
          this.total = res.page.totalCount
          this.currentPage = res.page.currPage
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 根据告警类型获取中文名称
    getNameFromValue(data, value) {
      const json = data.find(item => {
        return item.value === value
      })
      return json.label
    },
    // 获取设备类型数据字典
    getDeviceType() {
      getDeviceTypeData().then(res => {
        if (res.data) {
          this.deviceTypeData = res.data.deviceType
        }
      })
    },
    // 选择设备类型，加载设备型号
    selDeviceType(val) {
      if (val === '') {
        dictionaryModels().then(res => {
          if (res.data) {
            this.deviceModelData = res.data
          }
        })
      } else {
        getDeviceModelData({ deviceType: val }).then(res => {
          if (res.data) {
            this.deviceModelData = res.data.list
          }
        })
      }
    },
    // 显示弹出框列表
    handleShowDialog(row) {
      this.currentSbmc = row.deviceName
      this.currentSbId = row.deviceId
      this.currentGjcs = row.alertNum
      this.dialogQueryParams.deviceId = row.deviceId
      this.dialogLoading = true
      this.dialogFlag = true
      getAlarmManagerDetailData(this.dialogQueryParams).then(res => {
        if (res.page.list) {
          res.page.list.forEach(item => {
            item.alertTypeTitle = this.getNameFromValue(this.alertTypeDictionary, item.alertType)
          })
          this.dialogData = res.page.list
          this.dialogLoading = false
        }
      })
    },
    indexMethod(index) {
      return this.queryParams.limit * (this.currentPage - 1) + index + 1
    },
    // 关闭告警
    closeAlarm(row) {
      this.$confirm('确认关闭当前设备告警?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.loading = true
        closeDeviceAlarm([row.deviceId]).then(res => {
          if (res.code === 0) {
            this.$message.success('关闭告警成功！')
            this.getAlarmList()
          } else {
            this.loading = false
            this.$message.warnging('关闭设备告警失败！')
          }
        })
      })
    },
    // 重置查询
    resetQuery() {
      this.queryParams.alertType = ''
      this.queryParams.deviceType = ''
      this.queryParams.deviceModel = ''
      this.queryParams.startTime = ''
      this.queryParams.endTime = ''
      this.getAlarmList()
      this.selDeviceType('')
    },
    // 查询
    toQuery() {
      if (!this.queryParams.startTime && this.queryParams.endTime) {
        this.$message.warning('请选择开始时间！')
      } else if (this.queryParams.startTime && !this.queryParams.endTime) {
        this.$message.warning('请选择结束时间！')
      }
      this.getAlarmList()
    },
    // 改变当前页
    pageChangeHandler(page) {
      this.queryParams.page = page
      this.getAlarmList()
    },
    // 执行时间校验
    timeTypeChange(e, index) {
      if (index === 0 && this.queryParams.endTime) {
        if (e && flatDate(e) > flatDate(this.queryParams.endTime)) {
          this.queryParams.startTime = ''
          return this.$message.warning('开始时间不能晚于结束时间')
        } else if (e && flatDate(e) === flatDate(this.queryParams.endTime)) {
          this.queryParams.startTime = ''
          this.$message.warning('开始时间不能等于结束时间')
        }
      } else if (index === 1 && this.queryParams.startTime) {
        if (e && flatDate(e) < flatDate(this.queryParams.startTime)) {
          this.queryParams.endTime = ''
          return this.$message.warning('结束时间不能早于开始时间')
        } else if (e && flatDate(e) === flatDate(this.queryParams.startTime)) {
          this.queryParams.endTime = ''
          this.$message.warning('开始时间不能等于结束时间')
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;color: #303133;
  font-size: 15px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__multi-value{
  margin-bottom: 0;
}
::v-deep .vue-treeselect__multi-value-item{
  border: 0;
  padding: 0;
}

>>> .rowClass{
  height: 60px;
}
.head-container .date-item{
  margin-bottom: 0;
}
.dialog-title{
  margin-bottom: 12px;
  margin-top: -10px;
  display: flex;
  //justify-content: space-between;
  span{
    flex: 0 0 50%;
  }
}
.search-label{
  margin-right: 6px;
}
>>> .alarm-color{
  color: #FF4D4F;
}
</style>

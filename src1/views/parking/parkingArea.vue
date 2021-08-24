<template>
  <div class="app-container">
    <!-- 左侧下拉树 -->
    <el-card class="box-card">
      <!--      <div class="left-wrap">-->
      <!--        <el-input-->
      <!--          v-model="filterTreeText"-->
      <!--          placeholder="输入关键字进行过滤"-->
      <!--          suffix-icon="el-icon-search"-->
      <!--          size="medium"-->
      <!--          style="margin-bottom: 10px"-->
      <!--        />-->
      <!--        <el-tree-->
      <!--          ref="tree"-->
      <!--          class="filter-tree"-->
      <!--          :data="treeData"-->
      <!--          :props="defaultTreeProps"-->
      <!--          default-expand-all-->
      <!--          :filter-node-method="filterTreeNode"-->
      <!--          :expand-on-click-node="true"-->
      <!--          @current-change="clickTreeNode"-->
      <!--        />-->
      <!--      </div>-->
      <!-- 右侧展示列表 -->
      <div class="right-wrap">
        <el-table ref="table" v-loading="loading" highlight-current-row :data="parkingAreaData" :header-cell-style="{background:'#DDDDDD',color:'#606266'}">
          <el-table-column label="序号" type="index" :index="indexMethod" width="200px" />
          <el-table-column prop="parkName" label="停车场名称" />
          <el-table-column prop="floorName" label="停车区名称" />
          <el-table-column prop="totalGuidePlace" label="停车位总数" />
        </el-table>
        <!--分页组件-->
        <!--        <el-pagination
          :total="total"
          :current-page.sync="currentPage"
          :page-size="queryParam.limit"
          background
          layout="total, prev, pager, next"
          @current-change="pageChangeHandler"
        />-->
      </div>
    </el-card>
  </div>
</template>

<script>
import { getParkAreaList } from '@/api/parking/parkingArea'

export default {
  name: 'ParkingArea',
  data() {
    return {
      parkingAreaData: [],
      queryParam: {
        page: 1,
        limit: 15
      },
      total: 0,
      currentPage: 1,
      loading: false
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据
    initData() {
      // 获取list数据
      this.getListData()
    },
    // 获取list数据
    getListData() {
      this.loading = true
      getParkAreaList(this.queryParam).then(res => {
        // console.log('getParkList', res)
        this.loading = false
        this.parkingAreaData = res.list
        this.total = res.list.length
        this.currentPage = 1
      })
    },
    indexMethod(index) {
      return this.queryParam.limit * (this.currentPage - 1) + index + 1
    },
    // 改变当前页
    pageChangeHandler(page) {
      this.queryParam.page = page
      this.getListData()
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
>>> .el-card__body{
  display: flex;
  height: 100%;
}
//.left-wrap{
//  flex: 0 0 15%;
//  height: 100%;
//  border-right: 1px solid #DDDDDD;
//  padding-right: 20px;
//  .filter-tree{
//    height: 92%;
//    background: none!important;
//  }
//}
.right-wrap{
  flex: 0 0 100%;
  height: 100%;
  padding-left: 20px;
}
</style>

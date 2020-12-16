<template>
  <div class="app-container page-home-container">
    <!-- <Search :query="query"/> -->
    <div class="head-container">
      <!-- <el-input v-model="query.subordinateUnits" clearable placeholder="请输入业务单位" style="width: 200px;" /> -->
      <el-date-picker
        v-model="query.date"
        type="daterange"
        range-separator=":"
        class="el-range-editor--small"
        style="height: 30.5px;width: 220px"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
      <el-button size="mini" type="success" icon="el-icon-search" @click="getData">搜索</el-button>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="8">
        <div class="chart-wrapper searchBox">
          <module-title name="按业务单位访问 TOP10" ></module-title>
          <bar-chart2 ref="barChart2" @tabData='tabData2' />
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="16">
        <div class="chart-wrapper searchBox">
          <module-title name="按访问对象排名 TOP10"></module-title>
          <bar-chart ref="barChart" @tabData='tabData' />
        </div>
      </el-col>
    </el-row>
    <!--表格渲染-->
    <div style="background: #fff">
      <module-title name="访问量统计汇总表"></module-title>
    </div>
    <el-table v-loading="loading" :data="data" size="mini" style="width: 100%;">
      <el-table-column prop="username" label="AD账号" sortable />
      <el-table-column prop="nickname" label="用户名" sortable />
      <el-table-column prop="subordinateUnits" label="业务单位" sortable />
      <el-table-column prop="behaviour" label="行为" sortable />
      <el-table-column prop="actionObject" label="对象名称" sortable />
      <el-table-column prop="visits" label="访问频次" sortable />
     
      <el-table-column prop="createTime" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="detail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin: 8px 0 30px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseTime } from '@/utils/index'
// import Search from '../log/search'
import moduleTitle from '../../components/ModuleTitle.vue' //模块标题
import barChart from '../../home/BarChart'  //柱形图
import barChart2 from '../../home/BarChart2'  //柱形图
import { initData as chartGet } from '@/api/data.js'

export default {
  name: 'Log',
  components: { barChart, barChart2, moduleTitle },
  mixins: [initData],
  data() {
    return {
      downloadLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    parseTime,
    getData() {
      this.init()
      this.getCharts()
    },
    getCharts() {
      let params1 = {"distinguish": "subordinateUnits"}, params2 = {distinguish: 'actionObject'};
      if (this.params.startTime) {
        params1['startTime'] =  this.query.date[0]
        params2['startTime'] =  this.query.date[0]
        params1['endTime'] = this.query.date[1]
        params2['endTime'] = this.query.date[1]
      }
      chartGet("/api/logs/figure", params1).then(result => {
        // const x = result.data.x;
        result.data.x.reverse();
        result.data.y.reverse();

        for(let i in result.data.y){
          result.data.y[i] = Number(result.data.y[i]).toFixed(0);
        }
        // const y = result.data.y;
        this.$nextTick(() => {
          const _this = this.$refs.barChart2
          _this.y = result.data.x
          _this.x = result.data.y
          _this.initChart()
        })
      })
      chartGet("/api/logs/figure", params2).then(result => {
        let x = [], y = [];
        for (let i in result.data){
          x.push(Number(result.data[i].value).toFixed(0));
          y.push(result.data[i].name);
        }
        this.$nextTick(() => {
          const _this = this.$refs.barChart
          _this.y = x
          _this.x = y
          _this.initChart()
        })
        
      })
    },
    tabData(name) {
      this.query.actionObject = name
      this.query.subordinateUnits = ''
      this.init()
    },
    tabData2(name) {
      this.query.subordinateUnits = name
      this.query.actionObject = ''
      this.init()
    },
    detail(row) {
      this.$router.push({
        name: 'Log',
        params: {
          username: row.username,
          behaviour: row.behaviour,
          techcode: row.techcode,
          subordinateUnits: row.subordinateUnits 
        }
      })
    },
    befaSearch() {

    },
    beforeInit(state) {
      this.url = '/api/logs/table'
      const query = this.query
      const value = query.subordinateUnits
      this.params = { page: this.page, size: this.size }
      if (value) { this.params['subordinateUnits'] = value }
      if (query.actionObject) {
        this.params['actionObject'] = query.actionObject
      }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      return true
    },
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadLog(this.params).then(result => {
        downloadFile(result, '系统日志列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scope lang='scss'>
  .page-home-container {
    padding: 10px;
    background:rgba(242,243,248,1);
    .chart-wrapper {
      background: #fff;
      margin-bottom: 12px;
    }
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 70px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .demo-table-expand .el-form-item__content {
    font-size: 12px;

  }
  .searchBox {
    overflow: hidden;
    .module-title {
      padding-right: 0;
    }
  }
</style>

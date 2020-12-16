<template>
  <div class="app-container">
    <div class="head-container">
      <el-input v-model="query.value" clearable placeholder="请输入你要搜索的内容" style="width: 200px;" class="" @keyup.enter.native="toQuery"/>
      <el-date-picker
        v-model="query.date"
        type="daterange"
        range-separator=":"
        class="el-range-editor--small"
        style="height: 30.5px;width: 220px"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
        <el-select v-model="query.behaviour" placeholder="请选择行为" clearable style="width: 200px;">
          <el-option
            v-for="item in dicts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      <el-button size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
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
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求方法">
              <span>{{ props.row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ props.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="AD账号"/>
      <el-table-column prop="nickname" label="用户名"/>
      <el-table-column prop="subordinateUnits" label="业务单位"/>
      <el-table-column label="IP地址">
        <template slot-scope="scope">
          {{scope.row.requestIp}}
        </template>
      </el-table-column>

      <el-table-column label="地区">
        <template slot-scope="scope">
          {{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column prop="behaviour" label="行为"/>
      <el-table-column prop="actionObject" label="对象"/>

      <!-- <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源"/> -->
      <!-- <el-table-column prop="browser" label="浏览器"/> -->
      <!-- <el-table-column prop="time" label="请求耗时" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="createTime" label="操作时间" sortable width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'

import { parseTime } from '@/utils/index'
import { downloadFile } from '@/utils/index'
import { downloadLog } from '@/api/log'
export default {
  name: 'Log',
  mixins: [initData, initDict],
  data() {
    return {
      query: {
        value: ''
      },
      downloadLoading: false
    }
  },
  created() {
    this.init()
    this.getDict('OPTYPE')
  },
  methods: {
    parseTime,
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadLog(this.params).then(result => {
        downloadFile(result, '系统日志列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    beforeInit() {
      this.url = 'api/logs'
      // const sort = 'id,desc'
      const query = this.query
      this.params = { page: this.page, size: this.size, flag: 0, sort: 'id,desc' }
      const value = query.value, behaviour = query.behaviour, techcode = query.techcode;
      if (value) { this.params['blurry'] = value }
      if (behaviour) { this.params['behaviour'] = query.behaviour }
      // if (techcode) { this.params['techcode'] = query.techcode }
      if (query.date) {
        this.params['startTime'] = query.date[0]
        this.params['endTime'] = query.date[1]
      }
      const newParams = this.$route.params
      if (newParams.username) {
        this.query = newParams
        this.params.flag = 1
        this.params.username = newParams.username
        this.params.behaviour = newParams.behaviour
        this.params.techcode = newParams.techcode
        this.params.subordinateUnits = newParams.subordinateUnits 
      }
      return true
    }
  }
}
</script>

<style>
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
</style>

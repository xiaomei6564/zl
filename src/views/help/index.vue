<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','helpInformationMaintenance:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :titState='titState' :dicts='dicts' />
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :default-expand-all="true" 
      :data="data" row-key="id" size="small" >
      <el-table-column label="业务名称">
        <template slot-scope="scope">
          {{scope.row.id ? scope.row.businessName : scope.row.categoryName}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="categoryName" label="分类名称"/> -->
      <!-- <el-table-column prop="id" label="id"/> -->
      <!-- <el-table-column prop="categoryCode" label="分类编码"/> -->
      <el-table-column prop="modelCode" label="技术名称"/>
      <!-- <el-table-column prop="report" label="report"/> -->
      <!-- <el-table-column prop="helpInformation" label="帮助信息"/> -->
      <el-table-column prop="createdBy" label="更新人"/>
      
      <el-table-column prop="creationTime" label="更新时间">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.creationTime, '-') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','helpInformationMaintenance:edit','helpInformationMaintenance:del'])" label="操作" width="220px" align="center">
        <template slot-scope="scope" v-if="scope.row.id">
          <el-button size="mini" type="warning" @click="chulai(scope.row)">
            <i class="el-icon-question" style="color: #333"></i>
          </el-button>
          <el-button v-permission="['admin','helpInformationMaintenance:edit']" size="mini" style="margin-left: 0" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','helpInformationMaintenance:del']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
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
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del, downloadHelpInformationMaintenance } from '@/api/helpInformationMaintenance'
import { parseDate, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      titState: false,
      queryTypeOptions: [
        { key: 'businessName', display_name: '业务名称' },
        { key: 'modelCode', display_name: '技术名称' },
        // { key: 'report', display_name: 'report' },
        { key: 'createdBy', display_name: '更新人' },
      ],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getDict('HELP_MAINTAIN_CLASSIFICATION')
    })
  },
  methods: {
    parseDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/helpInformationMaintenance'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    chulai(row) {
      this.titState = true
      const _this = this.$refs.form
      let Base64 = require('js-base64').Base64;
      _this.form = {
        id: row.id,
        helpInformation: row.helpInformation ? Base64.decode(row.helpInformation) : '',
        businessName: row.businessName
      }
      _this.dialog = true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.titState = false
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.titState = false
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        businessName: data.businessName,
        modelCode: data.modelCode,
        // report: data.report,
        categoryCode: data.categoryCode,
        categoryName: data.categoryName,
        // createdBy: data.createdBy,
        // creationTime: data.creationTime
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadHelpInformationMaintenance(this.params).then(result => {
        downloadFile(result, 'HelpInformationMaintenance列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>

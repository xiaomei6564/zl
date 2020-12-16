<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :classify='dictMap.BUSINESS_CLASSIFICATION' />
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>SAP HANA数据源列表</span>
            <el-button
              v-permission="['admin','dataSourceDefine:add']"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.form.dialog = true;isAdd = true">新增</el-button>
          </div>
          <!--工具栏-->
          <div class="head-container">
            <!-- 搜索 -->
            <el-input v-model="query.name" clearable placeholder="输入数据源名称" style="width: 200px;" class="filter-item" @keyup.enter.native="init"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="init">搜索</el-button>
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
          <!--表格渲染-->
          <!-- <el-table v-loading="loading" :data="data" ref="singleTable" size="small" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange"> -->
          <el-table v-loading="loading" ref="singleTable" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" highlight-current-row :default-expand-all="true" :data="data" row-key="id" size="small"  @current-change="handleCurrentChange">
            <el-table-column :show-overflow-tooltip="true" prop='classificationName' label="数据源名称">
              <template slot-scope="scope">
                <span>{{scope.row.name ? scope.row.name : scope.row.classificationName}}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="techcode" label="技术名"/>
            <el-table-column v-if="checkPermission(['admin','dataSourceDefine:edit','dataSourceDefine:del'])" label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope" v-if="scope.row.techcode">
                <el-button v-permission="['admin','dataSourceDefine:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                <el-popover
                  v-permission="['admin','dataSourceDefine:del']"
                  :ref="scope.row.id"
                  placement="top"
                  width="420">
                  <p>此操作将删除数据源定义，以及针对该数据源的各类配置数据， 但不影响SAP   HANA后端模型， 是否要继续删除 ? </p>
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
            :current-page="query.page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>数据源详情</span>
            <!-- <el-button
              v-if="checkPermission(['admin','dataSourceDefine:add']) && this.$refs.dataSourceDetail && this.$refs.dataSourceDetail.techcode"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.dataSourceDetail.$refs.form.dialog = true;$refs.dataSourceDetail.isAdd = true">新增</el-button> -->
          </div>
          <dataSourceDetail ref="dataSourceDetail" :DEFAULT_DATE='dictMap.DEFAULT_DATE' :DECIMAL_PLACE='dictMap.DECIMAL_PLACE' :ENUM_SYS='dictMap.ENUM_SYS' :search-type='dictMap.SEARCH_TYPE' :NUMBER_FORMAT='dictMap.NUMBER_FORMAT' :DATE_FORMAT='dictMap.DATE_FORMAT' :ORIGIN_SYSTEM='dictMap.ORIGIN_SYSTEM' />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
// import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del, downloadDataSourceDefine, list } from '@/api/dataSourceDefine'
import dataSourceDetail from '../dataSourceDetail/index'
import { downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'DataSource',
  components: { dataSourceDetail, eForm },
  mixins: [ initDict],
  data() {
    return {
      delLoading: false,
      data: [],
      loading: false,
      isAdd: false,
      pids:[],
      query: {
        name: '',
        sort: 'classificationId,asc',
        page: 0,
        size: 10
      },
      total: 0,
      downloadLoading: false,
      queryTypeOptions: [
        { key: 'name', display_name: '数据源名称' },
        { key: 'descs', display_name: '描述' }
      ]
    }
  },
  created() {
    this.init()
    this.getDictMap('BUSINESS_CLASSIFICATION,SEARCH_TYPE,ORIGIN_SYSTEM,NUMBER_FORMAT,DATE_FORMAT,DECIMAL_PLACE,ENUM_SYS,DEFAULT_DATE')
  },
  computed: {
    heightTable() {
      return window.innerHeight - 159 - 188
    }
  },
  methods: {
    checkPermission,
    init() {
      // this.params = { page: this.page, size: this.size, sort: sort }
      // const query = this.query
      // const value = query.value
      this.loading = true
      list(this.query).then(res => {
        this.loading = false
        this.data = res.content
        this.total = res.totalElements
        this.$nextTick(() => {
          this.$refs.singleTable.setCurrentRow(this.data[0].children[0]);
        })
        if (this.$refs.dataSourceDetail) {
          this.$refs.dataSourceDetail.data = []
          this.$refs.dataSourceDetail.dataParams = {}
        }
      })
    },
    sizeChange(val) {
      this.query.size = val
      this.init()
    },
    pageChange(val) {
      this.query.page = val - 1
      this.init()
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          offset: 100,
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    handleCurrentChange(val) {
      if (val && val.techcode) {
        let that = this.$refs.dataSourceDetail
        that.dataParams = val
        that.init()
      }
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        name: data.name,
        descs: data.descs,
        techcode: data.techcode,
        techcodeLong: data.techcodeLong,
        status: data.status,
        classificationId: typeof data.classificationId == 'number' ? data.classificationId.toString() : data.classificationId
      }
      _this.dialog = true
    },
    download() {
      this.init()
      this.downloadLoading = true
      downloadDataSourceDefine(this.query).then(result => {
        downloadFile(result, '数据源列表', 'xlsx')
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

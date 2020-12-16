<template>
  <div>
    <div v-if="dataParams.techcode === ''">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="query.name" clearable placeholder="输入数据源名称" style="width: 200px;" class="filter-item" @keyup.enter.native="searchData"/>
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="searchData">搜索</el-button>
        <!-- 导出 -->
        <!-- <div style="display: inline-block;">
          <el-button
            :loading="downloadLoading"
            size="mini"
            class="filter-item"
            type="warning"
            icon="el-icon-download"
            @click="download">导出</el-button>
        </div> -->
      </div>
      <!--表单组件-->
      <searchForm ref="form" :search-type='searchType' :ENUM_SYS='ENUM_SYS' :DEFAULT_DATE='DEFAULT_DATE' />
      <dataForm ref="dataForm" :DATE_FORMAT='DATE_FORMAT' :NUMBER_FORMAT='NUMBER_FORMAT' :DECIMAL_PLACE='DECIMAL_PLACE' />
      <linkForm ref="linkForm" :ORIGIN_SYSTEM='ORIGIN_SYSTEM' />

      <!--表格渲染-->
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" >
        <el-table-column prop="TEXT_ID" label="字段" show-overflow-tooltip />
        <el-table-column prop="TEXT_CONTENT" label="字段名称" show-overflow-tooltip />
        <el-table-column prop="DATA_TYPE_NAME" label="字段类型" width="130px" show-overflow-tooltip />
        <el-table-column prop="POSITION" label="排序" width="50px" show-overflow-tooltip />
        <el-table-column v-if="checkPermission(['admin','dataSourceDefine:edit','dataSourceDefine:del'])" label="操作" width="280px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button v-permission="['admin','dataSourceDefine:edit']" size="mini" :type="scope.row.conditionsState ? 'primary' : 'info'" @click="searchDetail(scope.row)">条件</el-button>
            <el-button v-permission="['admin','dataSourceDefine:edit']" size="mini" :type="scope.row.extensionState ? 'success' : 'info'" @click="dataDetail(scope.row)">扩展</el-button>
            <el-button v-permission="['admin','dataSourceDefine:edit']" size="mini" :type="scope.row.jumpState ? 'warning' : 'info'" @click="linkDetail(scope.row)">跳转</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        :current-page="query.page"
        :page-size="query.showSize"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        :page-sizes='[10, 20, 30, 40, 50, 100]'
        @current-change="pageChange"/>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { list, whetherConfiguration } from '@/api/dataSourceDetail'
import searchForm from './searchForm'
import dataForm from './dataForm'
import linkForm from './linkForm'
export default {
  components: { searchForm, dataForm, linkForm },
  props: {
    DEFAULT_DATE: {
      type: Array,
      default: () => {return []}
    },
    DECIMAL_PLACE: {
      type: Array,
      default: () => {return []}
    },
    searchType: {
      type: Array,
      default: () => {return []}
    },
    ORIGIN_SYSTEM: {
      type: Array,
      default: () => {return []}
    },
    DATE_FORMAT: {
      type: Array,
      default: () => {return []}
    },
    NUMBER_FORMAT: {
      type: Array,
      default: () => {return []}
    },
    ENUM_SYS: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      data: [],
      allData: [],
      loading: false,
      dataParams: {},
      total: 0,
      query: {
        name: '',
        type: 'TEXT_CONTENT',
        page: 1,
        size: 999,
        showSize: 20
      },
      queryTypeOptions: [{
        display_name: '字段',
        key: 'TEXT_ID'
      }, {
        display_name: '字段名称',
        key: 'TEXT_CONTENT'
      }],
      downloadLoading: false
    }
  },
  computed: {
    heightTable() {
      return window.innerHeight - 159 - 143
    }
  },
  created() {
  },
  methods: {
    checkPermission,
    download() {

    },
    sizeChange(val) {
      this.query.showSize = val
      this.formatDate()
    },
    pageChange(val) {
      this.query.page = val
      this.formatDate()
    },
    searchData() {
      if (this.query.type) {
        // params[this.query.type] = this.query.name
        let allDate = JSON.parse(JSON.stringify(this.allData))
        let data = allDate.filter(item => item[this.query.type].indexOf(this.query.name) !== -1)
        this.query.page = 1
        this.formatDate(data)
      }
    },
    formatDate(searchData) {
      let startNum = this.query.showSize * (this.query.page - 1), endNum = this.query.showSize * (this.query.page);
      let allDate = searchData ? searchData : JSON.parse(JSON.stringify(this.allData))

      this.data = allDate.slice(startNum, endNum)
      this.total = allDate.length
    },
    init() {
      this.loading = true
      let params = {viewCode: this.dataParams.techcode, page: this.query.page, size: this.query.size}

      list(params).then((res = []) => {
        whetherConfiguration({viewCode: this.dataParams.techcode}).then(resData => {
          this.loading = false
          if (!res.content) {
            this.data = []
            this.total = 0
            return false;
          }
          this.allData = res.content.map(item => {
            item.conditionsState = resData.conditions ? resData.conditions.split(',').findIndex(it => it === item.TEXT_ID) !== -1 : false
            item.extensionState = resData.extension ? resData.extension.split(',').findIndex(it => it === item.TEXT_ID) !== -1 : false
            item.jumpState = resData.jump ? resData.jump.split(',').findIndex(it => it === item.TEXT_ID) !== -1 : false
            return item;
          })
          // this.total = res.totalElements
          this.formatDate()
        })
      })
    },
    searchDetail(data) {
      const _this = this.$refs.form
      _this.form = {
        id: this.dataParams.id,
        techcode: this.dataParams.techcode,
        name: this.dataParams.name,
        filed: data.TEXT_ID,
        filedName: data.TEXT_CONTENT,
        showSorting: '',
        showName: data.TEXT_CONTENT,
        whetherDisplayDefault: '',
        displayType: '',
        enumName: '',
        status: this.dataParams.status,
        defaultDate: '',
        specifyDate: '',
        cnXlmr: '',
        enumeratedValueSource: ''
      }
      _this.init()
      _this.dialog = true
    },
    dataDetail(data) {
      const _this = this.$refs.dataForm
      _this.form = {
        id: '',
        name: this.dataParams.name,
        techcode: this.dataParams.techcode,
        filed: data.TEXT_ID,
        filedNames: data.TEXT_CONTENT,
        showSorting: '',
        showName: data.TEXT_CONTENT,
        dateFieldIdentification: data.ZSIGN_IS_DATE,
        dimensionIndicatorIdentification: data.ZSIGN_FIELD_TYPE,
        dateFormat: '',
        digitalFormat: '',
        widths: '',
        explains: '',
        filedType: data.DATA_TYPE_NAME,
        filedLength: data.LENGTH,
        decimalPlaces: data.SCALE
      }
      _this.init()
      _this.dialog = true
    },
    linkDetail(data) {
      const _this = this.$refs.linkForm
      _this.form = {
        id: this.dataParams.id,
        name: this.dataParams.name,
        techcode: this.dataParams.techcode,
        filed: data.TEXT_ID,
        filedName: data.TEXT_CONTENT,
      }
      _this.init()
      _this.dialog = true
    },
  }
}
</script>

<style scoped>
  .my-code{
    padding: 15px;
    line-height: 20px;
    border-left: 3px solid #ddd;
    color: #333;
    font-family: Courier New;
    font-size: 12px
  }
</style>

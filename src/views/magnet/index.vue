<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-select v-model="query.value" v-if='query.type == "whetherDisable"' clearable placeholder="请选择" class="filter-item" style="width: 200px">
        <el-option v-for="item in isOk" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-input v-model="query.value" v-else clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','allApp:add']"
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
    <eForm ref="form" :type-arr='selectObj.APP_TYPE' :unit-list='selectObj.DATAUNIT' :titState='titState' :visible-level='selectObj.KPI_VISIBLE_LEVEL' :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :default-expand-all="true" 
    :data="data" row-key="id" size="small" >
      <el-table-column label="指标名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.id ? scope.row.tilesDescribe : scope.row.classification}}  
        </template>  
      </el-table-column>
      <!--<el-table-column prop="tilesId" label="技术名"/>-->
      <el-table-column prop="menuUrl" label="下钻地址" show-overflow-tooltip />
      <!-- <el-table-column prop="classification" label="所属类型">
        <template slot-scope="scope">
          {{scope.row.id ? scope.row.classification : ''}}  
        </template>
      </el-table-column> -->
      <el-table-column prop="whetherDisable" label="禁用">
        <template slot-scope="scope">
          <span>{{scope.row.id ? (scope.row.whetherDisable ? '是' : '否') : '' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="helpInformation" label="帮助信息" width='400' show-overflow-tooltip/> -->
      <el-table-column prop="createdBy" label="更新人" show-overflow-tooltip />
      <el-table-column label="更新时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creationTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','allApp:edit','allApp:del'])" label="操作" width="220px" align="center">
        <template slot-scope="scope" v-if="scope.row.id">
          <el-button size="mini" type="warning" @click="chulai(scope.row)">
            <i class="el-icon-question" style="color: #333"></i>
          </el-button>
          <el-button v-permission="['admin','allApp:edit']" size="mini" style="margin-left: 0" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','allApp:del']"
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

import { del, downloadAllApp } from '@/api/allApp'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'tilesDescribe', display_name: '指标名称' },
        { key: 'menuUrl', display_name: '下钻地址' },
        { key: 'whetherDisable', display_name: '是否禁用' },
        { key: 'createdBy', display_name: '更新人' },
        // { key: 'creationTime', display_name: '创建时间' }
      ],
      isOk: [{
        label: '是',
        value: '1'
      }, {
       label: '否',
       value: '0'
      }],
      selectObj: {},
      titState: false,
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getDictMap('APP_TYPE,KPI_VISIBLE_LEVEL,DATAUNIT').then(res => {
        this.selectObj = res
      })
    })
  },
  methods: {
    parseTime,
    checkPermission,

    beforeInit() {
      this.url = 'api/allApp'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
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
          offset: 100,
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    chulai(row) {
      this.titState = true
      const _this = this.$refs.form
      let Base64 = require('js-base64').Base64;
      _this.form = {
        id: row.id,
        tilesDescribe: row.tilesDescribe
      }
      try {
        _this.form.helpInformation = row.helpInformation ? Base64.decode(row.helpInformation) : ''
      } catch(err) {
        _this.form.helpInformation = row.helpInformation
      }
      _this.dialog = true
    },
    add() {
      this.titState = false
      this.isAdd = true
      const _this = this.$refs.form
      _this.form = {
        id: '',
        tilesId: '',
        tilesDescribe: '',
        menuUrl: '',
        icon: '',
        back: '',
        color: '',
        unit: '',
        stateOldNew: '',
        classification: '',
        classificationCoding: '',
        whetherDisable: '',
        indicatorVisibilityLevel: ''
      }
      _this.dialog = true
    },
    edit(data) {
      this.titState = false
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        tilesId: data.tilesId,
        tilesDescribe: data.tilesDescribe,
        menuUrl: data.menuUrl,
        icon: data.icon,
        back: data.back,
        color: data.color,
        unit: data.unit,
        stateOldNew: data.stateOldNew,
        classification: data.classification,
        classificationCoding: data.classificationCoding.toString(),
        whetherDisable: data.whetherDisable,
        creationTime: data.creationTime,
        indicatorVisibilityLevel: data.indicatorVisibilityLevel.toString()
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadAllApp(this.params).then(result => {
        downloadFile(result, 'AllApp列表', 'xlsx')
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

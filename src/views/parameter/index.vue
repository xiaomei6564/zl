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
          v-permission="['admin','parameterConfigurationTable:add']"
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
    <eForm ref="form" :dicts='dicts' :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="businessName" label="业务名称"/>
      <el-table-column prop="technicalName" label="技术名称"/>
      <el-table-column prop="viewPath" label="视图路径" show-overflow-tooltip />
      <el-table-column prop="fields" label="查询字段"/>
      <el-table-column prop="fieldDescription" label="字段描述"/>
      <el-table-column prop="displayType" label="显示类型">
        <template slot-scope="scope">
          {{displayType(scope.row.displayType)}}
        </template>
      </el-table-column>
      <el-table-column prop="whetherDisplayDefault" label="是否默认显示">
        <template slot-scope="scope">
          {{scope.row.whetherDisplayDefault ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column prop="showSorting" label="显示顺序" />
      <el-table-column prop="enumName" label="显示类型枚举值" >
        <template slot-scope="scope">
          {{scope.row.enumName ? scope.row.enumName : '无'}}
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" label="创建人">
        <template slot-scope="scope">
          {{scope.row.createdBy ? scope.row.createdBy : '无'}}
        </template>
      </el-table-column>
      <el-table-column prop="creationTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.creationTime ? parseTime(scope.row.creationTime) : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyBy" label="修改人">
        <template slot-scope="scope">
          {{scope.row.modifyBy ? scope.row.modifyBy : '无'}}
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.modifyTime ? parseTime(scope.row.modifyTime) : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['admin','parameterConfigurationTable:edit','parameterConfigurationTable:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['admin','parameterConfigurationTable:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','parameterConfigurationTable:del']"
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
import { del, downloadParameterConfigurationTable } from '@/api/parameterConfigurationTable'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'businessName', display_name: '业务名称' },
        { key: 'technicalName', display_name: '技术名称' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
    this.getDict('CSXSLX')
  },
  methods: {
    parseTime,
    checkPermission,
    displayType(val) {
      let label;
      this.dicts.map(item => {
        if (val == item.value) {
          return label = item.label
        }
      })
      return label
    },
    beforeInit() {
      this.url = 'api/parameterConfigurationTable'
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
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        businessName: data.businessName,
        technicalName: data.technicalName,
        viewPath: data.viewPath,
        fields: data.fields,
        fieldDescription: data.fieldDescription,
        displayType: data.displayType.toString(),
        whetherDisplayDefault: data.whetherDisplayDefault,
        showSorting: data.showSorting,
        enumName: data.enumName
      }
      _this.dialog = true
    },
    // 导出
    download() {
      this.beforeInit()
      this.downloadLoading = true
      downloadParameterConfigurationTable(this.params).then(result => {
        downloadFile(result, 'ParameterConfigurationTable列表', 'xlsx')
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

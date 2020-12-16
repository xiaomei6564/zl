<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="getData"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="getData">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['admin','businessLink:add']"
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
          v-permission="['admin','businessLink:export']"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :pids="pids"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :default-expand-all="expand" :data="data" row-key="id" size="small">
      <el-table-column label="环节" prop="reportForms" width='200' show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="{'can-click':scope.row.status==2}" :style='scope.row.menuUrl ? "text-decoration: underline;cursor: pointer;color: #0026ff;": ""' @click.prevent="entryDetails(scope.row)">{{scope.row.reportForms}}</span>
        </template>
      </el-table-column>
      <el-table-column label="统计口径" prop="businessExplain" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="can-click">{{scope.row.businessExplain}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务描述" prop="description" show-overflow-tooltip />
      <el-table-column v-if="checkPermission(['admin','businessLink:edit','businessLink:del'])" width='200' label="操作" align="center">
        <template slot-scope="scope" v-if='!scope.row.children'>
          <el-button v-permission="['admin','businessLink:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','businessLink:del']"
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
      :current-page="query.page + 1"
      style="margin: 8px 0 15px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
// import initData from '@/mixins/initData'
import { del, downloadBusinessLink,initReportList } from '@/api/businessLink'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  // mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        // { key: 'id', display_name: '主键ID' },
        // { key: 'menuUrl', display_name: '菜单URL' },
        { key: 'reportForms', display_name: '表单名称' },
        // { key: 'pid', display_name: '父类ID' },
        { key: 'businessExplain', display_name: '统计口径' },
        { key: 'description', display_name: '描述' },
        // { key: 'updateTime', display_name: '更新时间' }
      ],
      pids:[],
      query: {
        value: '',
        type: '',
        page: 0,
        size: 10
      },
      data: [],
      loading: false,
      downloadLoading: false,
      total: 0,
      expand: true,
      isAdd: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    // beforeInit() {
    //   this.url = 'api/businessLink'
    //   const sort = 'id,desc'
    //   this.params = { page: this.page, size: this.size, sort: sort }
    //   const query = this.query
    //   const type = query.type
    //   const value = query.value
    //   if (type && value) { this.params[type] = value }
    //   return true
    // },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        // this.dleChangePage()
        this.getData()
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
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        menuUrl: data.menuUrl,
        reportForms: data.reportForms,
        pid: data.pid,
        businessExplain: data.businessExplain,
        description: data.description,
        updateTime: data.updateTime,
        permission: data.permission
      }
      _this.dialog = true
    },
    // 导出
    download() {
      // this.beforeInit()
      this.downloadLoading = true
      downloadBusinessLink(this.params).then(result => {
        downloadFile(result, 'BusinessLink列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    },
    getData(){
      initReportList(this.query).then(result => {
        this.pids = result;
        this.data = result;
        this.total = result.length
      })

    },
    // 改变条数
    sizeChange(val) {
      this.tableData.page = 1;
      this.tableData.size = val;
      this.getData(this.params);
    },
    // 改变页数
    pageChange(val) {
      this.tableData.page = val;
      this.getData(this.params);
    },
    entryDetails(row){ //跳转到详情页面
      /*if(row.status!==2){
        return
      }*/
      if (!row.menuUrl) return false;
      const indexState = this.$store.state.user.roles.findIndex(item => item === row.permission)
      if (indexState === -1) return this.$message.warning(`您没有${row.reportForms}权限，请联系管理员！`)
      this.$router.push({
        path: row.menuUrl,
        query: {name: row.reportForms}
      })
    }
  }
}
</script>

<style scoped>
  
</style>

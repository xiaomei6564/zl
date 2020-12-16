<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="选择数据源" width="800px">
    <div class="reportForm">
      <el-tabs v-model="reportType" type="border-card" @tab-click="handleClick" size='mini'>
        <el-tab-pane v-for="item in list" :key="item.value" :label="item.label" :name="item.value">
          <div class="reportForm_content" v-loading='loading'>
            <temSearch v-if="reportType == 'All'" :REPORT_FORMS_TYPE='REPORT_FORMS_TYPE' :data='data' />
            <temTree v-if="reportType != 'All'" :data='treeData' />
            <el-pagination
              @current-change="handleCurrentChange"
              layout="total, prev, pager, next"
              :total="data.totalElements"
              v-if="reportType == 'All'">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="emitLoading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { findReportPageList, packageDataSourceTree } from '@/api/visualDesign'
import temSearch from './temSearch'
import temTree from './temTree'

export default {
  props: {
    REPORT_FORMS_TYPE: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      emitLoading: false,
      list: [{
        label: '搜索',
        value: 'All'
      }, {
        label: '系统内置',
        value: 'SystemDef'
      }, {
        label: '自定义查询',
        value: 'Customize'
      }, {
        label: 'SAP HANA',
        value: 'SapHana'
      }],
      data: {},
      treeData: [],
      reportType: 'All',
      params: {
        reportType: 'All',
        page: 0,
        size: 10,
        znName: '',
        packageId: ''
      },
    }
  },
  components: {temSearch, temTree},
  created() {
    this.init()
  },
  methods: {
    handleCurrentChange(val) {
      this.params.page = val - 1
      this.init()
    },
    init() {
      this.loading = true
      if (this.reportType !== 'All') {
        packageDataSourceTree({reportType: this.reportType}).then(res => {
          this.treeData = res
          this.loading = false
        })
      } else {
        findReportPageList(this.params).then(res => {
          this.loading = false
          this.data = res
        })
      }
      
    },
    cancel() {
      this.dialog = false
    },
    doSubmit() {
      if (this.$store.state.visualDesign.sourceData.length !== 2) {
        return this.$message.warning('请选择两个！')
      }
      this.$parent.getList()
      this.cancel()
    },
    handleClick(val) {
      this.params.page = 0
      this.init()
    }
  }
}
</script>
<style scoped lang='scss'>
  /deep/ .el-dialog__body {
    padding: 20px 0;
  }
  .reportForm_content {
    height: 50vh;
    overflow-y: scroll;
  }
</style>
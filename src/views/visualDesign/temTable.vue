<template>
  <div class="temTable">
    <el-table :data="tableData.data" v-loading='tableData.loading' size='mini' style="width: 100%">
      <el-table-column prop="date" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
    <el-pagination
      :total="tableData.totals"
      :current-page="params.page" 
      :page-size="params.size"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>
<script>
import { reportDataList } from '@/api/visualDesign'
export default {
  name: 'temTable',
  data() {
    return {
      tableData: { //表格数据
        loading: false, //表格加载
        column: [], //表头
        data: [], //数据
        totals: 0, //数据总数
      },
      params: {
        reportCode: '',
        page: 1,
        size: 20
      }
    }
  },
  watch: {
    '$store.state.visualDesign.reportCode'(val) {
      if (val) {
        this.params = {
          reportCode: val,
          page: 1,
          size: 20
        }
        this.getData()
      }
    }
  },
  methods: {
    getData() {
      reportDataList(this.params).then(res => {
        console.log(res)
        this.tableData.data = res.content
        this.tableData.totals = res.totalElements
      })
    },
    // 改变条数
    sizeChange(val) {
      this.params.page = 1;
      this.params.size = val;
      this.getData();
    },
    // 改变页数
    pageChange(val) {
      this.params.page = val;
      this.getData();
    }
  }
}
</script>
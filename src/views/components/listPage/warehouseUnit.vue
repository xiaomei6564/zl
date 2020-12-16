<!--业务单位弹框---->
<template>
  <el-dialog title="选择仓库" 
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-loading='loading'
    width="80%">
    <div class="content">
      <div class="left">
        <el-input v-model="params.fuzzy" placeholder="请输入仓名" size="mini" style="width: 200px;margin-bottom: 20px" @keyup.enter.native="params.page = 1; init()"  />
        <el-button size="mini" type="success" icon="el-icon-search" @click="params.page = 1; init()">搜索</el-button>
        <el-button size="mini" type="primary" icon="el-icon-add" @click="add">添加</el-button>
        <el-table ref="multipleTableLeft" size='mini' border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="leftSelectionChange">
          <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip label="仓库名称" prop="LIB_DESC"></el-table-column>
          <el-table-column show-overflow-tooltip label="仓号" prop="WAREHOUSE"></el-table-column>
          <el-table-column show-overflow-tooltip label="仓名" prop="WAREHOUSE_DESC"></el-table-column>
          <el-table-column show-overflow-tooltip label="库类型" prop="LIB_TYPE_DESC"></el-table-column>
        </el-table>
        <el-pagination
          :total="total"
          :current-page="params.page" 
          :page-size="params.size"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </div>
      <div class="right">
        <el-button size="mini" type="danger" style="margin-bottom: 20px" icon="el-icon-delete" @click="del">移除</el-button>
        <el-table ref="multipleTableRight" border size='mini' :data="rightData" tooltip-effect="dark" style="width: 100%" @selection-change="rightSelectionChange">
          <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip label="仓库名称" prop="LIB_DESC"></el-table-column>
          <el-table-column show-overflow-tooltip label="仓号" prop="WAREHOUSE"></el-table-column>
          <el-table-column show-overflow-tooltip label="仓名" prop="WAREHOUSE_DESC"></el-table-column>
          <el-table-column show-overflow-tooltip label="库类型" prop="LIB_TYPE_DESC"></el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="text" @click="closeDialog">取消</el-button>
      <el-button size="small" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getList } from '@/api/warehouse'
import moduleTitle from '@/views/components/ModuleTitle.vue'; //模块标题

export default {
  data(){
    return{
      dialogVisible: false,
      tableData: [],
      loading: false,
      total: 0,
      params: {
        page: 1,
        size: 10,
        fuzzy: ''
      },
      selectLeftData: [],
      rightData: [],
      selectRightData: [],
      filed: ''
    }
  },
  components: {moduleTitle},
  created() {
    let collectionData = this.$store.state.collectionData;
    this.init()
  },
  
  methods:{
    init() {
      getList(this.params).then(res => {
        this.tableData = res.content
        this.total = res.totalElements
      })
    },
    add() {
      if (this.selectLeftData.length) {
        let rightData = [...this.rightData, ...this.selectLeftData]
        this.rightData = Array.from(new Set(rightData))
        this.$refs.multipleTableLeft.clearSelection();
      } else {
        this.$message.warning('请选择一行！')
      }
    },
    del() {
      if (this.selectRightData.length) {
        for(let i = 0; i < this.rightData.length; i++) {
          const index = this.selectRightData.findIndex(it => this.rightData[i].WAREHOUSE === it.WAREHOUSE)
          if (index !== -1) {
            this.rightData.splice(i, 1)
            i--;
          }
        }
        this.$refs.multipleTableRight.clearSelection();
      } else {
        this.$message.warning('请选择一行！')
      }
    },
    sizeChange(val) {
      this.params.size = val
      this.init()
    },
    pageChange(val) {
      this.params.page = val
      this.init()
    },
    leftSelectionChange(val) {
      this.selectLeftData = val
    },
    rightSelectionChange(val) {
      this.selectRightData = val
    },
    showDialog(data){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    // 确定
    doSubmit(){
      this.$emit('setUnit', this.rightData, this.filed)
      this.closeDialog()
    }
  }
}

</script>
<style scoped lang='scss'>
  .content {
    display: flex;
    justify-content: space-between;
    .left, .right{ 
      width: 48%;
    }
  }
</style>
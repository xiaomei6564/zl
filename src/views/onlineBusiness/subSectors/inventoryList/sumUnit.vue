<!--业务单位弹框---->
<template>
  <el-dialog title="选择核算单位" :visible.sync="dialogVisible" :append-to-body="true" :before-close="closeDialog"
  :close-on-click-modal="false" :close-on-press-escape="false" width="500px">
    <div class="head-container">
      <el-input ref="inp" v-model="sumUnit" clearable  type="small" placeholder="输入核算单位搜索" prefix-icon="el-icon-search" style="width: 400px;" class="filter-item" @input="getSum"/>
    </div>
    <div class="table-box">
      
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" type="text" @click="closeDialog">取消</el-button>
      <el-button size="small" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepts } from '@/api/dept'
export default {
  data(){
    return{
      dialogVisible: false,
      sumUnit:'',
      tableData:[],
    }
  },
  created() {
    // this.getBusiness().then(arr => {
    //   this.$emit('setUnit', arr[0].children[0])
    // })
  },
  methods:{
    showDialog(data){
      //  this.getBusiness();
       this.dialogVisible = true;
    },
    closeDialog(){
       this.dialogVisible = false;
    },
    //获取tree整体数据
    getSum(){
      return new Promise(resovle => {
        const sort = 'id,desc'
        const params = { sort: sort }
        if (this.businessUnit) { params['name'] = this.businessUnit }
        getDepts(params).then(res => {
          this.treeData = res.content
          resovle(res.content)
        })
      })
      
    },
    // 确定
    doSubmit(){
      // this.$emit('setUnit', this.treeObj, true)
      this.closeDialog()
    }
  }
}

</script>
<style scoped>
  .table-box{
    width: 100%;
    padding: 10px 20px;
    max-height:300px;
    overflow-y: auto;
  }
</style>
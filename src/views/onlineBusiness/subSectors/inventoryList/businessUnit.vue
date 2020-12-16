<!--业务单位弹框---->
<template>
  <el-dialog title="选择业务单位" 
  :visible.sync="dialogVisible"
  :append-to-body="true"
  :before-close="closeDialog"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
   width="500px">
    <div class="head-container">
      <el-input ref="inp" v-model="businessUnit" clearable  type="small" placeholder="输入业务单位搜索" prefix-icon="el-icon-search" style="width: 400px;" class="filter-item" @input="getBusiness"/>
    </div>
    <div class="tree-box">
      <el-tree :data="treeData" :props="defaultProps" :default-expanded-keys="[-1]" :expand-on-click-node="true" :default-expand-all="true" @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
              <i class="el-icon-tickets"></i>{{ node.label }}
          </span>              
      </span>
    </el-tree>
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
      businessUnit:'',
      delLoading: false,
      treeData:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeObj: {},
      businessNewObj: {}
    }
  },
  created() {
    let collectionData = this.$store.state.collectionData;
    
    this.getBusiness().then(arr => {
      if (collectionData.queryConditions) {
        let data = JSON.parse(collectionData.queryConditions)
        this.disposeData(arr, data.businessUnit || data.bukrs)
        this.$emit('setUnit', this.businessNewObj)
      } else {
        // if (!arr[0].pid) {
        //   this.$emit('setUnit', arr[0].children[0])
        //   return false;
        // }
        this.$emit('setUnit', arr[0])
      }
    })
  },
  methods:{
    disposeData(arr, text) {
      arr.map(item => {
        if (this.businessNewObj.code) return false;
        if (item.code == text) {
          this.businessNewObj = item
          return;
        }
        if (item.children) {
          this.disposeData(item.children, text)
        }
      })
      return;
    },
    showDialog(data){
      //  this.getBusiness();
       this.dialogVisible = true;
    },
    closeDialog(){
       this.dialogVisible = false;
    },
    //获取tree整体数据
    getBusiness(){
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
    //选中tree 数据
    handleNodeClick(data){
      this.treeObj = data
    },
    // 确定
    doSubmit(){
      this.$emit('setUnit', this.treeObj, true)
      this.closeDialog()
    }
  }
}

</script>
<style scoped>
.tree-box{
  width: 100%;
  padding: 10px 20px;
  max-height:300px;
  overflow-y: auto;
}
</style>
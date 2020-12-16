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
      <el-tree :data="treeData" :props="defaultProps" :default-expanded-keys="[-1]" :expand-on-click-node="true" :default-expand-all="true"
       node-key="id" @check-change="handleCheckChange" show-checkbox ref="tree" :default-checked-keys="defaultCheckedKeys">
        <span class="custom-tree-node" slot-scope="{ node, data }" >
          <span>
            <i class="el-icon-tickets"></i>{{ node.label }}
          </span>              
        </span>
      </el-tree>
    </div>
   <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
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
      businessNewObj: [],
      selectId: '',
      defaultCheckedKeys: [],
      totalElements: 0
    }
  },
  created() {
    let collectionData = this.$store.state.collectionData;
    
    this.getBusiness().then((arr = []) => {
      arr = arr[0] ? arr : [arr];
      if (collectionData.queryConditions) {
        let data = JSON.parse(collectionData.queryConditions)
        this.disposeData(arr, (data.PROGL1 ? data.PROGL1.split(',') : []), ((data.BUKRS ? data.BUKRS.split(',') : []) || (data.VKORG ? data.VKORG.split(',') : [])))
        this.$emit('setUnit', this.businessNewObj)
      } else {
        if (arr[0].pid) {
          let newArr = [], defaultArr = [];
          arr.map(item => {
            newArr.push(item)
            defaultArr.push(item.id)
            if (item.children) {
              item.children.map(it => {
                newArr.push(it)
                defaultArr.push(it.id)
              })
            }
          })
          this.defaultCheckedKeys = defaultArr
          this.$emit('setUnit', newArr)
        } else {
          this.defaultCheckedKeys = [arr[0].id]
          this.$emit('setUnit', arr)
        }
      }
    })
  },
  methods:{
    disposeData(arr, arr1, arr2) {
      if (this.businessNewObj.length == arr1.length + arr2.length) return;
      arr.map(item => {
        let index1 = arr1.findIndex(it => it == item.id) !== -1
        let index2 = arr2.findIndex(it => it == item.id) !== -1
        if (index1 || index2) {
          if (this.businessNewObj.length == arr1.length + arr2.length) return;

          this.businessNewObj.push(item)
          // this.defaultCheckedKeys.push(item.code)
        }
        if (item.children) {
          this.disposeData(item.children, arr1, arr2)
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
          this.totalElements = res.totalElements
          resovle(res.content)
        })
      })
      
    },
    handleCheckChange(data) {
      // console.log(data)
    },
    //选中tree 数据
    // handleNodeClick(data){
      // if (data.pid == 1 && this.$store.state.user.level > 2) return this.$message.warning(`您没有 ${data.name} 数据权限，请联系授权管理员`)
      // this.selectId = data.id
      // this.treeObj = data
    // },
    // 确定
    doSubmit(){
      let arr = this.$refs.tree.getCheckedNodes(false, true);
      if (!arr.length) return this.$message.warning(`请选择业务单位`)
      if (this.totalElements == arr.length && !arr[0].pid) {
        arr = [arr[0]]
      } else if (!arr[0].pid) {
        arr.splice(0, 1)
      }
      this.$emit('setUnit', arr, true)
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
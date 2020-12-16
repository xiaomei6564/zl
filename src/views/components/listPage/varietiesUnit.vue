<!--品种弹框---->
<template>
  <el-dialog title="选择品种" 
  :visible.sync="dialogVisible"
  :append-to-body="true"
  :before-close="closeDialog"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
   width="500px">
    <div class="head-container">
      <el-input ref="inp" v-model="params.wgbez" clearable  type="small" placeholder="输入品种搜索" prefix-icon="el-icon-search" style="width: 400px;" class="filter-item" @input="getVarieties"/>
    </div>
    <div class="tree-box">
      <el-tree :data="treeData" :props="defaultProps" :expand-on-click-node="true" show-checkbox :default-expand-all="true" node-key="matkl"
        @check-change="handleCheckChange" ref="tree" :default-checked-keys="defaultCheckedKeys">
        <span class="custom-tree-node" slot-scope="{ node, data }">
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
import { getListTree } from '@/api/product'
export default {
  data() {
    return {
      dialogVisible: false,
      varietiesUnit: '',
      defaultProps: {
        children: 'children',
        label: 'wgbez'
      },
      treeObj: {},
      treeData: [],
      params: {
        // enabled: 1,
        // wgbez: ''
      },
      totalElements: 0,
      varietiesNewObj: [],
      defaultCheckedKeys: [],
      userLevel: this.$store.state.user.level,
    }
  },
  created() {
    let collectionData = this.$store.state.collectionData;
    this.getVarieties().then((arr = []) => {
      // if (this.userLevel > 2) {
      //   return this.$emit('setUnit', arr[0].children[0])
      // }
      // if (arr.length > 1) {
      // } else {
      //   this.$emit('setUnit', arr[0])
      // }
      arr = arr[0] ? arr : [arr];
      if (collectionData.queryConditions) {
        let data = JSON.parse(collectionData.queryConditions)
        this.disposeData(arr, data.MATKL.split(','), data.MATNR.split(','))
        this.$emit('setUnit', this.varietiesNewObj)
      } else {
        if (arr.length > 1) {
          let newArr = [], defaultArr = [];
          (arr || []).map(item => {
            newArr.push(item)
            defaultArr.push(item.matkl)
          })
          this.defaultCheckedKeys = defaultArr
          this.$emit('setUnit', newArr)
        } else {
          this.defaultCheckedKeys = [arr[0].matkl]
          this.$emit('setUnit', arr)
        }
      }
      
      
      
    })
  },
  methods: {
    disposeData(arr, arr1, arr2) {
      arr.map(item => {
        let index1 = arr1.findIndex(it => it === item.matkl) !== -1
        let index2 = arr2.findIndex(it => it === item.matkl) !== -1
        if (index1 || index2) {
          this.varietiesNewObj.push(item)
          this.defaultCheckedKeys.push(item.matkl)
        }
        if (item.children) {
          this.disposeData(item.children, arr1, arr2)
        }
      })
      return;
    },
    doSubmit(){
      let arr = this.$refs.tree.getCheckedNodes(false);
      if (!arr.length) return this.$message.warning(`请选择品种`)
      if (this.totalElements == arr.length && !arr[0].pid) {
        arr = [arr[0]]
      } else if (!arr[0].pid) {
        arr.splice(0, 1)
      }
      this.$emit('setUnit', arr, true)
      this.closeDialog()
    },
    handleCheckChange(data, checked, indeterminate){
      // if (data.pid == 1 && this.userLevel > 2) return this.$message.warning(`您没有 ${data.wgbez} 数据权限，请联系授权管理员`)
      // this.treeObj = data
    },
    getVarieties() {
      return new Promise(resovle => {
        getListTree(this.params).then(res => {
          this.treeData = res.content
          this.totalElements = res.totalElements
          resovle(res.content)
        })
      })
      
    },
    showDialog(data){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
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
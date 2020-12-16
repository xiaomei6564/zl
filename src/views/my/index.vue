<!--业务环节单据-->
<template>
  <div class="app-container">
    <!--工具栏-->
    <!--<div class="head-container">
      &lt;!&ndash; 搜索 &ndash;&gt;
      <el-input v-model="query.value" clearable placeholder="搜索应用" style="width: 200px;" class="filter-item" @keyup.enter.native="getData"/>
      <el-button class="filter-item" size="mini" type="warning" icon="el-icon-search" @click="getData">搜索</el-button>
    </div>-->
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" />
    <!--表格渲染-->
    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" :default-expand-all="expand" :data="data" row-key="key" size="small">
      <el-table-column label="报表名称" prop="name" width="250px">
        <template slot-scope="scope">
         <span :style='scope.row.menuUrl ? "text-decoration: underline;cursor: pointer;" : ""' 
         @click.prevent="entryDetails(scope.row)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联表单"  width="200px"  >
        <template slot-scope="scope">
          <div >
            {{scope.row.formName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="时间"  width="200px"  >
        <template slot-scope="scope">
          <div >
            {{scope.row.time}} 
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="businessExplain"  />
      <!--<el-table-column label="支持顾问" prop="adviser" width="150px">
         <template slot-scope="scope">
           <span class="can-click">{{scope.row.adviser}}</span>
         </template>
      </el-table-column>-->
      <el-table-column v-if="checkPermission(['admin','favoritesForm:edit','favoritesForm:del'])" label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope"  v-if="!scope.row.directoryName">
          <el-button v-permission="['admin','favoritesForm:edit']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['admin','favoritesForm:del']"
            :ref="scope.row.key"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.key].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.key, scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { delCollectForm, edit, downloadDept, initCollectList} from '@/api/dept'
import { parseTime, downloadFile } from '@/utils/index'
import eForm from './form'
export default {
  name: 'Dept',
  components: { eForm },
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      enabledTypeOptions: [
        { key: 'true', display_name: '正常' },
        { key: 'false', display_name: '禁用' }
      ],
      delLoading: false,
      expand: true,
      
      isAdd: true,
      loading: false,
      data: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.getData()
     })
  },
  methods: {
    checkPermission,
    getData(){
      let param = {userId:this.$store.state.user.user.username};
      initCollectList(param).then(result => {
        this.data = this.setArr(result, 0)
      })
    },
    setArr(arr, index) {
      arr.map((item, i) => {
        index += 1;
        if (item.children) {
          this.setArr(item.children, 1000 * (i + 1))
        }
        item.key = index
        item.name = item.directoryName ? item.directoryName : item.reportForms
        item.time = parseTime(item.collectionTime)
        return item;
      })
      return arr;
    },
    subDelete(key, id) {
      this.delLoading = true
      delCollectForm(id).then(res => {
        this.delLoading = false
        this.$refs[key].doClose()
        this.getData()
        this.$notify({
          title: '删除成功',
          type: 'success',
          offset: 100,
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[key].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.dialog = true
    },
    changeExpand() {
      this.expand = !this.expand
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = JSON.parse(JSON.stringify({
        id: data.id, // 表单主键ID  
        reportForms: data.reportForms, // 报表
        userId: data.userId, // 用户名  
        directoryId: data.directoryId, // 目录ID
        menuUrl: data.menuUrl, // 菜单URL
        formName: data.formName, // 关联表单
        queryConditions: data.queryConditions, // 查询条件
        fieldCode: data.fieldCode, // 字段编码
        aggregateType: data.aggregateType, // 聚合类型
        collectionTime: data.collectionTime,
        businessExplain: data.businessExplain //描述
      }))
      _this.dialog = true
    },
    entryDetails(row){ //跳转到详情页面
      if(!row.menuUrl){
        return false;
      }
      this.$store.dispatch('setData', {
        queryConditions: row.queryConditions,
        fieldCode: row.fieldCode,
        aggregateType: row.aggregateType
      })

      this.$router.push(row.menuUrl)
    }
  }
}
</script>

<style scoped>
.can-click{
  text-decoration: underline;
  cursor: pointer;
}
.back1{
  /* color: #1890ff; */
}
.back2{
   color:#13ce66;
}

</style>

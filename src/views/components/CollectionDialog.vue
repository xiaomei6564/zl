<!---页面收藏目录-->
<template>
 <el-dialog 
  title="另存为报表"
  :visible.sync="dialogVisible"
  :append-to-body="true"
  :show-close='false'
  width="450px"
  top='10vh' class="alert_box"
  :before-close="() => {return;}">
  <module-title :name="'填写报表名称和说明'" tools="[]"></module-title>

   <el-form label-position="left" style="margin: 20px 0" :model="form" :rules="rules" ref="ruleForm" size="small" label-width="80px">
      <el-form-item  label="名称">
        <el-input placeholder="输入名称" v-model="form.reportForms"></el-input>
      </el-form-item>
      <el-form-item  label="对应表单">
        <span style='color: #909399'>{{form.formName}}</span>
      </el-form-item>
      <el-form-item  label="说明">
        <el-input placeholder="输入说明" v-model="form.businessExplain" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
      </el-form-item>
   </el-form>
    <module-title :name="'选择存放目录'" tools="[]"></module-title>
   <ul class="catalog-box">
     <li class="catalog-item" v-for="(i, k) in catalogLists" :key="k">
       <el-input v-model="i.directoryName" v-if="i.isEdit"></el-input>
       <p class="text"  v-if="!i.isEdit" @click="selectCatalog(i)">
         {{i.directoryName}}
         <i class="icon el-icon-success" v-if="i.directoryId==form.directoryId"></i>
      </p>
       <div class="operation-btn" v-if="i.directoryId!=='0'">

        <el-button v-permission="['admin','myFormDirectory:edit', 'myFormDirectory:del']" size="mini" type="success" icon="el-icon-check" v-if="i.isEdit" @click="save(i, k)"/>
        <el-button v-permission="['admin','myFormDirectory:edit', 'myFormDirectory:del']" size="mini" type="primary" icon="el-icon-edit" v-if="!i.isEdit" @click="edit(k)"/>
        <el-popover
          v-permission="['admin','myFormDirectory:del','myFormDirectory:edit']"
          :ref="'catalog'+k"
          placement="top"
          width="180">
          <p>确定删除本条数据吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click.stop="closePopver(k)">取消</el-button>
            <el-button type="primary" size="mini" @click="subDelete(i, k)">确定</el-button>
          </div>
          <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
        </el-popover>
       </div>
     </li>
      <li v-permission="['admin','myFormDirectory:add']" class="catalog-item" @click="add" v-if="this.catalogLists.length<5">
        <div class="catalog-add">
            <i class="el-icon-plus"></i>
        </div>
       
      </li>
   </ul>
  <div slot="footer" class="dialog-footer">
    <el-button type="text" @click="closeDialog">取消</el-button>
    <el-button type="primary" @click="closeDialog(1)">确认</el-button>
  </div>
 </el-dialog>
</template>

<script>
import { getCollectDirectory, addCollectForm, addCollectDirectory, delCollectDirectory } from '@/api/dept'
import moduleTitle from '@/views/components/ModuleTitle.vue'; //模块标题

export default {
  components: {moduleTitle},
  data(){
    return {
      dialogVisible: false,
      form:{
        reportForms: "_格式1", // 报表
        userId: this.$store.state.user.user.username, // 用户名  
        directoryId: 0, // 目录ID [放在那个目录下面]
        menuUrl: "", // 菜单URL  [跳转回原页面的地址]
        formName: "", // 关联表单 [那个表单]
        queryConditions: "", // 查询条件 [保存json字符串]
        fieldCode: "",// 字段编码[保存跳转回原页面要显示的字段]
        businessExplain: '',// 业务说明
        description: '',// 描述
        aggregateType: "",// 聚合类型[专家模式再做解释]
        collectionTime: '', // 收藏时间
      },
      rules: {
        reportForms: []
      },
      catalogLists:[{
        userId: this.$store.state.user.user.username,
        directoryId: "0",
        directoryName: "默认目录",
        creationTime: '',
        isEdit: false
      }],
    }
  },
  created() {
    getCollectDirectory({userId: this.form.userId}).then(res => {
      let data = res.content.map(item => {
        item.isEdit = false
        return item;
      })
      if (res.content.length) {
        this.catalogLists = data
      } else {
        this.catalogLists = [...this.catalogLists, ...data]
        this.catalogLists[0].creationTime = new Date().getTime()
        addCollectDirectory(this.catalogLists[0])
      }
    })
  },
  methods:{
    showDialog(params){
      this.form.reportForms = params.name + this.form.reportForms
      this.form.formName = params.name
      this.form.menuUrl = params.menuUrl
      this.form.queryConditions = params.queryConditions
      this.form.fieldCode = params.fieldCode
      this.form.aggregateType = params.aggregateType
      this.dialogVisible = true
    },
    closeDialog(state){
      if (typeof state == 'number') {
        this.form.collectionTime = new Date()
        addCollectForm(this.form).then(res => {
          this.$message.success('收藏成功')
        })
      }
      this.dialogVisible = false
    },
    add(){
      this.catalogLists.push(
        {directoryId: this.catalogLists.length, userId: this.$store.state.user.user.username, directoryName: '', isEdit: true},
      )
    },
    save(data,index){
      if (!data.directoryName) return false;
      data.creationTime = new Date().getTime()
      addCollectDirectory(data).then(res => {
        this.catalogLists[index].id = res.id
        this.catalogLists[index].isEdit = false
      })
    },
    edit(index){
      this.catalogLists[index].isEdit = true

    },
    //删除弹框取消
    closePopver(key){
      this.$refs['catalog'+key][0].doClose()
    },
    //删除table 数据
    subDelete(data, index){
      if (data.id) {
        delCollectDirectory({
          userId: data.userId,
          directoryId: data.directoryId,
          id: data.id
        }).then(res => {
          this.closePopver(index);
          if (!res) {
            this.$message.success('删除成功')
          } else {
            this.$message.warning('请在我的收藏里删除表单')
            return false;
          }
          this.catalogLists.splice(index, 1)
        })
      } else {
        this.closePopver(index);
        this.catalogLists.splice(index, 1)
      }
      
    },
    //选择目录
    selectCatalog(data){
      this.form.directoryId = data.directoryId
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" >
.catalog-box{
  width: 100%;
  height: 250px;
  margin-top: 10px;
  .catalog-item{
    height: 35px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    margin-bottom: 10px;
    padding:0 10px 0 0 ;
    .el-input__inner,.el-input,.text{
      width: 300px;
      height: 28px;
      line-height: 28px;
      font-size: 14px;
       background: #F7F7F8;
    }
    .el-input__inner{
      padding: 5px;
    }
    .text{
      padding:0 10px 0  0;
       text-indent: 5px;
      i.icon{
        color: #13ce66;
        float: right;
        margin-top: 8px;
      }
    }
    .operation-btn{
      display: flex;
      width: 60px;
      height: 30px;
      justify-content: center;
      align-items: center;
      .el-button{
        margin-right: 5px;
      }
    }
    .catalog-add{
      height: 30px;
      cursor: pointer;
      width: 300px;
      line-height: 28px;
      font-size: 14px;
       background: #F7F7F8;
       text-align: center;
    }
  }
  
  
}
</style>
<style lang="scss">
  .el-dialog__body {
    padding-top: 20px;
  }
</style>
<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增环节' : '编辑环节'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="报表名称" prop="reportForms">
        <el-input v-model="form.reportForms" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="关联表单" prop="formName">
        <el-input v-model="form.formName" style="width: 370px;"/>
      </el-form-item>
      
      <el-form-item label="描述" prop="businessExplain">
        <el-input type="textarea" v-model="form.businessExplain"  :autosize="{ minRows: 2, maxRows: 4}" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, editCollectForm } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      loading: false, dialog: false, depts: [],
      form: {
        id: '', // 表单主键ID  
        reportForms: "", // 报表
        userId: '', // 用户名  
        directoryId: '', // 目录ID
        menuUrl: "", // 菜单URL
        formName: "", // 关联表单
        queryConditions: "", // 查询条件
        fieldCode: "", // 字段编码
        aggregateType: "", // 聚合类型
        collectionTime: '',
        businessExplain: ''// 描述
      },
      rules: {
        reportForms: [
          { required: true, message: '请输入报表名称', trigger: 'blur' },
        ],
        formName: [
          { required: true, message: '请输入关联表单', trigger: 'blur' },
        ],
        businessExplain: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ]
      },
      selectArr:[
        {id: 1, name: '何擎'},
        {id: 2, name: '王梦楠'},
        {id: 3, name: '王瑞涛'},
        {id: 4, name: '李蕾'}
      ]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
              this.cancel()
            } else {
              this.doEdit()
              this.cancel()
            }
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          offset: 100,
          duration: 2500
        })
        this.loading = false
        this.$parent.getData()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      this.form.collectionTime = new Date().getTime()
      let data = JSON.parse(JSON.stringify(this.form))
      editCollectForm({
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
        businessExplain: data.businessExplain 
      }).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          offset: 100,
          duration: 2500
        })
        this.loading = false
        this.$parent.getData()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '', // 表单主键ID  
        reportForms: "", // 报表
        userId: '', // 用户名  
        directoryId: '', // 目录ID
        menuUrl: "", // 菜单URL
        formName: "", // 关联表单
        queryConditions: "", // 查询条件
        fieldCode: "", // 字段编码
        aggregateType: "", // 聚合类型
        collectionTime: '',
        businessExplain: ''
      }
    },
    
  }
}
</script>

<style scoped>

</style>

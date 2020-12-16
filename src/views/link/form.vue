<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增表单' : '编辑表单'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单URL" prop="menuUrl">
        <el-input v-model="form.menuUrl" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="表单"  prop='reportForms'>
        <el-input v-model="form.reportForms" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="所属环节" prop="pid">
        <!--<el-input v-model="form.pid" style="width: 370px;"/>-->
        <el-select v-model="form.pid" >
          <el-option
            v-for="item in pids"
          :key="item.id"
          :label="item.reportForms"
          :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="权限标识"  prop='permission'>
        <el-input v-model="form.permission" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="统计口径" prop='businessExplain'>
        <el-input v-model="form.businessExplain" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="描述" >
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/businessLink'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    pids:{
      default:[]
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        menuUrl: '',
        reportForms: '',
        pid: '',
        businessExplain: '',
        description: '',
        updateTime: ''
      },
      rules: {
        pid: [
          { required: true, message: '请选择所属环节', trigger: 'blur' }
        ],
        menuUrl: [
          { required: true, message: '请输入菜单URL', trigger: 'blur' }
        ],
        reportForms: [
          { required: true, message: '请输入表单', trigger: 'blur' }
        ],
        businessExplain: [
          { required: true, message: '请输入统一口径', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限标识', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      this.form.updateTime = new Date()
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
      edit(this.form).then(res => {
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
        id: '',
        menuUrl: '',
        reportForms: '',
        pid: '',
        businessExplain: '',
        description: '',
      }
    }
  }
}
</script>

<style scoped>

</style>

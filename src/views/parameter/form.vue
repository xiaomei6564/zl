<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="130px">
      <el-form-item label="业务名称" prop="businessName">
        <el-input v-model="form.businessName" />
      </el-form-item>
      <el-form-item label="技术名称" prop="technicalName">
        <el-input v-model="form.technicalName" />
      </el-form-item>
      <el-form-item label="视图路径" prop="viewPath">
        <el-input v-model="form.viewPath" />
      </el-form-item>
      <el-form-item label="查询字段" prop="fields">
        <el-input v-model="form.fields" />
      </el-form-item>
      <el-form-item label="字段描述" prop="fieldDescription">
        <el-input v-model="form.fieldDescription" />
      </el-form-item>
      <el-form-item label="显示类型" prop="displayType">
        <el-select v-model="form.displayType" >
          <el-option v-for="item in dicts"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否默认显示" prop="whetherDisplayDefault">
        <el-select v-model="form.whetherDisplayDefault" >
          <el-option v-for="item in YesOrNO"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="显示顺序" prop="showSorting">
        <el-input v-model="form.showSorting" />
      </el-form-item>
      <el-form-item label="显示类型枚举值" prop="enumName">
        <el-input v-model="form.enumName" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/parameterConfigurationTable'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      default: ()=> {return []}
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        businessName: '',
        technicalName: '',
        viewPath: '',
        fields: '',
        fieldDescription: '',
        displayType: '',
        whetherDisplayDefault: '',
        showSorting: '',
        enumName: '',
      },
      rules: {
        businessName: [{ required: true, message: '请输入', trigger: 'blur' }],
        technicalName: [{ required: true, message: '请输入', trigger: 'blur' }],
        viewPath: [{ required: true, message: '请输入', trigger: 'blur' }],
        fields: [{ required: true, message: '请输入', trigger: 'blur' }],
        fieldDescription: [{ required: true, message: '请输入', trigger: 'blur' }],
        displayType: [{ required: true, message: '请输入', trigger: 'blur' }],
        showSorting: [{ required: true, message: '请输入', trigger: 'blur' }],
        enumName: [{ required: true, message: '请输入', trigger: 'blur' }],
        whetherDisplayDefault: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      YesOrNO: [{
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 0
      }]
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.form.createdBy = this.$store.state.user.user.username
            this.form.creationTime = new Date()
            this.doAdd()
          } else {
            this.form.modifyBy = this.$store.state.user.user.modifyBy
            this.form.modifyTime = new Date()
            this.doEdit()
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
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
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
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
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
        businessName: '',
        technicalName: '',
        viewPath: '',
        fields: '',
        fieldDescription: '',
        displayType: '',
        whetherDisplayDefault: '',
        showSorting: '',
        enumName: ''
      }
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单URL" prop="menuUrl">
        <el-input v-model="form.menuUrl" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="跟踪方案" prop="trackingSolution">
        <el-input v-model="form.trackingSolution" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="所属方案" prop="pid">
        <el-select v-model="form.pid" >
          <el-option v-for="item in pids"
          :key="item.id"
          :label="item.trackingSolution"
          :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="权限标识"  prop='permission'>
        <el-input v-model="form.permission" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="功能" prop="functions">
        <el-input v-model="form.functions" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="使用说明" prop="directionsForUse">
        <el-input v-model="form.directionsForUse" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" style="width: 370px;"/>
      </el-form-item>
      <!-- <el-form-item label="更新时间" >
        <el-date-picker v-model="form.updateTime" type="datetime" style="width: 370px;"/>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/businessExecutionOverview'
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
        trackingSolution: '',
        pid: '',
        functions: '',
        directionsForUse: '',
        updateTime: '',
        permission: ''
      },
      rules: {
        menuUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
        trackingSolution: [{ required: true, message: '请输入', trigger: 'blur' }],
        pid: [{ required: true, message: '请输入', trigger: 'blur' }],
        directionsForUse: [{ required: true, message: '请输入', trigger: 'blur' }],
        functions: [{ required: true, message: '请输入', trigger: 'blur' }],
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.form.updateTime = new Date()
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
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
        trackingSolution: '',
        pid: '',
        functions: '',
        directionsForUse: '',
        updateTime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>

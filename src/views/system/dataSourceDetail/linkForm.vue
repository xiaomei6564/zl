<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="跳转参数配置" width="520px" :loading='loading'>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="数据源技术名">
        <el-input v-model="form.techcode" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="数据源名称">
        <el-input v-model="form.name" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="字段">
        <el-input v-model="form.filed" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="字段名称">
        <el-input v-model="form.filedName" disabled style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="源系统" prop="sourceSystem">
        <el-select v-model="form.sourceSystem" placeholder="请选择">
          <el-option v-for="item in ORIGIN_SYSTEM" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="URL地址" prop="urls">
        <el-input v-model="form.urls" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="参数字段" prop="parameterField">
        <el-input v-model="form.parameterField" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-popover ref="formID" placement="top" width="180">
        <p>此操作将数据源详情，确定要删除吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="$refs.formID.doClose()">取消</el-button>
          <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete">确定</el-button>
        </div>
        <el-button slot="reference" type="danger" style="margin: 0 10px">删除</el-button>
      </el-popover>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { edit, del, list, add } from '@/api/jumpParameters'

export default {
  props: {
    ORIGIN_SYSTEM: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      delLoading: false,
      form: {
        id: '',
        techcode: '',
        filed: '',
        filedName: '',
        sourceSystem: '',
        name: '',
        urls: '',
        parameterField: ''
      },
      rules: {
        showName: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        showSorting: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        widths: [
          { required: true, message: '请输入', trigger: 'blur', type: 'number' }
        ],
        whetherDisplayDefault: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        enumName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        sourceSystem: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        parameterField: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        urls: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    init() {
      this.loading = false
      list({
        filed: this.form.filed,
        techcode: this.form.techcode
      }).then(res => {
        this.loading = true
        let newObj = res || {}
        if (res.id) {
          this.isAdd = false
          if (!newObj.name) delete newObj.name
        } else {
          this.isAdd = true
        }
        delete this.form.id
        this.form = {...newObj, ...this.form}
      })
    },
    cancel() {
      this.resetForm()
    },
    subDelete() {
      this.delLoading = true
      del({
        filed: this.form.filed,
        techcode: this.form.techcode
      }).then(res => {
        this.delLoading = false
        this.$refs['formID'].doClose()
        this.resetForm()
        this.$parent.query.page = 1
        this.$parent.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          offset: 100,
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs['formID'].doClose()
        console.log(err.response.data.message)
      })
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.form.updateTime = new Date()
          this.form.updateName = this.$store.state.user.user.username
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
          offset: 100,
          duration: 2500
        })
        this.loading = false
        this.$parent.query.page = 1
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
          offset: 100,
          duration: 2500
        })
        this.loading = false
        this.$parent.query.page = 1
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
        techcode: '',
        filed: '',
        filedName: '',
        showSorting: '',
        showName: '',
        whetherDisplayDefault: '',
        displayType: '',
        enumName: '',
        status: '',
        parameterField: '',
        urls: ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
</style>

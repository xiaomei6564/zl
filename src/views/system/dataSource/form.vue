<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增数据源' : '编辑数据源'" width="520px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="数据源名称" prop="name">
        <el-input v-model="form.name" style="width: 192.54px;" />
      </el-form-item>
      <el-form-item label="技术名" prop="techcode">
        <el-input v-model="form.techcode" style="width: 192.54px;" :disabled="!isAdd"/>
      </el-form-item>
      <el-form-item label="技术长路径" prop="techcodeLong">
        <el-input v-model="form.techcodeLong" :title="form.techcodeLong" style="width: 370px;" :disabled="!isAdd" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio v-for="item in stateList" :key="item.value" v-model="form.status" :label="item.value">{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item label="所属分类" prop="classificationId">
        <el-select v-model="form.classificationId" placeholder="请选择">
          <el-option v-for="item in classify" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" style="width: 370px;" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="form.descs"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/dataSourceDefine'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    classify: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        name: '',
        techcode: '',
        techcodeLong: '',
        descs: '',
        status: true
      },
      stateList: [{
        label: '启用',
        value: true
      }, {
        label: '禁用',
        value: false
      }],
      rules: {
        name: [
          { required: true, message: '请输入数据源名称', trigger: 'blur' }
        ],
        techcode: [{ required: true, message: '请输入技术名', trigger: 'blur' }],
        techcodeLong: [{ required: true, message: '请输入技术长路径', trigger: 'blur' }],
        status: [{ required: true, message: '请选择', trigger: 'change' }],
        classificationId: [{ required: true, message: '请选择', trigger: 'change' }],
      }
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
          let data = JSON.parse(JSON.stringify(this.form))
          data.classificationId = Number(data.classificationId)
          this.classify.map(item => {
            if (item.value == data.classificationId) {
              return data.classificationName = item.label
            }
          })
          if (this.isAdd) {
            this.doAdd(data)
          } else this.doEdit(data)
        }
      })
    },
    doAdd(data) {
      add(data).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          offset: 100,
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit(data) {
      edit(data).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          offset: 100,
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
        name: '',
        descs: '',
        techcode: '',
        techcodeLong: '',
        status: true,
        classificationId: ''
      }
    }
  }
}
</script>

<style scoped lang='scss'>
  /deep/ .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
</style>

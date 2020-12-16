<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="类型" prop="problemType">
        <el-select v-model="form.problemType" placeholder="请选择">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属分类" prop="subordinateVersion">
        <el-select v-model="form.subordinateVersion" placeholder="请选择">
          <el-option v-for="item in versionList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="problemDesc">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" laceholder="请输入内容" v-model="form.problemDesc" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/systemUpdateLog'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    versionList: {
      type: Array,
      default: () => {return []}
    },
    typeList: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      loading: false, dialog: false, depts: [],
      form: {
        id: '',
        problemType: '',
        problemDesc: '',
        subordinateVersion: ''
      },
      rules: {
        problemType: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        problemDesc: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        subordinateVersion: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      depts: []
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
          this.form.updateName = this.$store.state.user.user.nickname
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
        problemType: '',
        problemDesc: '',
        subordinateVersion: ''
      }
    }
  }
}
</script>

<style scoped>

</style>

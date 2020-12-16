<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <div>
        <div style='display: inline-block'>
          <el-form-item label="品种" prop="wgbez">
            <el-input  v-model="form.wgbez" style="width: 300px;"/>
          </el-form-item>
        </div>
        <div style='display: inline-block'>
          <el-form-item label="SAP编码" prop="matkl">
            <el-input v-model="form.matkl" style="width:235px;margin-left: 3px"/>
            <el-button size="mini" type="warning">校验</el-button>
          </el-form-item>
        </div>
      </div>

      <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item v-if="form.pid !== 0" style="margin-bottom: 0px;" label="上级品种">
        <treeselect v-model="form.pid" :options="depts" style="width: 370px;" placeholder="选择上级类目" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getList } from '@/api/product'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, depts: [],
      form: {
        id: '',
        matkl:'',
        wgbez: '',
        pid: 1,
        enabled: 'true'
      },
      rules: {
        wgbez: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        matkl: [
          { required: true, message: '请输入SAP编码', trigger: 'blur' }
        ]
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
          if (this.form.pid !== undefined) {
            this.loading = true
            this.form.updateName = this.$store.state.user.user.nickname
            this.form.updateTime = new Date()
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            this.$message({
              message: '上级品种不能为空',
              type: 'warning'
            })
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
        wgbez: '',
        matkl: '',
        pid: 1,
        enabled: 'true'
      }
    },
    getDepts() {
      getList({ enabled: 1 }).then(res => {
        this.depts = res.content
      })
    }
  }
}
</script>

<style scoped>

</style>

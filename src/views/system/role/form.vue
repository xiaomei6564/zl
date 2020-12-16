<template>
  <el-dialog :visible.sync="dialog" :close-on-click-modal="false" :before-close="cancel" :title="isAdd ? '新增角色' : '编辑角色'" append-to-body width="520px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" style="width: 125px;"/>
      </el-form-item>
      <el-form-item label="技术标识" prop="permission">
        <el-input v-model="form.permission" :readonly="!isAdd" style="width: 125px;"/>
      </el-form-item>
      <el-form-item label="授权类型">
        <el-select v-model="form.dataScope" style="width: 125px" placeholder="请选择授权类型" @change="changeScope">
          <el-option
            v-for="item in dateScopes"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="级别" prop="sort">
        <el-input-number v-model.number="form.level" :min="1" controls-position="right" style="width: 125px;"/>
      </el-form-item>
      <el-form-item v-if="form.dataScope === '自定义'" label="按组织架构">
        <treeselect v-model="deptIds" :options="depts" multiple style="width: 360px" placeholder="请选择" />
      </el-form-item>
      <el-form-item v-if="form.dataScope === '自定义'" label="按产品线">
        <treeselect v-model="materialGroups" :options="productList" multiple style="width: 360px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.remark" style="width: 360px;" rows="5" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepts } from '@/api/dept'
import { add, edit } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getList } from '@/api/product'

export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [], materialGroups: [], productList: [],
      form: { name: '', depts: [], remark: '', dataScope: '本级', level: 3, permission: '', materialGroups: []},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.form.dataScope === '自定义' && this.deptIds.length === 0 && !this.materialGroups.length) {
        this.$message({
          message: '自定义技术标识不能为空',
          type: 'warning'
        })
      } else {
        this.form.depts = []
        this.form.materialGroups = []

        if (this.form.dataScope === '自定义') {
          for (let i = 0; i < this.deptIds.length; i++) {
            this.form.depts.push({
              id: this.deptIds[i]
            })
          }
          
          for (let i = 0; i < this.materialGroups.length; i++) {
            this.form.materialGroups.push({
              id: this.materialGroups[i]
            })
          }
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            return false
          }
        })
      }
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
      this.form = { name: '', depts: [], remark: '', dataScope: '本级', level: 3, permission: '', materialGroups: [] }
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
      getList({ enabled: 1 }).then(res => {
        this.productList = res.content
      })
    },
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>

<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="上级目录" v-if="form.pid !== 0" prop="pid">
        <treeselect v-model="form.pid" :options="pidArr" :normalizer="normalizer" placeholder="选择上级类目" >
          <!-- <div slot="value-label" slot-scope="{ node }">{{ node }}</div> -->
        </treeselect>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/dataListFunction'
import Treeselect from '@riophae/vue-treeselect'

import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    pidArr: {
      type: Array,
      default: () => {return []}
    }
  },
  components: { Treeselect },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        menuName: '',
        pid: null,
        updateName: '',
        updateTime: ''
      },
      rules: {
        menuName: { required: true, message: '请输入', trigger: 'blur' },
        pid: { required: true, message: '请输入', trigger: 'blur' },
      }
    }
  },
  methods: {
    normalizer(node){
      //去掉children=[]的children属性
      if(node.children && !node.children.length){
          delete node.children;
      }
      return {
        id: node.id,
        label:node.menuName,
        children:node.children
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate(valid => {
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
        menuName: '',
        pid: null,
        updateName: '',
        updateTime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>

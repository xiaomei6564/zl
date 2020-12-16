<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="执行对象" prop="executeObjectName">
        <el-input v-model="form.executeObjectName" />
      </el-form-item>
      <el-form-item label="类型" prop="executeObjectType">
        <el-select v-model="form.executeObjectType" placeholder="请选择">
          <el-option v-for="item in selectObj.EXEC_OBJECT_TYPE" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技术标识" prop="executeObjectId">
        <el-input v-model="form.executeObjectId" />
      </el-form-item>
      <el-form-item label="状态" prop="executeObjectState">
        <el-radio v-for="item in stateList" :key="item.value" v-model="form.executeObjectState" :label="item.value">{{ item.label }}</el-radio>
      </el-form-item>
      <el-form-item label="权限标识">
        <el-input v-model="form.permission" />
      </el-form-item>
      <el-form-item label="权限对象" prop="permissionFieldList">
        <el-select v-model="form.permissionFieldList" multiple placeholder="请选择">
          <el-option v-for="item in selectObj.ACCESS_OBJECTS" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级目录" prop="menuPid">
        <treeselect v-model="form.menuPid" :options="pidArr" :normalizer="normalizer" placeholder="选择上级类目" >
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
import { add, edit, getList } from '@/api/executeObject'
import Treeselect from '@riophae/vue-treeselect'
import initDict from '@/mixins/initDict'

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
  mixins: [initDict],
  components: { Treeselect },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        menuPid: null,
        executeObjectType: '',
        executeObjectId: '',
        executeObjectName: '',
        executeObjectState: '',
        executeStatement: '',
        permission: '',
        permissionFieldName: '',
        updateName: '',
        updateTime: '',
        permissionFieldList: []
      },
      stateList: [{
        label: '启用',
        value: true
      }, {
        label: '禁用',
        value: false
      }],
      rules: {
        menuPid: { required: true, message: '请输入', trigger: 'blur' },
        executeObjectType: { required: true, message: '请输入', trigger: 'blur' },
        executeObjectId: { required: true, message: '请输入', trigger: 'blur' },
        executeObjectName: { required: true, message: '请输入', trigger: 'blur' },
        executeObjectState: { required: true, message: '请输入', trigger: 'blur' },
        executeStatement: { required: true, message: '请输入', trigger: 'blur' },
        permission: { required: true, message: '请输入', trigger: 'blur' },
        permissionFieldList: { required: true, message: '请输入', trigger: 'blur' },
      },
      selectObj: {
        ACCESS_OBJECTS: [],
        EXEC_OBJECT_TYPE: []
      }
    }
  },
  created() {
    // getList({ enabled: 1 }).then(res => {
    //   this.depts = res.content
    // })
    this.dictKey = 'EXEC_OBJECT_TYPE,ACCESS_OBJECTS'
    this.getDictMap(this.dictKey).then(res => {
      this.selectObj = res
    })
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
          this.form.permissionFieldName = this.form.permissionFieldList.join()
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
        menuPid: null,
        executeObjectType: '',
        executeObjectId: '',
        executeObjectName: '',
        executeObjectState: '',
        executeStatement: '',
        permission: '',
        permissionFieldName: '',
        updateName: '',
        updateTime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>

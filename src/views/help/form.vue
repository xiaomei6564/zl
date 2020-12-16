<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="titState ? '帮助信息修改' : (isAdd ? '新增' : '编辑')" 
  :width="titState ? '700px' : '580px'" :class="titState ? 'formTop' : ''">
    <el-form ref="form" :model="form" :rules="rules" size="small" :label-width="titState ? '0px' : '120px'">
      <template v-if="!titState">
        <el-form-item label="业务名称" prop="businessName">
          <el-input v-model="form.businessName" />
        </el-form-item>
        <el-form-item label="技术名称" prop="modelCode">
          <el-input v-model="form.modelCode" />
        </el-form-item>
        <!-- <el-form-item label="report" prop="report">
          <el-input v-model="form.report" />
        </el-form-item> -->
        <!-- <el-form-item label="分类编码" prop="categoryCode">
          <el-input v-model="form.categoryCode" />
        </el-form-item> -->
        <!-- <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" />
        </el-form-item> -->
        <el-form-item label='分类编码' prop="categoryCode">
          <el-select v-model="form.categoryCode" placeholder="请选择">
            <el-option v-for="item in dicts" :key="item.id" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        
        <!-- <el-form-item label="创建人" prop="createdBy" style="width: 50%;display: inline-block">
          <el-input v-model="form.createdBy"  />
        </el-form-item>
        <el-form-item label="创建时间" prop="creationTime" style="display: inline-block">
          <el-date-picker v-model="form.creationTime" type="datetime" />
        </el-form-item> -->
      </template>
      <template v-else>
        <h3>正在编辑 <span style="color: #f9963b">{{form.businessName}}</span> 帮助信息</h3>
        <el-form-item>
          <editor ref="editor" @change="setEditor" />
        </el-form-item>
      </template>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/helpInformationMaintenance'
import editor from '../components/Editor'
export default {
  components: {editor},
  props: {
    isAdd: {
      type: Boolean
    },
    titState: {
      type: Boolean
    },
    dicts: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        businessName: '',
        modelCode: '',
        // report: '',
        categoryCode: '',
        categoryName: '',
        helpInformation: '',
        // createdBy: '',
        // creationTime: ''
      },
      rules: {
        businessName: [{ required: true, message: '请输入', trigger: 'blur' }],
        modelCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        // report: [{ required: true, message: '请输入', trigger: 'blur' }],
        categoryCode: [{ required: true, message: '请输入', trigger: 'change' }],
        categoryName: [{ required: true, message: '请输入', trigger: 'blur' }],
        helpInformation: [{ required: true, message: '请输入', trigger: 'blur' }],
        // createdBy: [{ required: true, message: '请输入', trigger: 'blur' }],
        // creationTime: [{ required: true, message: '请输入', trigger: 'blur' }],
      }
    }
  },
  methods: {
    setEditor(val) {
      this.form.helpInformation = val
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let params = {...this.form};
          if (params.helpInformation) {
            let Base64 = require('js-base64').Base64;
            params.helpInformation = Base64.encode(params.helpInformation)
          }
          if (!this.titState) {
            const index = this.dicts.findIndex(item => item.value === params.categoryCode)
            params.categoryName = this.dicts[index].label
          }
          
          params.createdBy = this.$store.state.user.user.username
          params.creationTime = new Date()
          if (this.isAdd && !this.titState) {
            this.doAdd(params)
          } else this.doEdit(params)
        }
      })
    },
    doAdd(params) {
      add(params).then(res => {
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
    doEdit(params) {
      edit(params).then(res => {
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
      this.form = {
        id: '',
        businessName: '',
        modelCode: '',
        // report: '',
        categoryCode: '',
        categoryName: '',
        helpInformation: '',
        createdBy: '',
        creationTime: ''
      }
      if (this.$refs.editor) {
        this.$refs.editor.setVal('<h5>请输入</h5>')
      } else {
        this.$refs['form'].resetFields();
      }
    }
  },
  watch: {
    'dialog'(val){
      this.$nextTick(() => {
        if (this.form.helpInformation) {
          this.$refs.editor.setVal(this.form.helpInformation)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  .formTop{
    /deep/ .el-dialog__body{
      padding-top: 0;
    }
    h3 {
      font-size: 14px;
      color: #606266;
      margin-bottom: 10px;
    }
  } 
</style>

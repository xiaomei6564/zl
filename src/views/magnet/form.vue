<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" :title="titState ? '帮助信息修改' : (isAdd ? '新增' : '编辑')" 
  :width="titState ? '700px' : '450px'" :class="titState ? 'formTop' : ''">
    <el-form ref="form" :model="form" :rules="rules" size="small" :label-width="titState ? '0px' : '100px'">
      <template v-if="!titState">
        <el-form-item label="技术名" prop='tilesId' >
          <el-input v-model="form.tilesId" placeholder='请输入技术名  如：YYLR（营业利润）' />
        </el-form-item>
        <el-form-item label="名称" prop='tilesDescribe'>
          <el-input v-model="form.tilesDescribe" type="text" placeholder='请输入名称  如：营业利润' :autosize="{ minRows: 2, maxRows: 4}" />
        </el-form-item>
        <el-form-item label="下钻地址" prop='menuUrl'>
          <el-input v-model="form.menuUrl" placeholder='请输入下钻地址' />
        </el-form-item>
        <!--<el-form-item label="图标" prop='icon'>
          <el-input v-model="form.icon" placeholder='请输入图标编码' />
        </el-form-item>-->
        <el-form-item v-show="form.icon!== '2'" label="图标" prop='icon'>
          <el-popover
            placement="bottom-start"
            width="440"
            trigger="click"
            @show="$refs['PanleIconSelect'].reset()">
            <PanleIconSelect ref="PanleIconSelect" @selected="selected" />
            <el-input slot="reference" v-model="form.icon" style="width: 310px;" placeholder="点击选择图标" readonly>
              <i slot="prefix" :class=" 'iconfont '+form.icon" style="height: 32px;width: 16px;" ></i>
              <!--<svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />-->
              <!--<i v-else slot="prefix" class="el-icon-search el-input__icon"/>-->
            </el-input>
          </el-popover>
        </el-form-item>
        <!--<el-form-item label="背景颜色" prop='back'>
          &lt;!&ndash;<el-input v-model="form.back" placeholder='请输入背景颜色' />&ndash;&gt;
          <el-color-picker v-model="form.back">
          </el-color-picker>
        </el-form-item>
        <el-form-item label="图标颜色" prop='color'>
          &lt;!&ndash;<el-input v-model="form.color" placeholder='请输入图标颜色' />&ndash;&gt;
          &lt;!&ndash;<span class="demonstration">无默认值</span>&ndash;&gt;
          <el-color-picker v-model="form.color">
          </el-color-picker>
        </el-form-item>-->

        <div>
          <div style='display: inline-block'>
            <el-form-item label="背景颜色" prop="back">
              <el-color-picker v-model="form.back" style="width: 80px;">
              </el-color-picker>
            </el-form-item>
          </div>
          <div style='display: inline-block'>
            <el-form-item label="图标颜色" prop="color">
              <el-color-picker v-model="form.color" style="width: 85px;margin-left: 3px">
              </el-color-picker>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="单位" prop='unit'>
          <!--<el-input v-model="form.unit" placeholder='请输入数值单位' />-->
          <el-select v-model="form.unit" placeholder="请选择">
            <el-option
              v-for="item in unitList"
              :key="item.label"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属类型" prop='classificationCoding'>
          <el-select v-model="form.classificationCoding" placeholder="请选择">
            <el-option v-for="item in typeArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标可见级别" prop='indicatorVisibilityLevel'>
          <el-select v-model="form.indicatorVisibilityLevel" placeholder="请选择">
            <el-option v-for="item in visibleLevel" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="禁用" style='display: inline-block' prop='whetherDisable'>
          <el-switch v-model="form.whetherDisable" :inactive-value="0" :active-value="1"></el-switch>
        </el-form-item>
        <el-form-item label="新应用标识" style='float: right' prop='stateOldNew'>
          <el-switch v-model="form.stateOldNew" :inactive-value="1" :active-value="1"></el-switch>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item>
          <h3>正在编辑 {{form.tilesDescribe}} 帮助信息</h3>
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
import { add, edit } from '@/api/allApp'
import Treeselect from '@riophae/vue-treeselect'
import PanleIconSelect from '@/components/panleIconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import editor from '../components/Editor'
export default {
  components: { Treeselect, PanleIconSelect, editor },
  props: {
    isAdd: {
      type: Boolean,
    },
    typeArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    unitList: {
      type: Array,
      default: () => {
        return []
      }
    },
    visibleLevel : {
      type: Array,
      default: () => {
        return []
      }
    },
    titState: {
      type: Boolean
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        tilesId: '',
        tilesDescribe: '',
        menuUrl: '',
        icon: '',
        color: '',
        back: '',
        unit: '',
        stateOldNew: 1,
        helpInformation: '',
        classification: '',
        classificationCoding: '',
        whetherDisable: 0,
        creationTime: '',
        indicatorVisibilityLevel: ''
      },
      rules: {
        tilesId: [{ required: true, message: '请输入', trigger: 'blur' }],
        tilesDescribe: [{ required: true, message: '请输入', trigger: 'blur' }],
        menuUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
        color: [{ required: true, message: '请输入', trigger: 'blur' }],
        back: [{ required: true, message: '请输入', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入', trigger: 'blur' }],
        icon: [{ required: true, message: '请输入', trigger: 'blur' }],
        classificationCoding: [{ required: true, message: '请输入', trigger: 'blur' }],
        stateOldNew: [{ required: true, message: '请输入', trigger: 'blur' }],
        whetherDisable: [{ required: true, message: '请输入', trigger: 'blur' }],
        helpInformation: [{ required: true, message: '请输入', trigger: 'blur' }],
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          
          let params = {...this.form};
          if (params.helpInformation) {
            let Base64 = require('js-base64').Base64;
            params.helpInformation = Base64.encode(params.helpInformation)
          } else {
            const index = this.typeArr.findIndex(item =>item.value == params.classificationCoding);
          
            params.classification = this.typeArr[index].label
          }
          params.createdBy = this.$store.state.user.user.username
          params.creationTime = new Date()
          if (this.isAdd && !this.titState) {
            this.doAdd(params)
          } else this.doEdit(params)
        }
      })
    },
    selected(name) {
      //选择
      this.form.icon = name
    },
    doAdd(params) {
      add(params).then(res => {
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
    doEdit(params) {
      edit(params).then(res => {
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
        helpInformation: ''
      }
    }
  },
  watch: {
    'dialog'(val){
      this.$nextTick(() => {
        if (this.form.helpInformation && this.$refs.editor) {
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

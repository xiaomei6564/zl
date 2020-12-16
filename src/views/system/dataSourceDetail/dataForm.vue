<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="字段扩展配置" width="520px" :loading='loading'>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="110px">
      <el-form-item label="数据源技术名">
        <el-input v-model="form.techcode" disabled style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="数据源名称">
        <el-input v-model="form.name" disabled style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="字段">
        <el-input v-model="form.filed" disabled style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="字段名称">
        <el-input v-model="form.filedNames" disabled style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="默认显示顺序" prop="showSorting">
        <el-input-number v-model.number="form.showSorting" :min="0" :max="999" controls-position="right" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="显示名称" prop="showName">
        <el-input v-model="form.showName" style="width: 350px;"/>
      </el-form-item>

      <el-form-item label="日期字段标识" style="display: inline-block">
        <p class="el-pp">
          {{form.dateFieldIdentification == 'X' ? '日期格式' : '非日期格式' }}
        </p>
        <!-- <el-input v-model="form.dateFieldIdentification" style="width: 370px;"/> -->
      </el-form-item>
      <el-form-item label="维度指标标识" style="float: right;margin-right: 20px">
        <p class="el-pp">
          {{form.dimensionIndicatorIdentification == 'K' ? '指标' : '维度'}}
        </p>
        <!-- <el-input v-model="form.dimensionIndicatorIdentification" style="width: 370px;"/> -->
      </el-form-item>
      <el-form-item label="日期格式" :prop="!disabledDate ? '' : 'dateFormat'">
        <el-select v-model="form.dateFormat" placeholder="请选择" :disabled="!disabledDate">
          <el-option v-for="item in DATE_FORMAT" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- <el-input v-model="form.dateFormat" :disabled="!disabledDate" style="width: 370px;"/> -->
      </el-form-item>
      <el-form-item label="数字格式" :prop="!disabledDimension ? '' : 'digitalFormat'" style="display: inline-block">
        <el-select v-model="form.digitalFormat" placeholder="请选择" :disabled="!disabledDimension" style="width: 150px">
          <el-option v-for="item in NUMBER_FORMAT" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- <el-input v-model="form.digitalFormat" :disabled="!disabledDimension" style="width: 370px;"/> -->
      </el-form-item>
      <el-form-item label="小数位" label-width="70px" style="float: right;margin-right: 20px">
        <el-select v-model="form.decimalPlaces" placeholder="请选择" @change="$forceUpdate()" :disabled="!disabledDimension" style="width: 130px">
          <el-option v-for="item in DECIMAL_PLACE" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="列宽" prop="widths">
        <el-input-number v-model.number="form.widths" :min="0" :max="999" controls-position="right" style="width: 350px;" />
      </el-form-item>
      <el-form-item label="字段帮助">
        <el-input v-model="form.explains" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" style="width: 350px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { edit, del, list, add } from '@/api/fieldPropertiesExtension'

export default {
  props: {
    DECIMAL_PLACE: {
      type: Array,
      default: () => {return []}
    },
    NUMBER_FORMAT: {
      type: Array,
      default: () => {return []}
    },
    DATE_FORMAT: {
      type: Array,
      default: () => {return []}
    },
  },
  watch: {
    DECIMAL_PLACE(val) {
      this.xiaoshuArr = val.map(item => {
        item.value = Number(item.value)
        return item;
      })
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
        filedNames: '',
        showSorting: '',
        showName: '',
        dateFieldIdentification: '',
        dimensionIndicatorIdentification: '',
        digitalFormat: '',
        decimalPlaces: '',
        dateFormat: '',
        widths: '',
        explains: '',
        filedType: '',
        filedLength: '',
        decimalPlaces: ''
      },
      isAdd: false,
      disabledDate: true,
      disabledDimension: true,
      rules: {
        showName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        showSorting: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ],
        dateFieldIdentification: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        dimensionIndicatorIdentification: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        digitalFormat: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        explains: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
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
        let data = res 
        if (data.id) {
          this.isAdd = false;
          this.form.dateFormat = data.dateFormat || "yyyy-MM-dd"
          this.form.digitalFormat = data.digitalFormat || "#,###"
          this.form.widths = data.widths || 0
          this.form.explains = data.explains
          this.form.decimalPlaces = data.decimalPlaces == 0 ? 0 : '2'
          this.form.showSorting = data.showSorting || 0
          this.form.showName = data.showName
          this.form.id = data.id
          // this.form.dimensionIndicatorIdentification = data[0].dimensionIndicatorIdentification
          // this.form.dateFieldIdentification = data[0].dateFieldIdentification
        } else {
          this.isAdd = true; delete this.form.id
        }
        // if (!data.widths) this.form.widths = 200
        // if (!data.decimalPlaces && data.dateFieldIdentification == 'K') this.form.decimalPlaces = 2

        this.dateChange()
        this.dimensionChange()
      })
    },
    dimensionChange() {
      if (this.form.dimensionIndicatorIdentification == 'K') {
        this.disabledDimension = true
      } else {
        this.disabledDimension = false
        this.form.digitalFormat = ''
        this.form.decimalPlaces = ''
      }
    },
    dateChange() {
      if (this.form.dateFieldIdentification != 'X') {
        this.disabledDate = false
        this.form.dateFormat = ''
      } else {
        this.disabledDate = true
      }
    },
    cancel() {
      this.resetForm()
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
        filedNames: '',
        showSorting: '',
        showName: '',
        dateFieldIdentification: '',
        dimensionIndicatorIdentification: '',
        digitalFormat: '',
        decimalPlaces: '',
        dateFormat: '',
        widths: '',
        explains: '',
        filedType: '',
        filedLength: '',
        decimalPlaces: ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
  .el-pp {
    background-color: #F5F7FA;
    border-color: #dfe4ed;
    color: #C0C4CC;
    cursor: not-allowed;
    margin: 0;
    padding: 0;
    height: 32px;
    padding: 0 15px;
    border-radius: 4px;
    line-height: 32px;
    width: 100px;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
</style>

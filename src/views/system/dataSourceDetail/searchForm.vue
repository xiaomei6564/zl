<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="查询参数配置" width="520px" :loading='loading'>
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
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
        <el-input v-model="form.filedName" disabled style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="条件显示顺序" prop="showSorting">
        <el-input-number v-model.number="form.showSorting" :min="0" :max="999" controls-position="right" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="条件显示名称" prop="showName">
        <el-input v-model="form.showName" style="width: 350px;"/>
      </el-form-item>
      <el-form-item label="默认条件" style="display: inline-block">
        <el-checkbox v-model="form.whetherDisplayDefault"></el-checkbox>
        <span style="color: red">（是否默认条件显示）</span>
      </el-form-item>
      <el-form-item label="显示帮助" class="shangqu">
        <el-checkbox v-model="form.displayHelp"></el-checkbox>
      </el-form-item>
      <el-form-item label="显示类型" prop="displayType" style="display: inline-block">
        <el-select v-model="form.displayType" placeholder="请选择" @change="typeChange" style="width: 130px">
          <el-option v-for="item in searchType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宽度" prop="widths" class="xiaqu" label-width='50px'>
        <el-input-number v-model.number="form.widths" :min="0" :max="999" controls-position="right" />
      </el-form-item>
      <el-form-item label="枚举值来源" :prop="!disabledType ? 'enumeratedValueSource' : ''" style="display: inline-block">
        <el-select v-model="form.enumeratedValueSource" :disabled="disabledType" @change="clearCode" placeholder="请选择" style="width: 130px">
          <el-option v-for="item in ENUM_SYS" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码" :prop="!disabledType ? 'enumName' : ''" class="xiaqu" label-width='50px'>
        <el-input v-model="form.enumName" :disabled="disabledType" @blur="getSelectList" style="width: 130px;"/>
      </el-form-item>
      <el-form-item label="日期默认值" style="display: inline-block">
        <el-select v-model="form.defaultDate" :disabled="dateType" @change='dataTypeChange' placeholder="请选择" style="width: 130px">
          <el-option v-for="item in filterDate" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="固定" :prop="propGd" class="xiaqu" label-width='50px'>
        <el-date-picker :picker-options="pickerOptions" v-model="form.specifyDate"
                        :disabled="specifyType" style="width: 130px"
                        :type="defaultTime" placeholder="选择日期"></el-date-picker>
      </el-form-item>

      <el-form-item label="下拉框默认值" style="float: left;" class="xiaqu" :prop="!selectDisabledType ? 'cnXlmr' : ''">
        <el-select v-model="form.cnXlmr" :disabled="selectDisabledType" placeholder="请选择" style="width: 130px">
          <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
import { edit, del, initData, add } from '@/api/dataSourceCondition'
import initDict from '@/mixins/initDict'
export default {
  mixins: [initDict],
  props: {
    searchType: {
      type: Array,
      default: () => {return []}
    },
    ENUM_SYS: {
      type: Array,
      default: () => {return []}
    },
    DEFAULT_DATE: {
      type: Array,
      default: () => {return []}
    },
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
        showSorting: '',
        showName: '',
        whetherDisplayDefault: '',
        displayType: '',
        enumName: '',
        status: '',
        widths: '',
        displayHelp: '',
        // 枚举值来源
        enumeratedValueSource: '',
        defaultDate: '',
        specifyDate: '',
        cnXlmr: '', //下拉框默认值
      },
      isAdd: false,
      disabledType: false,
      selectDisabledType: false,
      dateType: false,
      specifyType: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
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
        defaultDate: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        displayType: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        enumeratedValueSource: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        defaultDate: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        specifyDate: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
      },
      selectList: []
    }
  },
  computed: {
    defaultTime() {
      let val = ''
      if (this.form.displayType == 'datetimerangeTime') {
        val = 'datetime'
      } else if (this.form.displayType == 'datetimerange' || this.form.displayType == "dateRadioBox") {
        val = 'date'
      }  else if (this.form.displayType == 'month' || this.form.displayType == 'monthrange') {
        val = 'month'
      }
      return val;
    },
    propGd() {
      let val = ''
      if (!this.specifyType) {
        if (this.form.displayType != 'dateRadioBox' && this.form.displayType != 'monthrange' && this.form.displayType != 'month') {
          val = 'specifyDate'
        }
      }
      return val;
    },
    filterDate() {
      let fn = (item => item.value == 'month_to_today' || item.value == 'year_to_today' || item.value == 'date_to_today' || !item.value);
      if (this.form.displayType == 'month') {
        fn = (item => item.value == 'lastMonth' || item.value == 'yearFristMonth' || item.value == 'customMonth' || item.value == 'currentMonth' || !item.value)
      } else if (this.form.displayType == "monthrange") {
        fn = (item => item.value == 'yearFristToCurrentMonth' || item.value == 'customMonthToCurrentMonth' || !item.value)
      } else if (this.form.displayType == "dateRadioBox") {
        fn = (item => item.value == 'yearFrist' || item.value == 'monthFrist' || item.value == 'lastMonthFrist' || item.value == 'customDate' || !item.value)
      }
      return this.DEFAULT_DATE.filter(fn)
    }
  },
  methods: {
    clearCode() {
      this.form.cnXlmr = ''
      this.form.enumName = ''
      this.selectList = [];
    },
    getSelectList(state) {
      if (state != '干掉') {
        this.form.cnXlmr = ''
      }
      if (!this.form.enumName) {
        this.selectList = [];
        return false;
      }
      if (this.form.enumeratedValueSource == "HANA") {
        this.getHanaDictMap(this.form.enumName).then(res => {
          this.selectList = res[this.form.enumName]
        })
      } else {
        this.getDictMap(this.form.enumName).then(res => {
          this.selectList = res[this.form.enumName]
        })
      }
    },
    dataTypeChange(val) {
      if (val != 'date_to_today' && val != 'customDate' && val != 'customMonthToCurrentMonth' && val != 'customMonth') {
        this.specifyType = true
        this.form.specifyDate = ''
      } else {
        this.specifyType = false
      }
    },
    typeChange(val, state) {
      // 下拉框
      if (val != 'select') {
        if (!state) {
          this.form.cnXlmr = ''
        }
        this.selectDisabledType = true
      } else {
        this.selectDisabledType = false
      }
      // 下拉框及多选框
      if (val != 'select' && val != 'selectMultiple') {
        this.form.enumName = ''
        this.form.enumeratedValueSource = ''
        this.disabledType = true
      } else {
        if (!state) {
          this.form.enumeratedValueSource = "HANA"
        }
        this.disabledType = false
      }
      // 日期范围选择
      if (!state) {
        this.form.defaultDate = ''
        this.form.specifyDate = ''
        this.specifyType = true
      }
      if (val != 'datetimerangeTime' && val != 'datetimerange' && val != "dateRadioBox" && val != 'monthrange' && val != 'month') {
        this.dateType = true

      } else {
        this.dateType = false

      }
    },
    init() {
      this.loading = false
      initData({
        filed: this.form.filed,
        techcode: this.form.techcode
      }).then(res => {
        console.log(res)
        this.loading = true
        if (res.id) {this.form = {...this.form, ...res}; this.isAdd = false}
        else this.isAdd = true; delete this.form.id
        this.typeChange(this.form.displayType, true)
        this.dataTypeChange(this.form.defaultDate)
        this.getSelectList('干掉')
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
        displayHelp: '',
        enumeratedValueSource: '',
        defaultDate: '',
        specifyDate: ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
  .shangqu {
    float: right;
    margin-right: 10px;
  }
  .xiaqu {
    float: right;
    margin-right: 10px;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
</style>

<template>
  <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="另存为" width="500px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size='small'>
      <el-form-item label="报表编码" prop="reportCode">
        <el-input v-model="ruleForm.reportCode" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="报表分类" prop="packageId">
        <el-select v-model="ruleForm.packageId" placeholder="请选择">
          <el-option v-for="item in CUSTOM_TABLE" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="英文名称" prop="enName">
        <el-input v-model="ruleForm.enName" placeholder="请输入"></el-input>
      </el-form-item> -->
      <el-form-item label="中文名称" prop="znName">
        <el-input v-model="ruleForm.znName" placeholder="请输入"></el-input>
      </el-form-item>
      <!-- <el-form-item label="备注">
        <el-input v-model="ruleForm.remark" placeholder="请输入"></el-input>
      </el-form-item> -->
      <el-form-item label="帮助">
        <el-input v-model="ruleForm.help" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button type="primary" size="mini" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { reportCustomizeAdd } from '@/api/visualDesign'
export default {
  props: {
    CUSTOM_TABLE: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      dialog: false,
      ruleForm: {
        id: '',
        reportCode: '',
        sqlContent: '',
        packageId: '',
        packageName: '',
        // enName: '',
        znName: '',
        ownerId: '',
        // remark: '',
        help: '',
      },
      rules: {
        sqlContent: [{ required: true, message: '请输入', trigger: 'blur' }],
        reportCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        packageName: [{ required: true, message: '请输入', trigger: 'blur' }],
        enName: [{ required: true, message: '请输入', trigger: 'blur' }],
        znName: [{ required: true, message: '请输入', trigger: 'blur' }],
        packageId: [{ required: true, message: '请选择', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入', trigger: 'blur' }],
        help: [{ required: true, message: '请输入', trigger: 'blur' }],
      }
    }
  },
  methods: {
    cancel() {
      this.ruleForm = {
        id: '',
        reportCode: '',
        sqlContent: '',
        packageId: '',
        packageName: '',
        enName: '',
        znName: '',
        ownerId: '',
        remark: '',
        help: '',
      }
      this.$refs['ruleForm'].resetFields()
      this.dialog = false
    },
    doSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.ruleForm))
          param.updater = this.$store.state.user.user.nickname
          param.creator = this.$store.state.user.user.nickname
          this.CUSTOM_TABLE.map(item => {
            if (item.value == this.ruleForm.packageId) {
              return param.packageName =  item.label
            }
          })
          param.updateTime = new Date()
          const state = this.$store.state.visualDesign
          param.fields = state.output // 输出属性
          param.ds = []
          state.sourceData.map(item => {
            param.ds.push({
              dsType: item.reportType,
              dsCode: item.reportCode || item.id,
              dsName: item.znName || item.description,
              id: '',
              remark: item.remark,
              help: item.help,
            })
          })
          param.ds[0].wheres = state.lFilterData
          param.ds[1].wheres = state.RFilterData
          param.dsLinks = state.dsLinks
          console.log(param)
          reportCustomizeAdd(param).then(res => {
            this.$store.commit('SET_REPORT_CODE', res)
            this.dialog = false
          })
        }
      })
    }
  }
}
</script>
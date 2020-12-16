<template >
  <div>
    <el-form :inline="true" :model="formSearch">
      <el-form-item size="mini">
        <el-input placeholder="请输入内容" v-model="formSearch.znName" size="mini">
          <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-select v-model="formSearch.reportType" placeholder="请选择" size="mini" @change="init">
          <el-option v-for="item in REPORT_FORMS_TYPE" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="data.content" :row-class-name="tableRowClassName" @row-click='rowClick' ref="singleTable" border size='mini' style="width: 100%">
      <el-table-column prop="znName" label="报表名称"></el-table-column>
      <el-table-column prop="enName" label="技术名称"></el-table-column>
      <el-table-column prop="packageName" label="分类"></el-table-column>
      <el-table-column prop="remark" label="描述"></el-table-column>
    </el-table>
    
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          content: [],
          totalElements: 0
        }
      }
    },
    REPORT_FORMS_TYPE: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      formSearch: {
        znName: '',
        packageId: '',
        reportType: 'All'
      },
      selectData: []
    }
  },
  created() {
    this.setSelect()
  },
  methods: {
    init() {
      let that = this.$parent.$parent.$parent.$parent;
      that.params.znName = this.formSearch.znName
      that.params.reportType = this.formSearch.reportType
      that.init()
    },
    setSelect() {
      this.selectData = this.$store.state.visualDesign.sourceData
    },
    tableRowClassName({row}) {
      const index = this.selectData.findIndex(item => item.id == row.id)
      if (index !== -1) {
        return 'current-row'
      } else {
        return ''
      }
    },
    rowClick(row) {
      this.$store.dispatch('changeSourceData', row)
      this.setSelect()
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
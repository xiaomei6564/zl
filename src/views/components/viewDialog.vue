<template>
  <el-dialog v-el-drag-dialog title="数据详情" :visible.sync="dialogVisible" :append-to-body="true" :before-close="closeDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="642px">
    <el-table :data="selectTable" size="small" border style="width: 100%;" height="600px" stripe>
      <el-table-column property="name" label="名称" show-overflow-tooltip width="150"></el-table-column>
      <el-table-column property="value" label="值" show-overflow-tooltip  width="200"></el-table-column>
      <el-table-column property="content" show-overflow-tooltip label="说明" width="250"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import elDragDialog from '@/directives/el-drag-dialog' // base on element-ui
export default {
  directives: { elDragDialog },
  props: {
    selectTable: Array
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-table--border td {
    border-right: 1px solid #dfe6ec !important;
  }
</style>
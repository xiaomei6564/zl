<template>
  <div>
    <div class="table_tree">
      <div class="head">
        <span>描述</span>
        <span>技术名称</span>
      </div>
      <div class="body">
        <treeNode :data='data' />
      </div>
    </div>
  </div>
</template>
<script>
import treeNode from './treeNode'
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  components: {treeNode},
  methods: {
    
  }
}
</script>
<style scoped lang='scss'>
/deep/ .el-tree-node__content {
  flex: 1;
  .left {
    flex: 1
  }
  .right {
    width: 50%;
  }
}
.table_tree {
  border: 1px solid #dfe6ec;
  font-size: 12px;
  color: #909399;
  line-height: 23px;
  .head {
    display: flex;
    span {
      flex: 1;
      padding: 6px 10px;
      font-weight: bold;
      border-bottom: 1px solid #dfe6ec;
      &:first-child {
        border-right: 1px solid #dfe6ec;
      }
    }
  }
}
</style>
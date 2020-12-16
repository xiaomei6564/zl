<template>
  <list-page :formTools='formTools' :searchParamForm='searchForm' />
</template>

<script>
import listPage from '@/views/components/listPage/'
export default {
  data() {
    return {
      formTools: [{
        name: 'el-icon-view',
        permission: 'purchaseOrder:details'
      },{
        name: 'icon-gongneng',
        permission: 'purchaseOrder:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'purchaseOrder:export'
      }, {
        name: 'icon-dayin',
        permission: 'purchaseOrder:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'purchaseOrder:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'purchaseOrder:collection'
      }, {
        name: 'icon-wenti',
        permission: 'purchaseOrder:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_025', //规则库定义
      },
    }
  },
  components: {listPage},
}
</script>

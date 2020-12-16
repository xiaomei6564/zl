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
        permission: 'purchaseSettlement:details'
      },{
        name: 'icon-gongneng', 
        permission: 'purchaseSettlement:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'purchaseSettlement:export'
      }, {
        name: 'icon-dayin',
        permission: 'purchaseSettlement:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'purchaseSettlement:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'purchaseSettlement:collection'
      }, {
        name: 'icon-wenti',
        permission: 'purchaseSettlement:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_011', //采购结算清单
      },
    }
  },
  components: {listPage},
}
</script>
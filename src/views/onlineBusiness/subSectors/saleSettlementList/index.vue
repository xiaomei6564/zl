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
        permission: 'saleSettlement:details'
      },{
        name: 'icon-gongneng', 
        permission: 'saleSettlement:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'saleSettlement:export'
      }, {
        name: 'icon-dayin',
        permission: 'saleSettlement:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'saleSettlement:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'saleSettlement:collection'
      }, {
        name: 'icon-wenti',
        permission: 'saleSettlement:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_012', //销售结算清单
      },
    }
  },
  components: {listPage},
}
</script>
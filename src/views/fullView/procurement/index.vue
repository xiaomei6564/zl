<template>
  <list-page :formTools='formTools' :searchParamForm='searchForm' urlId='full' />
</template>

<script>
import listPage from '@/views/components/listPage/'
export default {
  data() {
    return {
      formTools: [{
        name: 'el-icon-view',
        permission: 'purchaseContractFullView:details'
      },{
        name: 'icon-gongneng', 
        permission: 'purchaseContractFullView:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'purchaseContractFullView:export'
      }, {
        name: 'icon-dayin',
        permission: 'purchaseContractFullView:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'purchaseContractFullView:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'purchaseContractFullView:collection'
      }, {
        name: 'icon-wenti',
        permission: 'purchaseContractFullView:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_003', //采购执行全貌
      },
    }
  },
  components: {listPage},
}
</script>
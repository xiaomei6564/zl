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
        permission: 'salesContractFullView:details'
      },{
        name: 'icon-gongneng', 
        permission: 'salesContractFullView:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'salesContractFullView:export'
      }, {
        name: 'icon-dayin',
        permission: 'salesContractFullView:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'salesContractFullView:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'salesContractFullView:collection'
      }, {
        name: 'icon-wenti',
        permission: 'salesContractFullView:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_004', //销售执行全貌
      },
    }
  },
  components: {listPage},
}
</script>
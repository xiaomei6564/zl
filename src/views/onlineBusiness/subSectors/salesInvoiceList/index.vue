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
        permission: 'salesInvoice:details'
      },{
        name: 'icon-gongneng', 
        permission: 'salesInvoice:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'salesInvoice:export'
      }, {
        name: 'icon-dayin',
        permission: 'salesInvoice:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'salesInvoice:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'salesInvoice:collection'
      }, {
        name: 'icon-wenti',
        permission: 'salesInvoice:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_014', //销售开票清单
      },
    }
  },
  components: {listPage},
}
</script>
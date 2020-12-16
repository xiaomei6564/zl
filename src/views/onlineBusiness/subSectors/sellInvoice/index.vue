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
        permission: 'salesInvoiceDetails:details'
      },{
        name: 'icon-gongneng', 
        permission: 'salesInvoiceDetails:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'salesInvoiceDetails:export'
      }, {
        name: 'icon-dayin',
        permission: 'salesInvoiceDetails:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'salesInvoiceDetails:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'salesInvoiceDetails:collection'
      }, {
        name: 'icon-wenti',
        permission: 'salesInvoiceDetails:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_015', //销售发票明细清单
      },
    }
  },
  components: {listPage},
}
</script>
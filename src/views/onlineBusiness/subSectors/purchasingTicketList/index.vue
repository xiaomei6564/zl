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
        permission: 'purchasingTicket:details'
      },{
        name: 'icon-gongneng', 
        permission: 'purchasingTicket:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'purchasingTicket:export'
      }, {
        name: 'icon-dayin',
        permission: 'purchasingTicket:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'purchasingTicket:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'purchasingTicket:collection'
      }, {
        name: 'icon-wenti',
        permission: 'purchasingTicket:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_013', //采购货票清单
      },
    }
  },
  components: {listPage},
}
</script>
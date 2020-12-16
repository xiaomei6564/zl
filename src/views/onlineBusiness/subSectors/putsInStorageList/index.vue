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
        permission: 'outboundNotification:details'
      },{
        name: 'icon-gongneng', 
        permission: 'outboundNotification:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'outboundNotification:export'
      }, {
        name: 'icon-dayin',
        permission: 'outboundNotification:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'outboundNotification:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'outboundNotification:collection'
      }, {
        name: 'icon-wenti',
        permission: 'outboundNotification:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_010', //出库通知清单
      },
    }
  },
  components: {listPage},
}
</script>
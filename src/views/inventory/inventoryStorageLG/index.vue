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
        permission: 'receipt:details'
      },{
        name: 'icon-gongneng',
        permission: 'receipt:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'receipt:export'
      }, {
        name: 'icon-dayin',
        permission: 'receipt:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'receipt:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'receipt:collection'
      }, {
        name: 'icon-wenti',
        permission: 'receipt:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_026', //数字化粮库-入库清单-无业管入库单
      },
    }
  },
  components: {listPage},
}
</script>

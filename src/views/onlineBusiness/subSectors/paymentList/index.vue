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
        permission: 'payment:details'
      },{
        name: 'icon-gongneng', 
        permission: 'payment:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'payment:export'
      }, {
        name: 'icon-dayin',
        permission: 'payment:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'payment:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'payment:collection'
      }, {
        name: 'icon-wenti',
        permission: 'payment:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_017', //付款清单
      },
    }
  },
  components: {listPage},
}
</script>
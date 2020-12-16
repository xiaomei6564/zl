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
        permission: 'tradeFeasible:details'
      },{
        name: 'icon-gongneng', 
        permission: 'tradeFeasible:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'tradeFeasible:export'
      }, {
        name: 'icon-dayin',
        permission: 'tradeFeasible:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'tradeFeasible:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'tradeFeasible:collection'
      }, {
        name: 'icon-wenti',
        permission: 'tradeFeasible:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_005', //贸易可研清单
      },
    }
  },
  components: {listPage},
}
</script>
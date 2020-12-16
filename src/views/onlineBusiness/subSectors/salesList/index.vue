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
        permission: 'salesContract:details'
      },{
        name: 'icon-gongneng', 
        permission: 'salesContract:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'salesContract:export'
      }, {
        name: 'icon-dayin',
        permission: 'salesContract:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'salesContract:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'salesContract:collection'
      }, {
        name: 'icon-wenti',
        permission: 'salesContract:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_007', //销售合同清单
      },
    }
  },
  components: {listPage},
}
</script>
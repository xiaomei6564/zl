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
        permission: 'warehousingDetail:details'
      },{
        name: 'icon-gongneng', 
        permission: 'warehousingDetail:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'warehousingDetail:export'
      }, {
        name: 'icon-dayin',
        permission: 'warehousingDetail:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'warehousingDetail:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'warehousingDetail:collection'
      }, {
        name: 'icon-wenti',
        permission: 'warehousingDetail:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_008', //采购入库清单
      },
    }
  },
  components: {listPage},
}
</script>
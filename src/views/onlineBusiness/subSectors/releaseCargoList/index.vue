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
        permission: 'eleaseCargo:details'
      },{
        name: 'icon-gongneng', 
        permission: 'eleaseCargo:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'eleaseCargo:export'
      }, {
        name: 'icon-dayin',
        permission: 'eleaseCargo:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'eleaseCargo:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'eleaseCargo:collection'
      }, {
        name: 'icon-wenti',
        permission: 'eleaseCargo:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_009', //销售发货清单
      },
    }
  },
  components: {listPage},
}
</script>
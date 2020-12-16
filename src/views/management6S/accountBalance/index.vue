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
        permission: 'account:details'
      },{
        name: 'icon-gongneng',
        permission: 'account:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'account:export'
      }, {
        name: 'icon-dayin',
        permission: 'account:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'account:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'account:collection'
      }, {
        name: 'icon-wenti',
        permission: 'account:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_028', //管理6S-科目余额表
      },
    }
  },
  components: {listPage},
}
</script>

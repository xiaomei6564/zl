<template>
  <list-page :formTools='formTools' :searchParamForm='searchForm' urlId='full' />
</template>

<script>
import listPage from '@/views/components/listPage/'
export default {
  data() {
    return {
      formTools: [{
        name: 'el-icon-view',
        permission: 'feasibilityReportFullView:details'
      }, {
        name: 'icon-gongneng', 
        permission: 'feasibilityReportFullView:viewcode'
      }, {
        name: 'icon-xiazai',
        permission: 'feasibilityReportFullView:export'
      }, {
        name: 'icon-dayin',
        permission: 'feasibilityReportFullView:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'feasibilityReportFullView:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'feasibilityReportFullView:collection'
      }, {
        name: 'icon-wenti',
        permission: 'feasibilityReportFullView:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_002', //可研执行全貌
      },
    }
  },
  components: {listPage},
}
</script>
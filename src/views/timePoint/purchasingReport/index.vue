<template>
  <list-page :formTools='formTools' :searchParamForm='searchForm' urlId='time' />
</template>

<script>
  import {monthDay, parseDate} from '@/utils'
  import listPage from '@/views/components/listPage/'
  export default {
    data() {
      return {
        formTools: [{
          name: 'el-icon-view',
          permission: 'purchasingReport:details'
        },{
          name: 'icon-gongneng',
          permission: 'purchasingReport:viewcode'
        },{
          name: 'icon-xiazai',
          permission: 'purchasingReport:export'
        }, {
          name: 'icon-dayin',
          permission: 'purchasingReport:print'
        }, {
          name: 'icon-duanxinfasong',
          permission: 'purchasingReport:snapshot'
        }, {
          name: 'el-icon-copy-document',
          permission: 'purchasingReport:collection'
        }, {
          name: 'icon-wenti',
          permission: 'purchasingReport:help'
        }], //表单工具
        searchForm:{
          viewCode: 'Query_023', // 采购日报
        },
      }
    },
    components: {listPage},
  }
</script>

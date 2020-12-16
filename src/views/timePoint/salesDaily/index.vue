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
          permission: 'salesDaily:details'
        },{
          name: 'icon-gongneng',
          permission: 'salesDaily:viewcode'
        },{
          name: 'icon-xiazai',
          permission: 'salesDaily:export'
        }, {
          name: 'icon-dayin',
          permission: 'salesDaily:print'
        }, {
          name: 'icon-duanxinfasong',
          permission: 'salesDaily:snapshot'
        }, {
          name: 'el-icon-copy-document',
          permission: 'salesDaily:collection'
        }, {
          name: 'icon-wenti',
          permission: 'salesDaily:help'
        }], //表单工具
        searchForm:{
          viewCode: 'Query_022', // 销售日报
        },
      }
    },
    components: {listPage},
  }
</script>

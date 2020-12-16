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
        permission: 'realTimeInventory:details'
      },{
        name: 'icon-gongneng', 
        permission: 'realTimeInventory:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'realTimeInventory:export'
      }, {
        name: 'icon-dayin',
        permission: 'realTimeInventory:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'realTimeInventory:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'realTimeInventory:collection'
      }, {
        name: 'icon-wenti',
        permission: 'realTimeInventory:help'
      }], //表单工具
      searchForm:{
        viewCode: 'Query_001', //实时库存清单
      },
    }
  },
  components: {listPage},
}
</script>
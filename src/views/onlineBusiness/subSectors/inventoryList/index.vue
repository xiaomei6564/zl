<template>
  <list-page :defaultHead='defaultHead' :modelCode='searchForm.viewCode' :tableName='tableName' :formTools='formTools' :searchParamForm='searchForm'
  :condition='condition' :dictKey='dictKey' @formatData='formatData' />
</template>

<script>
import {monthDay, parseDate} from '@/utils'
import listPage from '@/views/components/listPage/'
export default {
  data() {
    return {
      defaultHead: ["EXTVBELN", "PGL1_DES","BUTXT","MAKTX","LGOBE_LONG","CITY_DESC","ZFLAG_DSFCK","CLABS","ZKCCB"],
      tableName: '库存清单',
      formTools: [{
        name: 'icon-gongneng', 
        permission: 'inventory:viewcode'
      },{
        name: 'icon-xiazai',
        permission: 'inventory:export'
      }, {
        name: 'icon-dayin',
        permission: 'inventory:print'
      }, {
        name: 'icon-duanxinfasong',
        permission: 'inventory:snapshot'
      }, {
        name: 'el-icon-copy-document',
        permission: 'inventory:collection'
      }, {
        name: 'icon-wenti'
      }], //表单工具
      searchForm:{
        viewCode: 'DSIM_KCQD_01', //模型编码
        businessUnit: '', //业务单位
        feasibilityStudyReportNo: '', //可研报告号
        purchaseContractNo: '',// 采购合同号
        matnr: '', //品种编码
        matkl: '', //物料组编码
        stockLocation: '',//库存地点
        thirdPartyOutbound: ''// 是否第三方出库
      },
      condition: [
        {key: 'businessUnit', label: '业务单位', type: 'dialog', col: 5},
        {key: 'feasibilityStudyReportNo', label: '可研报告号', type: 'text', col: 5},
        {key: 'purchaseContractNo', label: '采购合同号', type: 'text', col: 5},
        {key: 'searchbtn', label: '  ', type: 'searchbtn', col: 9},
        {key: 'matnr', label: '品种', type: 'newDialog', col: 4},
        {key: 'stockLocation', label: '库存地点', type: 'text', col: 5},
        {key: 'thirdPartyOutbound', label: '是否第三方出库', type: 'radio', col: 5, listName: 'thirdPartyOutbound'},
      ],
      dictKey: ''
    }
  },
  components: {listPage},
  methods: {
    formatData(params) {
      var data = JSON.parse(JSON.stringify(params))
      return data
    }
  }
}
</script>
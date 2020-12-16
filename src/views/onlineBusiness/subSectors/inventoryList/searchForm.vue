<template>
  <div>
    <el-form class="com-search-form" label-position="top" v-show="showSearch">
      <el-row :gutter="20">
        <el-col v-for="(item, index) in condition" :key="index" :span="type=='page'?item.col:12" v-show="index>3?moreSearch: true">
          <el-form-item  :label="item.label" :required="type=='dialog'&&item.type!=='searchbtn'">
            <!--业务单位-->
            <el-input v-if="item.type=='dialog'" v-model="businessName" :placeholder="'输入'+item.label"  suffix-icon="el-icon-more" @focus="openBussiness"></el-input>
            <!--时间类型-->
              <el-date-picker
              v-if="item.type=='datetimerange'"
              v-model="searchForm[item.key]"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>

            <!--时间类型-->
              <el-date-picker
              v-if="item.type=='date'"
              v-model="searchForm[item.key]"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <!--下拉框类型-->
            <el-select  v-if="item.type=='select'" multiple collapse-tags v-model="searchForm[item.key]" :placeholder="'请选择'+item.label" clearable>
              <el-option v-for="item in selectObj[item.listName]"  :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!--输入框类型-->
            <el-input v-if="item.type=='text'" v-model="searchForm[item.key]" :placeholder="'输入'+item.label" ></el-input>
            <!--单选-->
            <el-radio-group v-model="searchForm[item.key]" v-if="item.type=='radio'">
              <el-radio v-for='item in selectObj[item.listName]' :key="item.label" :label="item.label">{{item.labelName}}</el-radio>
            </el-radio-group>
            <!--搜索按钮区域-->
              <div v-if="item.type=='searchbtn'&&type=='page'" class="search-btnbox">
                <el-button class="filter-item" size="mini" type="warning" icon="el-icon-search" @click="searchData(true)">搜索</el-button>
                <div class="more_" @click="moreFn">更多查询项 
                  <i :class="{'el-icon-arrow-down':!moreSearch,'el-icon-arrow-up': moreSearch}"></i>
              </div>
              </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!--选择业务单位-->
    <business-unit ref="businessUnit" @setUnit='seBbusinessUnit'></business-unit>
    <!--<sum-unit ref="sumUnit" />-->
  </div>
</template>

<script>
import businessUnit from './businessUnit'
// import sumUnit from './sumUnit'


// import {getDictMap} from '@/getDictMap'
import initDict from '@/mixins/initDict'

let date = new Date()
var year = date.getFullYear() + "";
var month = (date.getMonth() + 1) + "";
// 本月第一天日期
var beginDate = year + "-" + month + "-01 00:00:00"

export default {
  mixins: [initDict],
  props:{
    showSearch:{
      default: false
    },
    type:{ //page 页面中 dialog 弹框中
      default:'page'
    },
    modelCode: String
  },
  data(){
    return{
       moreSearch: false,
       searchForm:{
        viewCode: this.modelCode, //模型编码
        businessUnit: '', //业务单位
        feasibilityStudyReportNo: '', //可研报告号
        purchaseContractNo: '',// 采购合同号
        varieties: '', //品种
        stockLocation: '',//库存地点
        thirdPartyOutbound: ''// 是否第三方出库
      },
      businessName: '',
      sumName: '',
      //类型type==> dialog 对话框 select: 下拉框 searchbtn：搜索按钮区域 date：日期 vague：远程模糊搜索 text: 普通输入框
      condition:[
        {key: 'businessUnit', label: '业务单位', type: 'dialog', col: 5},
        {key: 'feasibilityStudyReportNo', label: '可研报告号', type: 'text', col: 5},
        {key: 'purchaseContractNo', label: '采购合同号', type: 'text', col: 5},
        {key: 'searchbtn', label: '  ', type: 'searchbtn', col: 9},
        {key: 'varieties', label: '品种', type: 'text', col: 5},
        {key: 'stockLocation', label: '库存地点', type: 'text', col: 5},
        {key: 'thirdPartyOutbound', label: '是否第三方出库', type: 'radio', col: 5, listName: 'thirdPartyOutbound'},

      ],
      //搜索下来框对象
      selectObj:{
        thirdPartyOutbound: [{
          labelName: '是',
          label: 1
        }, {
          labelName: '否',
          label: 0
        }]
      },
      loading:false, //模糊搜索loading
    }
  },
  components:{
    businessUnit
  },
  created() {
    // const reqArr = ''
    // this.getDictMap(reqArr).then(res => {
    //   this.selectObj = res
    // })
    let collectionData = this.$store.state.collectionData, data;
    if (collectionData.queryConditions) {
      data = JSON.parse(collectionData.queryConditions)
      this.searchForm = data
    }
  },
  methods:{
    seBbusinessUnit(treeObj, state) {
      this.searchForm.businessUnit = ''
      this.searchForm.bukrs = ''
      if (treeObj.pid && treeObj.pid !== 1) {
        this.searchForm.bukrs = treeObj.code
      } else {
        this.searchForm.businessUnit = treeObj.code
      }
      this.businessName = treeObj.name
      if (state) return false;
      this.$emit('getData', this.searchForm)
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.selectObj.varieties =[
            {id: 1, name:'品种一'},
            {id: 2, name:'品种二'}
          ]
        }, 200);
      } else {
        this.selectObj.varieties = [];
      }
    },
    moreFn(){ //更多查询项
      this.moreSearch = !this.moreSearch
    },
    openBussiness(){
      this.$refs.businessUnit.showDialog();
    },
    openSum() {
      this.$refs.sumUnit.showDialog();
    },
    searchData() {
      this.$emit('getData', this.searchForm)
    }
  }
}

</script>
<style scoped>
</style>
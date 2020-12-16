<template>
  <div v-loading='loading'>
    <el-form class="com-search-form" label-position="top" :inline='true' v-show="showSearch">
      <template v-for="(item, index) in searchArr">
        <el-form-item v-show="!moreSearch ? index < 4 : true" :key="index" :style="{width: (item.widths / 10 - 1.5) + '%'}">
          <span slot="label">{{item.showName}}
            <template v-if='item.displayHelp'>
              <el-tooltip class="item">
                <div slot="content" class="alertBox">{{item.explains}}</div>
                <i class="icon-wenti iconfont"></i>
              </el-tooltip>
            </template>
          </span>
          <!--业务单位-->
          <el-input v-if="item.displayType=='businessDialog'" v-model="businessName" :placeholder="'输入'+item.showName" suffix-icon="el-icon-more" @focus="openBussiness"></el-input>
          <!--品种-->
          <el-input v-if="item.displayType=='varietiesBounced'" v-model="varietiesName" :placeholder="'输入'+item.showName" suffix-icon="el-icon-more" @focus="openVarieties"></el-input>
          <!--仓库-->
          <el-input v-if="item.displayType=='warehouseBounced'" v-model="warehouseName" :placeholder="'输入'+item.showName" suffix-icon="el-icon-more" @focus="openWarehouse(item.filed)"></el-input>
          <!--日期时间组类型-->
            <el-date-picker
            v-if="item.displayType=='datetimerangeTime'"
            v-model="searchForm[item.filed]"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>

          <!--日期组类型-->
            <el-date-picker
            v-if="item.displayType=='datetimerange'"
            v-model="searchForm[item.filed]"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <!-- 日期类型 -->
          <el-date-picker
            v-if="item.displayType=='dateRadioBox'"
            v-model="searchForm[item.filed]"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <!-- 年月选择器 -->
          <el-date-picker
            v-if="item.displayType=='month'"
            v-model="searchForm[item.filed]"
            type="month"
            value-format="timestamp"
            placeholder="选择年月">
          </el-date-picker>
          <!-- 年月范围选择器 -->
          <el-date-picker
            v-if="item.displayType=='monthrange'"
            v-model="searchForm[item.filed]"
            type="monthrange"
            value-format="timestamp"
            placeholder="选择年月">
          </el-date-picker>

          <!--下拉框类型-->
          <el-select v-if="item.displayType=='select' || item.displayType == 'selectMultiple'" :multiple='item.displayType == "selectMultiple"' collapse-tags
          v-model="searchForm[item.filed]" :placeholder="'请选择'+item.showName">
            <el-option v-for="(item, index) in item.enumeratedValueSource == 'HANA' ? hanaDictMap[item.enumName] : dictMap[item.enumName]"
            :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!--输入框类型-->
          <el-input v-if="item.displayType=='inputText'" v-model="searchForm[item.filed]" :placeholder="'输入'+item.showName" ></el-input>
          <!--搜索按钮区域-->
          <div v-if="item.displayType=='searchbtn'&&type=='page'" class="search-btnbox">
            <el-button class="filter-item" size="mini" type="warning" icon="el-icon-search" @click="searchData(true)">搜索</el-button>
            <div class="more_" @click="moreFn" v-if="searchArr.length > 4">更多查询项
              <i :class="{'el-icon-arrow-down':!moreSearch,'el-icon-arrow-up': moreSearch}"></i>
            </div>
          </div>
        </el-form-item>
      </template>
    </el-form>
    <!--选择业务单位-->
    <business-unit ref="businessUnit" v-if="businessState" @setUnit='seBbusinessUnit'></business-unit>

    <varieties-unit ref="varietiesUnit" v-if="varietiesState" @setUnit='setVarietiesUtil'></varieties-unit>

    <warehouse-unit ref="warehouseUnit" v-if="warehouseState" @setUnit='setWarehouseUtil'></warehouse-unit>
    <!--<sum-unit ref="sumUnit" />-->
  </div>
</template>

<script>
import businessUnit from './businessUnit'
import varietiesUnit from './varietiesUnit'
import warehouseUnit from './warehouseUnit'

import initDict from '@/mixins/initDict'

import { initData } from '@/api/dataSourceCondition'
import {toToday, stringDate, toMonth, toMonthrange, dateRadio} from '@/utils'

export default {
  mixins: [initDict],
  props:{
    showSearch:{
      default: false
    },
    type:{ //page 页面中 dialog 弹框中
      default:'page'
    },
    searchParamForm: {
      default: () => {
        return {}
      }
    },
    conditions: {
      default: () => {return []}
    }
  },
  data(){
    return{
      moreSearch: false,
      businessName: '',
      varietiesName: '',
      warehouseName: '',
      sumName: '',
      //类型type==> dialog 对话框 select: 下拉框 searchbtn：搜索按钮区域 date：日期 vague：远程模糊搜索 text: 普通输入框
      //搜索下来框对象
      searchArr: [],
      loading: false,
      choiceDate: '',
      searchForm: {},
      warehouseState: false,
      varietiesState: false,
      businessState: false
    }
  },
  components:{
    businessUnit, varietiesUnit, warehouseUnit
  },
  created() {
    this.init()
  },
  methods:{
    init() {
      let searchParamForm = this.searchParamForm, hanaDictArr = [], dictArr = [];
      let collectionData = this.$store.state.collectionData //收藏
      let queryConditions = {}
      if (collectionData.queryConditions) {
        queryConditions = JSON.parse(collectionData.queryConditions)
      }
      let searchArr = this.conditions.map(item => {
        if (collectionData.queryConditions) { // 收藏有数据处理
          if (queryConditions[item.filed]) {
            if (item.displayType == 'datetimerange' || item.displayType == 'datetimerangeTime') { //时间
              queryConditions[item.filed] = queryConditions[item.filed].split(',')
              searchParamForm[item.filed] = [stringDate(queryConditions[item.filed][0]), stringDate(queryConditions[item.filed][1])]
            } else if (item.displayType == 'selectMultiple') { // 多选
              searchParamForm[item.filed] = queryConditions[item.filed].split(',')
            } else {
              searchParamForm[item.filed] = queryConditions[item.filed]
            }

          }
        } else {
          searchParamForm[item.filed] = ''

          if (item.displayType == 'datetimerange' || item.displayType == 'datetimerangeTime') {
            if (item.defaultDate == 'month_to_today') { // 本月到今天
              searchParamForm[item.filed] = toToday('month')
            } else if (item.defaultDate == 'year_to_today') { // 本年到今天
              searchParamForm[item.filed] = toToday('year')
            } else if (item.defaultDate == 'date_to_today') {
              searchParamForm[item.filed] = toToday('date', item.specifyDate)
            }
          } else if (item.displayType == 'month') {
            if (item.defaultDate == 'customMonth') { // 自定义月
              searchParamForm[item.filed] = toMonth(item.defaultDate, item.specifyDate)
            } else {
              searchParamForm[item.filed] = toMonth(item.defaultDate)
            }
          } else if (item.displayType == 'monthrange') {
            if (item.defaultDate == 'customMonthToCurrentMonth') {// 自定义月到本月
              searchParamForm[item.filed] = toMonthrange(item.defaultDate, item.specifyDate)
            } else {
              searchParamForm[item.filed] = toMonthrange(item.defaultDate)
            }
          } else if (item.displayType == 'dateRadioBox') {
            if (item.defaultDate == 'customDate') {
              searchParamForm[item.filed] = dateRadio(item.defaultDate, item.specifyDate)
            } else {
              searchParamForm[item.filed] = dateRadio(item.defaultDate)
            }
          }
        }
        if (item.displayType == 'selectMultiple' || item.displayType == 'select') {
          if (item.displayType == 'select' && item.cnXlmr) {
            searchParamForm[item.filed] = item.cnXlmr
          }
          if (item.enumeratedValueSource == 'HANA') {
            hanaDictArr.push(item.enumName)
          } else {
            dictArr.push(item.enumName)
          }
        }
        if (item.displayType == 'businessDialog') {
          this.businessState = true
        }
        if (item.displayType == 'varietiesBounced') {
          this.varietiesState = true
        }
        if (item.displayType == 'warehouseBounced') {
          this.warehouseState = true
        }
        return item
      })
      if (this.conditions.length > 3) {
        searchArr.splice(3, 0, {
          displayType: 'searchbtn',
          widths: 400,
          showName: ' '
        })
      } else {
        searchArr.push({
          displayType: 'searchbtn',
          widths: 400,
          showName: ' '
        })
      }

      this.$set(this, 'searchForm', Object.assign({}, searchParamForm))
      this.$set(this, 'searchArr', searchArr)
      this.getDictMap(dictArr.join())
      this.getHanaDictMap(hanaDictArr.join())
      if (!this.businessState && !this.varietiesState && !this.warehouseState) {
        this.reqData()
      }
    },
    dataView(params) {
      for(let key in params) {
        if (typeof params[key] == 'string' && params[key].indexOf(',') !== -1) {
          params[key] = params[key].split(',')
          if (params[key][0].length === 8 && params[key][1].length === 8) {
            params[key][0] = stringDate(params[key][0])
            params[key][1] = stringDate(params[key][1])
          }
        }
      }
      return params
    },
    setWarehouseUtil(arr, filed) {
      let str = '', name = '';
      arr.map(item => {
        str += ',' + item.WAREHOUSE
        name += ',' + item.LGORT_DESC
      })
      this.searchForm[filed] = str.substring(1)
      this.warehouseName = name.substring(1)

    },
    setVarietiesUtil(treeObj, state) {
      let matkl = '', matnr = '', name = '';
      treeObj.map(item => {
        if (item.pid == 0) {
          name += ',' + item.wgbez
          return matkl += ',' + item.matkl
        }
        if (item.pid == 1) {
          matkl += ',' + item.matkl
        }
        if (item.pid > 1) {
          matnr += ',' + item.matkl
        }
        name += (item.wgbez ? ',' + item.wgbez : ' 无')
      })

      this.searchForm.MATKL = matkl.substring(1)
      this.searchForm.MATNR = matnr.substring(1)
      this.varietiesName = name.substring(1) || ''
      if (state) return false;
      this.reqData()
    },
    seBbusinessUnit(treeObj, state) {
      this.searchForm.PROGL1 = ''
      let nameStr = ''
      const vCode = this.searchForm.viewCode
      if (vCode == 'Query_004' || vCode == 'Query_007' || vCode == 'Query_009' || vCode == 'Query_010' || vCode == 'Query_012' || vCode == 'Query_014' || vCode == 'Query_015') {
        nameStr = 'VKORG'
      } else {
        nameStr = 'BUKRS'
      }

      let code1 = '', code2 = '', name = '';
      treeObj.map(item => {
        if (item.pid == 0) {
          name += ',' + item.name
          return code1 += ',' + item.id
        }
        if (item.pid == 1) {
          code1 += ',' + item.id
        }
        if (item.pid > 1) {
          code2 += ',' + item.id
        }
        name += (item.name ? ',' + item.name: ' 无')
      })

      this.searchForm.PROGL1 = code1.substring(1)
      this.searchForm[nameStr] = code2.substring(1)
      this.businessName = name.substring(1) || ''
      if (state) return false;
      this.reqData()
    },
    reqData() {
      if (this.businessState && !this.businessName) {
        return false;
      }
      if (this.varietiesState && !this.varietiesName) {
        return false;
      }
      this.$emit('getData', this.searchForm)
    },
    moreFn(){ //更多查询项
      this.moreSearch = !this.moreSearch
    },
    openBussiness(){
      this.$refs.businessUnit.showDialog();
    },
    openVarieties() {
      this.$refs.varietiesUnit.showDialog();
    },
    openWarehouse(filed) {
      this.$refs.warehouseUnit.filed = filed
      this.$refs.warehouseUnit.showDialog();
    },
    openSum() {
      this.$refs.sumUnit.showDialog();
    },
    searchData() {

      this.$parent.tableData.size = 20
      this.$parent.tableData.page = 1
      this.$parent.fristData = []
      let state = true
      if (JSON.stringify(this.$route.params) !== '{}') {
        let state = false
      }
      this.$emit('getData', this.searchForm, state)
    }
  }
}

</script>
<style scoped>
.alertBox {
  max-width: 500px;
}
i.iconfont{
  font-size: 16px;
  color: #969696;
  font-weight: normal;
  cursor: pointer;
}
</style>

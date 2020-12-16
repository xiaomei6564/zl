<template>
  <div class="page-purchaseList com-container" v-loading='bigloading' :element-loading-text="loadingText"
    :element-loading-spinner="loadingIcon">
    <!--搜索区域-->
    <div class="com-container-moduler" v-loading='searchLoading'>
      <module-title :name="'条件筛选'" :tools="showSearch?['el-icon-arrow-down']:['el-icon-arrow-up']" @clickTools="showSearchFn"></module-title>
      <searchFormModule :showSearch="showSearch" :searchParamForm='searchParamForm' v-if="conditions.length" :conditions='conditions' ref="searchFormModule" type="page" @getData='getData'></searchFormModule>
    </div>
    <!--表格区域-->
    <div  class="com-container-moduler">
      <module-title :name="this.tabName" :tools="formTools" @clickTools="clickToolsFn" :color-btm='true' print="#printTable"></module-title>
       <!--表单-->
      <div class="com-table">
        <el-table
         v-loading="tableData.loading"
         :data="tableData.data"
         size="small" border
         style="width: 100%;"
         :height="heightTable"
         highlight-current-row
         @row-dblclick='dblRow'
         @current-change="handleCurrentChange"
         ref="tableref"
         id="printJSTable"
         v-if="showTable">
            <template v-for="(item) in tableData.column" >
              <template v-if="item.urls">
                <el-table-column :fixed='fixedState' :width="item.widths" :label="item.showName" :key="item.ID" show-overflow-tooltip>
                  <span slot-scope="scope" :style="linkStyle(item, scope.row)" @click="goNext(item, scope.row)">
                    {{scope.row[item.filed]}}
                  </span>
                </el-table-column>
              </template>
              <template v-else>
                <el-table-column :width="item.widths" :label="item.showName" :key="item.ID" :sort-method="(a, b) => sortMethod(a, b, item.filed)"
                   sortable show-overflow-tooltip :prop="item.filed">
                </el-table-column>
              </template>
            </template>
          <!-- </template> -->
        </el-table>
        <!--分页组件-->
        <el-pagination
          :total="tableData.totals"
          :current-page="tableData.page"
          :page-size="tableData.size"
          style="margin-top: 8px;"
          layout="total, prev, pager, next, sizes"
          :page-sizes="[20, 50, 100, 500, 1000]"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </div>
    </div>
    <!--收藏-->
    <collection ref="collection"></collection>
    <!-- 配置列表字段 -->
    <!-- <field-config ref="fieldConfig" :source-left="unColumn" :target-right="tableData.column" @changeValue='changeHead'></field-config> -->
    <form-head ref="formHead" :source-left="unColumn" :target-right="tableData.column" @changeValue='changeHead' />
    <!--任务设定-->
    <task-setting ref="taskSetting"></task-setting>
    <!-- 帮助信息 -->
    <infoTip ref="infoTip" :content="helpInfo"></infoTip>
    <view-dialog ref="view" :select-table='selectTable' />

  </div>
</template>

<script>
import checkPermission from '@/utils/permission'

import moduleTitle from '@/views/components/ModuleTitle.vue'; //模块标题
import searchFormModule from './searchForm'; //搜索区域
// import fieldConfig from '@/views/components/fieldConfig';
import formHead from './formHead';

import taskSetting from './taskSetting';
import collection from '@/views/components/CollectionDialog'; //收藏弹框
import infoTip from '@/views/components/InfoTip' //信息提示弹框
import {
  downloadBusiness, getBusinessExecution, fullviewcode, // full
  downloadtimePoint, getTimePointData, timeviewcode, // time
  downloadPurchase, getPurchaseContract, viewcode, // link
  merge
} from '@/api/subSectors'
import { downloadFile } from '@/utils/index'
import { helpMsg } from '@/api/helpInformationMaintenance'
import viewDialog from '@/views/components/viewDialog'

import { parseDate, parseMonth } from '@/utils'
import printJs from 'print-js'
export default {
  props: {
    formTools: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchParamForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    urlId: {
      type: String,
      default: 'link'
    },
  },
  data(){
    return {
      showSearch: true, //搜索区域展示隐藏
      tableData:{ //表格数据
        loading: false, //表格加载
        column:[], //表头
        data:[], //数据
        totals: 0 , //数据总数
        page: 1,
        size: 20,
      },
      tabName: this.$route.query.name || this.$store.state.tagsView.showTitle,
      unColumn: [], //未选择的表头
      params: {},
      showTable: true,
      helpInfo: '',
      currentRow: null,
      allHead: [],
      selectTable: [],
      paramsState: true,
      formData: this.searchParamForm,
      conditions: [],
      searchLoading: false,
      bigloading: false,
      loadingText: '',
      loadingIcon: 'el-icon-loading',
      fixedState: false,
      heightTable: 'calc(100vh - 395px)',
      aggregation: '',
      fristData: [],
      fristTotals: 0
    }
  },
  components:{
    moduleTitle,
    searchFormModule,
    formHead,
    taskSetting,
    collection,
    viewDialog,
    infoTip
  },
  created() {
    this.init()
  },
  destroyed() {
    this.$store.dispatch('remData')
  },
  computed: {
    linkStyle() {
      return (item, row) => {
        let state = false
        if (item.urls) {
          if (item.sourceSystem == '3') { // 老业管
            if (row.ZLOGSYS == 'NCTBMS') {
              state = true
            }
          } else if (item.sourceSystem == '5') { //本系统
            state = true
          }
        }
        if (state) {
          return 'text-decoration: underline;cursor: pointer;color: #0026ff;'
        } else {
          return ''
        }
      }
    }
  },
  methods:{
    sortMethod(a, b, key) {
      let newA = a[key], newB = b[key];
      if (typeof a[key] === 'string') {
        newA = Number(a[key].replace(/\,/g, ''))
        if (isNaN(newA)) {
          newA = Number(a[key].replace(/\,/g, '').replace(/\-/g, ''))
        }
      }
      if (typeof b[key] === 'string') {
        newB = Number(b[key].replace(/\,/g, ''))
        if (isNaN(newB)) {
          newB = Number(b[key].replace(/\,/g, '').replace(/\-/g, ''))
        }
      }
      if (newA > newB) {
        return 1
      } else if (newA < newB) {
        return -1
      } else {
        return 0
      }
    },
    watchTable() {
      this.$nextTick(() => {
        let dom = this.$refs.tableref.$el
        if (dom.querySelector('table').clientWidth > dom.clientWidth + 50) {
          this.fixedState = true
        }

        this.$refs['tableref'].doLayout()
      })
    },

    init() {
      this.searchLoading = true
      merge({viewCode: this.searchParamForm.viewCode}).then(res => {
        this.searchLoading = false
        this.conditions = res.conditions
        this.allHead = res.extension
        // 默认头数据
        var selectHead = [], unSelsectHead = [];

        let collectionData = this.$store.state.collectionData, headArr = []; // 收藏
        // 聚合收藏
        let aggregation = []
        if (collectionData.aggregateType) {
          this.aggregation = collectionData.aggregateType
          aggregation = JSON.parse(collectionData.aggregateType)
        }

        if (collectionData.fieldCode) {
          headArr = collectionData.fieldCode.split(',')
        }
        if (headArr.length) {
          headArr.map(it => {
            res.extension.map(item => {
              if (it === item.filed) {
                if (aggregation.length) {
                  aggregation.map(its => {
                    if (its.filed == it) {
                      item.type = its.type
                    }
                  })
                }
                selectHead.push(item)
              } else {
                unSelsectHead.push(item)
              }
            })
          })
        }
        res.extension.map(item => {
          res.jump.map(it => {
            if (item.filed === it.filed) {
              item.urls = it.urls
              item.parameterField = it.parameterField
              item.sourceSystem = it.sourceSystem
            }
          })
          if (!headArr.length) {
            if (item.showSorting) {
              selectHead.push(item)
            } else {
              unSelsectHead.push(item)
            }
          }

        })

        this.tableData.column = selectHead
        this.unColumn = unSelsectHead



        helpMsg({modelCode: this.searchParamForm.viewCode}).then(res => {
          if (res.content.length && res.content[0].children.length) this.helpInfo = res.content[0].children[0].helpInformation
        })
      })

    },
    dblRow(row) {
      this.openView()
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    openView() {
      if (!this.currentRow) {
        return this.$message.warning('请选择一行！')
      }
      let arr = [];
      this.allHead.map(item => {
        for (let key in this.currentRow) {
          if (item.filed == key) {
            arr.push({
              name: item.showName,
              value: this.currentRow[key],
              content: item.explains
            })
          }
        }
      })
      this.selectTable = arr
      this.$refs.view.dialogVisible = true
    },
    goNext(row, res) {
      if (row.sourceSystem == '3') {
        if (row.urls && res.ZLOGSYS == "NCTBMS") {
          window.open(row.urls + res[row.parameterField], '_blank')
        }
      } else if (row.sourceSystem == '5') {
        this.$router.push({
          name: row.urls,
          params: {
            [row.parameterField]: res[row.parameterField]
          }
        })
      }

    },
    showSearchFn(){
      this.showSearch = !this.showSearch
    },
    clickToolsFn(key){ //工具点击事件
      switch(key){
        case 'el-icon-view':
          this.openView()
          break;
        case 'icon-gongneng': //显示字段配置
          this.openFormHead()
          break;
        case 'icon-xiazai': //下载
          this.$confirm('系统准备下载当前查询范围内的全部数据，可能需要一点时间，确认吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.download();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
          break;
        case 'icon-duanxinfasong': //定时任务
          this.openTaskSetting();
          break;
        case 'el-icon-copy-document': //收藏
          this.openCollection()
          break;
        case 'icon-wenti': //信息
          this.$refs.infoTip.dialogVisible = true
          break;
        case 'icon-dayin':
          // console.log(this.$refs.tableref.$el)
          // this.$print(this.$refs.tableref.$el);
          // const style = '@page { margin-top: 400px } @media print { table {color: red} }'
          printJs({ printable: 'printJSTable', type: 'html', style: 'table td{word-break:break-all}', scanStyles: false})
      }
    },
    changeHead(right, aggregation) {
      if (aggregation.length) {
        this.aggregation = JSON.stringify(aggregation)
        this.tableData.page = 1
        this.tableData.size = 20
        this.tableData.column = right
        this.showTable = false
        setTimeout(() => {
          this.showTable = true
        }, 200)
        this.getData(this.params)
        return;
      }
      this.aggregation = ''
      this.showTable = false
      this.tableData.column = right
      this.tableData.data = JSON.parse(JSON.stringify(this.fristData))
      this.tableData.totals = this.fristTotals
      setTimeout(() => {
        this.showTable = true
        this.$nextTick(() => {
          this.watchTable()
          // this.tableData.loading = false
          // this.$refs['tableref'].doLayout()
        })
      }, 500)

    },
    formatData(data) {
      let params = JSON.parse(JSON.stringify(data))
      if (this.aggregation) params.aggregation = this.aggregation
      console.log(params)
      for(let key in params) {
        if (Object.prototype.toString.call(params[key]) === '[object Array]') {
          if (params[key].length) {
            if (!isNaN(Date.parse(params[key][0])) ) {
              if (params[key][0].length > 20) {
                //日期
                params[key][0] = parseDate(params[key][0])
                params[key][1] = parseDate(params[key][1])
                params[key] = params[key].join()
              }
            } else {
              if (params[key][0].toString().length == 13 && typeof params[key][0] == 'number') {
                params[key][0] = parseMonth(params[key][0])
                params[key][1] = parseMonth(params[key][1])
                params[key] = params[key].join()
              } else {
                //下拉框多选
                params[key] = params[key].join()
              }
            }
          } else {
            params[key] = ''
          }
        } else {

          if (!params[key]) {
            params[key] = ''
          } else {
            if (!isNaN(Date.parse(params[key])) && params[key].length > 20) {
              //日期
              params[key] = parseDate(params[key])
            }
            if (params[key].toString().length == 13 && typeof params[key] == 'number') {
              params[key] = parseMonth(params[key])
            }
          }

        }
      }
      params.size = this.tableData.size
      params.page = this.tableData.page
      return params
    },
    getData(params, state){

      if (JSON.stringify(this.$route.params) !== '{}' && !state) {
        this.params = this.$route.params
        this.params.viewCode = this.searchParamForm.viewCode
        if (typeof params.PROGL1 == 'string') {
          this.params.PROGL1 = params.PROGL1
        }
        if (typeof params.BUKRS == 'string') {
          this.params.BUKRS = params.BUKRS
        }
        if (typeof params.VKORG == 'string') {
          this.params.VKORG = params.VKORG
        }
        if (typeof params.MATKL == 'string') {
          this.params.MATKL = params.MATKL
        }
        if (typeof params.MATNR == 'string') {
          this.params.MATNR = params.MATNR
        }
        this.params.jump = true
        this.params.size = this.tableData.size
        this.params.page = this.tableData.page
      } else {
        console.log(params)
        this.params = this.formatData(params)
      }

      this.tableData.loading = true
      let url = this.urlId == 'full' ? getBusinessExecution : this.urlId == 'time' ? getTimePointData : getPurchaseContract;
      url(this.params).then(res => {
        this.tableData.data = res.content
        this.tableData.totals = res.totalElements
        if (!this.fristData.length) {
          this.fristTotals = res.totalElements
          this.fristData = res.content
        }
        this.tableData.loading = false
        this.showTable = true
        this.$nextTick(() => {
          this.watchTable()
        })
      }).catch(err => {
        console.log(err)
        this.tableData.loading = false
      })
    },
    // 改变条数
    sizeChange(val) {
      this.tableData.page = 1;
      this.tableData.size = val;
      this.getData(this.params);
    },
    // 改变页数
    pageChange(val) {
      this.tableData.page = val;
      this.getData(this.params);
    },
    // 导出
    download() {
      this.loadingText = '正在请求数据中'
      this.bigloading = true
      let url = this.urlId == 'full' ? downloadBusiness : this.urlId == 'time' ? downloadtimePoint : downloadPurchase;
      this.params.download = this.tableData.column.map(item => item.filed).join(',')
      url(this.params).then(result => {
        this.bigloading = false
        downloadFile(result, this.tabName, 'xlsx')
      })
    },
    openFormHead(){ //打开配置字段弹框
      let _this = this.$refs.formHead
      if (!_this.leftAllData.length && !_this.rightData.length) {
        const unArr = JSON.parse(JSON.stringify(this.unColumn)).map(item => {
          item.id = item.id + 'wy'
          return item
        })
        const arr = JSON.parse(JSON.stringify(this.tableData.column)).map(item => {
          item.id = item.id + 'wy'
          return item
        })
        _this.leftAllData = unArr
        _this.rightData = arr
      }
      _this.dialogVisible = true
    },
    //打开收藏弹框
    openCollection(){
      let data = JSON.parse(JSON.stringify(this.$refs.searchFormModule.searchForm))
      let params = {
        name: this.tabName,
        menuUrl: this.$route.fullPath,
        queryConditions: JSON.stringify(this.formatData(data)),
        fieldCode: this.tableData.column.map(item=>item.filed).join(),
        aggregateType: this.aggregation
      }
      this.$refs.collection.showDialog(params)
    },
    //打开定时任务
    openTaskSetting(){
      this.$refs.taskSetting.showDialog()
    }
  }
}

</script>
<style>
@media print {
    #printJSTable {
      background: red;
    }
  }
</style>

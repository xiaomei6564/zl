<template>
  <div class="box" style="background: #f8f8f8">
    <div class="com-container-moduler">
      <module-title :name="'设计'" :tools="unfold == 'design' ? ['el-icon-arrow-down'] : ['el-icon-arrow-up']" @clickTools="unfold = 'design'"></module-title>
      <div class="box design" v-show="unfold == 'design'">
        <vue-splitpane :min-percent='30' :default-percent='70' split="vertical" style="height: calc(100% - 36px)">
          <div class="left" slot="paneL">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>设计画板</span>
                <el-button class="foRight" @click="openReportForm" type="primary" icon="el-icon-plus"></el-button>
                <!-- <el-button type="danger" class="foRight" @click="delData" style="margin-right: 10px" icon="el-icon-delete" circle></el-button> -->
              </div>
              <designDom v-loading='designDomLoading' :DS_JIONTYPE='dictMap.DS_JIONTYPE' :DS_ON_SYMBOL='dictMap.DS_ON_SYMBOL' :listLeft='listLeft' :listRight='listRight' />
            </el-card>
          </div>
          <div class="right" slot="paneR">
            <el-card class="box-card noPad" style="margin-bottom: 10px">
              <div slot="header" class="clearfix">
                <span>输出</span>
                <el-button type="danger" class="foRight" style="margin-left: 10px" @click="delOutPut" icon="el-icon-delete" circle></el-button>
                <!-- <el-button type="primary" class="foRight" @click="indexOutPut(1)" icon="el-icon-bottom" circle></el-button>
                <el-button type="primary" class="foRight" @click="indexOutPut(-1)" icon="el-icon-caret-top" circle></el-button> -->
                <!-- <i class="el-icon-top"></i> -->
                <i class="el-icon-caret-top" @click="indexOutPut(-1)"></i>
                <i class="el-icon-caret-bottom" style="fon" @click="indexOutPut(1)"></i>
                <!-- <i class="el-icon-bottom"></i> -->
              </div>
              <treeNode :data="classify" class="scrollDOM" :moreSelect='true' />
            </el-card>
            <el-card class="box-card noPad">
              <div slot="header" class="clearfix">
                <span>属性</span>
              </div>
              <property class="scrollDOM" :FIELD_ORDER='dictMap.FIELD_ORDER' />
            </el-card>
          </div>
        </vue-splitpane>
        <div class="bottom" >
          <el-button class="foRight" @click="save" type="primary">另存为查询</el-button>
        </div>
      </div>
    </div>
    <div class="com-container-moduler">
      <module-title :name="'预览'" :tools="unfold == 'preview' ? ['el-icon-arrow-down'] : ['el-icon-arrow-up']" @clickTools="unfold = 'preview'"></module-title>
      <div class="box" v-show="unfold == 'preview'">
        <temTable />
      </div>
    </div>
    <div class="com-container-moduler">
      <module-title :name="'SQL 模式'" :tools="unfold == 'sql' ? ['el-icon-arrow-down'] : ['el-icon-arrow-up']" @clickTools="unfold = 'sql'"></module-title>
      <div v-if='unfold == "sql"' class="sql box">
        <div class="left">
          <el-card class="box-card noPad">
            <div slot="header" class="clearfix">
              <span>SQL 模式</span>
            </div>
            <div class="sql_box" style="border-bottom: 1px solid #e4e7ed">
              <code-mirror ref="codeMirror" :styles="{width: 'auto', height: 'calc(100vh - 396px)'}"  />
              <el-button style="float: right;margin: 10px" size="mini" @click="read(false)" v-if="readSatae" type="primary">专家模式</el-button>
              <template v-else>
                <el-button style="float: right;margin: 10px" size="mini" @click="emitSql" type="warning">保存</el-button>
                <el-button style="float: right;margin: 10px" size="mini" @click="read(true)" type="primary">返回</el-button>
              </template>
            </div>
          </el-card>
        </div>
        <div class="right">
          <el-card class="box-card noPad">
            <div slot="header" class="clearfix">
              <span>数据源</span>
              <el-button style="float: right;padding: 5px" @click="openReportForm" type="primary" icon="el-icon-plus"></el-button>
            </div>
            <designData />
          </el-card>
        </div>
      </div>
    </div>
    <report-form ref="reportForm" :REPORT_FORMS_TYPE='dictMap.REPORT_FORMS_TYPE' />
    <reportCustomize ref="reportCustomize" :CUSTOM_TABLE='dictMap.CUSTOM_TABLE' />
  </div>
</template>
<script>
import moduleTitle from '@/views/components/ModuleTitle.vue'; //模块标题
import reportForm from './reportForm'
import property from './property'
import { fieldList } from '@/api/visualDesign'
import designDom from './designDom'
import treeNode from './treeNode'
import codeMirror from '@/views/components/codemirror'
import designData from './designData'
import axios from 'axios'
import initDict from '@/mixins/initDict'
import reportCustomize from './reportCustomize'
import temTable from './temTable'
import vueSplitpane from 'vue-splitpane'

export default {
  components: {moduleTitle, reportForm, property, designDom, treeNode, codeMirror, designData, reportCustomize, temTable, vueSplitpane},
  mixins: [initDict],
  data() {
    return {
      unfold: 'design',
      classify: [{
        description: 'columns',
        children: []
      }],
      listLeft: [],
      listRight: [],
      designDomLoading: false,
      readSatae: true
    }
  },
  created() {
    this.getList()
    this.getDictMap('DS_ON_SYMBOL,CUSTOM_TABLE,FIELD_ORDER,REPORT_FORMS_TYPE,DS_JIONTYPE')
  },
  destroyed() {
    this.$store.commit('CLEAR_ALL')
  },
  watch: {
    unfold() {
      if (this.unfold == 'sql') {
        this.$nextTick(() => {
          this.setValue()
        })
      }
    },
    '$store.state.visualDesign.output'(val) {
      this.classify[0].children = val
    }
  },
  methods: {
    delData() {
      this.$store.commit('CLEAR_ALL')
    },
    indexOutPut(num) {
      const propertyIndex = this.$store.state.visualDesign.propertyIndex
      if (typeof propertyIndex === 'number') {
        this.$store.commit('INDEX_OUTPUT', num)
      } else {
        this.$message.warning('请选择一行！')
      }
    },
    delOutPut() {
      const propertyIndex = this.$store.state.visualDesign.propertyIndex
      if (typeof propertyIndex === 'number') {
        this.$store.commit('DEL_OUTPUT', propertyIndex)
      } else {
        this.$message.warning('请选择一行！')
      }
    },
    save() {
      this.$refs.reportCustomize.dialog = true
    },
    getList() {
      const arr = this.$store.state.visualDesign.sourceData
      if (arr.length == 2) {
        this.designDomLoading = true
        axios.all([
          fieldList({dsType: arr[0].reportType, dsCode: arr[0].reportCode || arr[0].id}),
          fieldList({dsType: arr[1].reportType, dsCode: arr[1].reportCode || arr[1].id})
        ]).then(axios.spread((res, res2) => {
          this.listLeft = res
          this.listRight = res2
          this.$store.commit('SetReqSourceData', {left: res, right: res2})
          this.designDomLoading = false
        }))
      } else {
        // this.$nextTick(()=> {
        //   this.openReportForm()
        // })
      }
    },
    openReportForm() {
      this.$refs.reportForm.dialog = true
    },
    setValue() {
      this.$refs.codeMirror.setValue(`SELECT 
    "name",
    "value",
    "city",
    "age",
    "..."
  FROM "xxxx"
  WHERE name LIKE "%付%"`)
    },
    read(state) {
      this.$refs.codeMirror.setRead(state)
      this.readSatae = state
    },
    emitSql() {

    },
    init() {

    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
  .box {
    padding: 10px;
  }
  .design {
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
    height: calc(100vh - 305px);
    width:100%;
    .left {
      width: 100%;
      height: 100%;
      .box-card {
        height: 100%;
        overflow-y: scroll;
      }
    }
    .right {
      width: 100%;
      height: 100%;
      .clearfix {
        .el-icon-caret-bottom, .el-icon-caret-top, .el-icon-top, .el-icon-bottom {
          float: right;
          font-size: 30px;
          color: #999;
        }
      }
      .box-card {
        height: calc(50% - 5px);
      }
    }
    .bottom {
      width: 100%;
      margin: 10px 0;
      overflow: hidden;
    }
    .el-card__header {
      padding: 10px;
      line-height: 26px;
      font-size: 13px;
    }
    .foRight {
      float: right;
      padding: 5px
    }
  }
  .noPad {
    .el-card__body {
      padding: 0;
    }
  }
  .sql {
    display: flex;
    justify-content: space-between;
    .left {
      width: calc(75% - 5px);
      .box-card {
        height: calc(100vh - 296px);
        overflow-y: scroll;
      }
    }
    .right {
      width: calc(25% - 5px);
      .box-card {
        height: calc(100vh - 296px) ;
      }
    }
    .el-card__header {
      padding: 10px;
      line-height: 26px;
      font-size: 13px;
    }
  }
  .scrollDOM {
    height: calc((100vh - 440px) / 2) ;
    overflow-y: scroll;
  }
</style>
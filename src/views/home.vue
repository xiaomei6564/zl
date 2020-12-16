<template>
  <div class="page-home">
    <div class="page-home-container">
      <!--磁贴区域-->
      <panel-group v-if="reFresh" :panpels="panpels" :type="type" :add="true" @openInfoTip="openInfoTip" @openAdd="openAddFn"/>
      <!--echart 区域-->
     <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8">
          <div class="chart-wrapper">
            <module-title :name="qstList.length ? qstList[0].businessName : ''" num='0' :tools="['icon-gongneng', 'icon-wenti']" @clickTools="clickTools"></module-title>
            <bar-chart ref="barChart" />
          </div>
        </el-col>
         <el-col :xs="24" :sm="12" :lg="8">
          <div class="chart-wrapper">
            <module-title :name="qstList.length ? qstList[1].businessName : ''" num='1' :tools="['icon-gongneng', 'icon-wenti']" @clickTools="clickTools" ></module-title>
             <!--<pie-chart/>-->
            <bar-chart2 ref="barChart2" />
          </div>
        </el-col>
         <el-col :xs="24" :sm="12" :lg="8">
          <div class="chart-wrapper">
            <module-title :name="qstList.length ? qstList[2].businessName : ''" num='2' :tools="['icon-gongneng', 'icon-wenti']" @clickTools="clickTools" ></module-title>
            <line-chart ref="lineChart"/>
          </div>
        </el-col>
     </el-row>
     <!--底部内容-->
     <div class="info-box">
      <module-title :name="'了解如何使用数据中心'" :tools="'[]'"></module-title>
      <el-row :gutter="0" class="info-con">
        <el-col :xs="8" :sm="8" :lg="8" v-for="(item, index) in infoList" :key="index" class="info-item">
           <div class="left-con">
              <div class="name" :title="item.title">{{item.title}}</div>
              <div class="info" :title="item.info">
                <template v-if="index == 1">
                  {{item.info.substring(0, 13)}}
                  <a :href="xlsxpathUrl" style="text-decoration:underline" download="数据来源和帮助手册">{{item.info.substring(13, 23)}}</a>
                  {{item.info.substring(23)}}
                </template>
                <template v-else>
                  {{item.info}}
                  <a v-if="!index" :href="videopathUrl" style="text-decoration:underline" download="用户操作手册" target="_blank">下载用户操作手册</a>
                </template>
                
              </div>
           </div>
           <div class="right-con">
             <img :src="item.img" alt="" @click="openVideo(index)">
           </div>
        </el-col>
     </el-row>
     </div>
    </div>
    <!--信息提示框-->
    <infoTip ref="infoTip" :title-head='infoTip.titleHead' :title="infoTip.title" width='550px' :content="infoTip.content"></infoTip>
    <!--添加应用-->
    <addApply ref="addApply"></addApply>
    <videoMp4 ref='videoMp4' />
    <!-- <el-dialog
      title="提示"
      :visible.sync="dialogVideo"
      :show-close="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="addApply-box com-dialog"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVideo = false">取 消</el-button>
        <el-button type="primary" @click="dialogVideo = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import panelGroup from './home/PanelGroup' //磁贴
// import { count } from '@/api/visits'
import moduleTitle from './components/ModuleTitle.vue' //模块标题
import BarChart from './home/BarChart'  //柱形图
import BarChart2 from './home/BarChart2'  //柱形图
import PieChart from './home/PieChart'  //饼图
import LineChart from './home/LineChart' //折线图
import infoTip from './components/InfoTip' //信息提示弹框
import addApply from './home/AddApply' //添加应用弹框
import { helpMsg } from '@/api/helpInformationMaintenance'
import { getPanelInfo, getIcon, getPanelData ,getPanelAllList,getPanelListByUser,collectStatus,commafy} from '@/utils/panel.js' //获取磁贴图标信息
import { initDataPost } from '@/api/data.js'
import videoMp4 from './home/video' 
/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
// count().then(res => {})

export default {
  inject:['reload'],
  name: 'Dashboard',
  data(){
    return{
      type:'home',
      userId:this.$store.state.user.user.username,
      p:[],
      reFresh:true,
      panpels:[
        { id: 'xswcl', name: '销售完成率', val: '82.32'},
        { id: 'ymsskc', name: '玉米实时库存' , val: '432,231'},
        { id: 'yysr', name: '营业收入', val: '82.32'},
        { id: 'yylr', name: '营业利润', val: '1832.3'},
        { id: 'cghtqysl', name: '采购合同签约数量', val: '667.33'},
        { id: 'xshtqysl', name: '销售合同签约数量', val: '667.33'},
      ],
      panels : [
        {id:'XSWCL',
          name: '销售完成率',
          url: '/magnet/salesCompletionRate'
        },
        {
          id:'YMSSKC',
          name: '玉米实时库存',
          url: '/magnet/realTimeCornStock'
        },
        {
          id:'bzssdfze',
          name: '本周实时待付总额',
          url: '/magnet/weekPayAmount'
        },
        {
          id:'bzssyfze',
          name: '本周实时已付总额',
          url: '/magnet/paidWeekAmount'
        },
        {
          id:'YYSR',
          name: '营业收入',
          url: '/magnet/operatingIncome'
        },
        {
          id:'YYLR',
          name: '营业利润',
          url: '/magnet/operatingProfit'
        },
        {
          id:'CGHTQYSL',
          name: '采购合同签约数量',
          url: '/magnet/signedPurchaseQuantity'
        },
        {
          id:'XSHTQYSL',
          name: '销售合同签约数量',
          url: '/magnet/salesContractQuantity'
        },
        {
          id:'KYKLFS',
          name: '可研开立个数汇总',
          url: '/magnet/summaryAvailableNumbers'
        },
        {
          id:'YQCGHTZXSL',
          name: '已签采购合同执行数量',
          url: '/magnet/signedPurchaseExecutionQuantity'
        },
        {
          id:'YQDSGHTZXSL',
          name: '已签订收购合同执行数量',
          url: '/magnet/signedAcquisitionExecutionQuantity'
        }
      ],
      allAdhibition: [],
      infoList:[ //底部信息模块数据
        {id: 1, title:'开始使用数据中心服务',info:'帮助你快速了解和学习，如何使用数据中心提供的各类服务.',img:require('@/assets/img/home/img001_1.png')},
        {id: 2, title:'了解报表或相关报告业务含义与统计规则说明',info:'通过该服务，帮助你如何查找数数据来源和统计口径的详细定义，从而支持和确保您能获取符合特定需…',img:require('@/assets/img/home/img002.png')},
        {id: 3, title:'建议与问题反馈',info:'针对使用数据服务过程中的任何疑问或建议都可以直接反馈，都将直接获得相关业务和技术团队的支持',img:require('@/assets/img/home/img003.png')}
      ],
      infoTip:{  //信息提示对象
        title: '',
        content: '',
        titleHead: ''
      },
      qstList: [],
      dialogVideo: false
    }
  },
  components: {
    panelGroup,
    moduleTitle,
    BarChart,
    BarChart2,
    PieChart,
    LineChart,
    infoTip,
    addApply,
    videoMp4
   },
  computed: {
    ...mapGetters([
      'roles'
    ]),
    xlsxpathUrl() {
      if (window.location.host == 'me.cofcotrading.com') {
        return 'http://me.cofcotrading.com/hana8000/file/document/help-20200530040446373.xlsx'
      } else {
        return 'http://10.19.5.20:8080/file/document/help-2020053011361154.xlsx'
      }
    },
    videopathUrl() {
      if (window.location.host == 'me.cofcotrading.com') {
        return 'http://me.cofcotrading.com/hana8000/file/document/user-20200530040411119.pdf'
      } else {
        return 'http://10.19.5.20:8080/file/document/user-20200530113731497.pdf'
      }
    }
  },
  mounted(){
    //获取磁贴列表信息
    // this.getpanpels();
  },
  watch:{
    menuTree(){
      this.reFresh= false
      this.$nextTick(()=>{
        this.reFresh = false
      })
    }
  },
  created(){
    this.getAdhibition().then(() => {
      this.getAllData()
    })
    helpMsg({categoryCode: 'analysis_diagram'}).then(res => {
      this.qstList = res.content[0].children
    })
    //获取图表
    this.getCharts()
  },
  methods:{
    getCharts() {
      initDataPost("/homepage/trendChart", {viewCode: 'Analytic_001'}).then(result => {
        // const x = result.data.x;
        if (!result && !result.data) return;
        for(let i in result.data.y){
          result.data.y[i] = Number(result.data.y[i]).toFixed(0);
        }
        // const y = result.data.y;

        const _this = this.$refs.barChart
        _this.y = result.data.y
        _this.x = result.data.x
        _this.initChart()
      })
      initDataPost("/homepage/trendChart", {viewCode: 'Analytic_002'}).then(result => {
        if (!result && !result.data) return;
        result.data.reverse();
        let x = [], y = [];
        for (let i in result.data){
          x.push(Number(result.data[i].value).toFixed(0));
          y.push(result.data[i].name);
        }
        const _this = this.$refs.barChart2
        _this.y = y
        _this.x = x
        _this.initChart()
      })
      initDataPost("/homepage/trendChart", {viewCode: 'Analytic_003'}).then(res => {
        const _this = this.$refs.lineChart
        _this.chartData.visitsData = res.data.x
        for(let i in res.data.y){
          res.data.y[i] = Number(res.data.y[i]).toFixed(0);
        }
        _this.chartData.ipData = res.data.y
        _this.weekDays = res.data.weekDays
        _this.initChart()
      })
    },
    openVideo(index) {
      if (!index) this.$refs.videoMp4.dialog = true
    },
    clickTools(key, num) {
      if (key == 'icon-wenti') {
        this.infoTip.titleHead = ''
        this.infoTip.content = this.qstList[num].helpInformation
        this.$refs.infoTip._data.dialogVisible = true
      }
    },
    getAllData() {
      getPanelAllList().then(res => {
        let arr = [], newIndex;
        let newArr = (res || []).map(item => {
          this.panpels.map(it => {
            if (item.tilesId === it.tilesId) {
              item.select = 1
            }
          })
          return item;
        })
        newArr.map((item, index) => {
          newIndex = arr.findIndex(it => it.name == item.classification)
          if (newIndex === -1) {
            arr.push({
              name: item.classification,
              panels: [item]
            })
          } else {
            arr[newIndex].panels.push(item)
          }
        })
        this.allAdhibition = arr
      })
    },
    getAdhibition() {
      return new Promise(resolve => {
        getPanelListByUser({userId:this.userId}).then(res => {
          this.panpels = res.map(item => {
            if (item.unit.indexOf('万') !== -1) {
              if (typeof item.numerical == 'number') {
                item.numerical = item.numerical / 10000
              } else {
                item.numerical.NUMERICAL_ZL = item.numerical.NUMERICAL_ZL / 10000
                item.numerical.NUMERICAL = item.numerical.NUMERICAL / 10000
              }
            }
            if (item.unit.indexOf('%') !== -1) {
              item.blod = true
            }
            return item;
          })
          resolve(res)
        })
      })
    },
    //获取磁贴列表信息
    getpanpels(){
      let param = {userId:this.userId}
      getPanelListByUser(param).then(result => {
        this.p = result;
        //获取磁贴收藏状态
        collectStatus(param).then(result => {
            for(let i in this.p){
              for(let j in result){
                if(this.p[i].tilesId==result[j].tilesId){
                  this.p[i].whetherCollect = true;
                }
              }
            }
        })
 
        for(let i in this.p){
          this.p[i].name = this.p[i].tilesDescribe
          this.p[i].id = this.p[i].tilesId
          this.p[i].icon ="iconfont"+"  "+this.p[i].icon;
          for(let j in this.panels){
            if(this.p[i].tilesId == this.panels[j].id){
              getPanelData(this.panels[j].url).then(res => {
                this.p[i].numerical =commafy(Number(res[0].NUMERICAL).toFixed(0));
              }).catch(() => {
              })
            }
          }
        }
        this.panpels = this.p;

        this.$forceUpdate();
      }).catch(() => {
      })
    },
    //打开信息提示弹框
    openInfoTip(data){
     this.infoTip.titleHead = data.tilesDescribe
     this.infoTip.content = data.helpInformation
      
     this.$refs.infoTip._data.dialogVisible = true
    },
    //打开添加应用弹框
    openAddFn(){ //
      let _this = this.$refs.addApply._data
      _this.apply.home = JSON.parse(JSON.stringify(this.panpels))
      _this.apply.all = JSON.parse(JSON.stringify(this.allAdhibition))
      _this.dialogVisible = true

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .page-home-container {
    padding: 10px;
    background:rgba(242,243,248,1);
    .chart-wrapper {
      background: #fff;
      margin-bottom: 12px;
    }
    .info-box{
      width: 100%;
      background: #ffffff;
      .info-con{
        padding: 10px 0 20px;
        overflow: hidden;
        .info-item{
          position: relative;
          padding: 15px 20px 0 25px;
          display: flex;
          justify-content: space-between;
          .left-con{
            .name{
              font-size:12px;
              color:rgba(50,50,50,1);
              margin: 9px 0;
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;      /* 可以显示的行数，超出部分用...表示*/
              -webkit-box-orient: vertical;
            }
            .info{
              font-size:10px;
              font-family:MicrosoftYaHei;
              color:rgba(153,153,153,1);
              line-height:22px;
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;      /* 可以显示的行数，超出部分用...表示*/
              -webkit-box-orient: vertical;
            }
          }
          .right-con{
            width: 151px;
            margin-left: 15px;
            img{
              width: 107px;
              border-radius: 5px;
            }
          }
          &::after{
            content:'';
            width:1px;
            height:110px;
            background:rgba(234,234,234,1);
            position: absolute;
            top:0;
            right: -2px;
          }
        }
      }
    }
  }
</style>

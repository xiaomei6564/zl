<!--我的收藏-->
<template>
  <div class="page-collection">
    <!--我的应用-->
    <div class="page-collection-content">
      <module-title :name="'我的应用'" :tools="showTable ? ['el-icon-arrow-down'] : ['el-icon-arrow-up']" @clickTools="showTable = !showTable"></module-title>
      <div class="my-panpels" v-show='showTable'>
          <panel-group :panpels="panpels" :type="type" @openInfoTip="openInfoTip" />
      </div>
    </div>

    <!--我的表单-->
    <div class="page-collection-content">

      <module-title :name="'我的表单'" tools="['icon-wenti']"  @openInfoTip="openInfoTip"></module-title>
      <!--<div v-for="(item, index) in tableData" :key="index" class="collection-tables">
        <div class="table-title">{{item.name}}</div>
        &lt;!&ndash;表格&ndash;&gt;
          <ul class="table-box">
            <li class="table-tr" v-for="(i, k) in item.data" :key="k">
               <div class="tr-left">{{i.name}}</div>
               <div class="tr-right">
                 <div class="tr-time">{{i.time}}</div>
                  <div class="tr-btnbox">
                      <el-button v-permission="['admin','user:edit']" size="mini" type="primary" icon="el-icon-edit" @click="see(i)"/>
                      <el-popover
                        v-permission="['admin','user:del']"
                        :ref="item.id+i.id"
                        placement="top"
                        width="180">
                        <p>确定删除本条数据吗？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click.stop="closePopver(item.id+i.id)">取消</el-button>
                          <el-button type="primary" size="mini" @click="subDelete(i.id)">确定</el-button>
                        </div>
                        <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
                      </el-popover>
                  </div>
               </div>
            </li>
          </ul>
      </div>-->
      <index ref="index" ></index>
    </div>
     <!--信息提示框-->
    <infoTip ref="infoTip" :title="infoTipCon.title" width='550px' :content='infoTipCon.content'></infoTip>
  </div>
</template>

<script>
import index from '../my/index' //磁贴
import panelGroup from '../home/PanelGroup' //磁贴
import moduleTitle from '../components/ModuleTitle.vue' //模块标题
import infoTip from '../components/InfoTip' //信息提示弹框
import { commafy,getPanelInfo, getIcon, getPanelData ,getPanelAllList,getPanelListByUser,collectStatus} from '@/utils/panel.js' //获取磁贴图标信息

export default {
  data(){
    return {
      type:'collect',
      userId:this.$store.state.user.user.username,
      p:[],
      reFresh:true,
      showTable: true,
      panpels:[
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
        }
      ],
      infoTipCon:{
      },
      tableData:[
        {id: 'cw', name:'财务类', data:[
          { id: 1, name:'玉米近6个月销售报表1', time: '2019-10-11'},
          { id: 2, name:'玉米近6个月销售报表2', time: '2019-10-11'},
          { id: 3, name:'玉米近6个月销售报表3', time: '2019-10-11'},
          { id: 4, name:'玉米近6个月销售报表4', time: '2019-10-11'}
        ]},
        {id: 'xs', name:'销售类', data:[
          { id: 1, name:'采购清单报表1', time: '2019-10-11'},
          { id: 2, name:'采购清单报表2', time: '2019-10-11'},
          { id: 3, name:'采购清单报表3', time: '2019-10-11'},
          { id: 4, name:'采购清单报表4', time: '2019-10-11'}
        ]}
      ],
    }
  },
  components: {
    panelGroup,
    moduleTitle,
    infoTip,
    index
   },
  mounted(){
    //获取磁贴列表信息
    this.getAdhibition();
  },
  created() {
    
  },
   methods:{
     getAdhibition() {
      return new Promise(resolve => {
        collectStatus({userId:this.userId}).then(res => {
          this.panpels = res.filter(item => {
            if (item.whetherCollect) {
              if (item.unit.indexOf('万') !== -1) {
                if (typeof item.numerical == 'number') {
                  item.numerical = item.numerical / 10000
                } else {
                  item.numerical.NUMERICAL_ZL = item.numerical.NUMERICAL_ZL / 10000
                  item.numerical.NUMERICAL = item.numerical.NUMERICAL / 10000
                }
              }
              return item;
            }
            
          })
          resolve(res)
        })
      })
    },
     //打开信息提示弹框
    openInfoTip(data){
      this.infoTipCon.title = data.name
     this.infoTipCon.content = data.helpInformation
     this.$refs.infoTip._data.dialogVisible = true
     this.$forceUpdate()
    },
    clickToolsFn(key){ //工具点击事件
      switch(key){
        case 'icon-gongneng': //显示字段配置
          this.openFieldConfig()
          break;
        case 'icon-xiazai': //下载
        this.download();
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
      }
    },
    //查看数据
    see(){

    },
    //删除弹框取消
    closePopver(id){
      this.$refs[id][0].doClose()
    },
    //删除table 数据
    subDelete(id){
      this.closePopver(id);
    },

     //获取磁贴列表信息
     getpanpels(){
       let param = {userId:this.userId};
       collectStatus(param).then(result => {
         this.p = result;
         //获取磁贴收藏状态
        /* collectStatus(param).then(result => {
           console.log("111111")
           console.log(result)
           for(let i in this.p){
             for(let j in result){
               if(this.p[i].tilesId==result[j].tilesId){
                 this.p[i].whetherCollect = true;
               }
             }
           }
         })*/

         for(let i in this.p){
           this.p[i].icon ="iconfont"+"  "+this.p[i].icon;
           this.p[i].name = this.p[i].tilesDescribe
           this.p[i].id = this.p[i].tilesId
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


   }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.page-collection{
  background: #F2F3F8;
  padding: 20px;
  .my-panpels{
    padding: 20px 20px 0;
  }
  .page-collection-content{
    background:#ffffff;
    box-shadow:0px 2px 4px 0px rgba(0,0,0,0.05);
    border-radius:5px;
    margin-bottom: 20px;
  }
  .collection-tables{
    padding:0 20px 10px;
    .table-title{
      height: 50px;
      font-size:16px;
      color:rgba(6,73,154,1);
      line-height: 50px;
      border-bottom: 1px solid #E8E9ED;
    }
    .table-box{
      display: flex;
      flex-direction: column;
       padding: 0;
      li.table-tr{
        list-style: none;
         padding: 0;
         display: flex;
         justify-content:space-between;
         align-items: center;
         height: 50px;
         border-bottom: 1px solid #E8E9ED;
         .tr-left{
           font-size:16px;
          color:rgba(50,50,50,1);
         }
         .tr-right{
           display: flex;
           flex-direction: row;
            line-height: 50px;
           .tr-time{
             width: 200px;
             font-size:14px;
             color: #6B7897;
           }
         }
      }
    }
  }
}
</style>

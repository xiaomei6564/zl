<!--添加应用--->
<template>
 <el-dialog
   top="2vh"
   :visible.sync="dialogVisible"
   width="530px"
   :show-close="false"
   :append-to-body="true"
   :before-close="handleClose"
   :close-on-click-modal="false"
   :close-on-press-escape="false"
   class="addApply-box com-dialog">
    <div class="com-dialog-header">
      <div class="left">
       <!-- <i class="iconfont icon-wenti"></i>-->
        添加应用
      </div>
      <i class="iconfont icon-jianqu close-icon" @click="handleClose"></i>
    </div>
    <div class="addApply-content">
      <!--首页应用-->
      <div class="addApply-module">
         <div class="addApply-title">
          <module-title :name="'首页应用'"></module-title>
         </div>
         <ul class="panel-box">
           <li class="item"  v-for="(item, index) in apply.home" :key="index"  @mouseover="mouseOver(index)" @mouseleave="mouseLeave(index)">
              <!--<div class="tpicon" :style="{'background':getPanelInfoFn(item.tilesId,'back')}" >
                <span  :style="{'color':getPanelInfoFn(item.tilesId,'color')}" v-html="getIconFn(item.tilesId)"></span>
             </div>-->
             <div class="tpicon" :style="{'background':item.back}" >
                        <span  :style="{'color':item.color}">
                          <i :class="item.icon" class="iconfont"></i>
                        </span>
             </div>
             <div class="name">
               <el-tooltip effect="dark" :content="item.tilesDescribe">
                 <span>{{item.tilesDescribe}}</span>
               </el-tooltip>
            </div>
             <i v-if="(item.menuUrl=='' || item.menuUrl==null  || item.menuUrl==undefined)" class="el-icon-error iconBtn delete" @click="deleteTop(item, index)"></i>
           </li>
         </ul>
         <div class="tip">*最多可选择7个应用</div>
      </div>
     <!--所有应用-->
      <div class="addApply-module">
         <div class="addApply-title">
          <module-title :name="'全部应用'"></module-title>
         </div>
         <div class="classify-box">
             <div class="classify-apply" v-for="(i, index) in apply.all" :key="index">
              <div class="classify-title">{{i.name}}</div>
                <ul class="panel-box">
                  <li class="item" v-for="(item, index) in i.panels" :key="index">
                      <div class="tpicon" :style="{'background':item.back}" >
                        <span  :style="{'color':item.color}">
                          <i :class="item.icon" class="iconfont"></i>
                        </span>
                    </div>
                    <div class="name">
                      <el-tooltip effect="dark" :content="item.tilesDescribe">
                        <span>{{item.tilesDescribe}}</span>
                      </el-tooltip>
                    </div>
                    <i class="el-icon-success iconBtn select" v-if="item.select" @click="deleteBottom(item)"></i>
                    <i class="iconBtn noSelect" v-if="!item.select" @click="addPanel(item)"></i>
                  </li>
                </ul>
            </div>
         </div>
        <div class="btn-box">
          <div class="addApply-title-btnbox">
            <span class="btn" @click="handleClose">取消</span>
            <span class="btn subtn" @click="submitAdminPanel">提交</span>
          </div>
         <!-- <div slot="footer" class="dialog-footer addApply-title-btnbox">
            <el-button class="btn" type="text" @click="cancel">取消</el-button>
            <el-button class="btn subtn" :loading="loading" type="primary" @click="submitAdminPanel">确认</el-button>
          </div>-->
         </div>

      </div>

    </div>
</el-dialog>
</template>

<script>
// import { getPanelInfo, getIcon } from '@/utils/panel.js' //获取磁贴图标信息
import { getPanelInfo, getIcon, getPanelData ,getPanelAllList,getPanelListByUser} from '@/utils/panel.js' //获取磁贴图标信息
import { submitData} from '@/api/addApply.js' //获取磁贴图标信息
import moduleTitle from '../components/ModuleTitle.vue' //模块标题
import { setChartData } from '@/api/visits'


export default {
  inject:['reload'],
  props: {
  },
  data(){
    return{
      userId:this.$store.state.user.user.username,
      dialogVisible: false,
      apply:{
        home:[
          /*{id: 'xswcl', name: '销售完成率', type: 'xs'},
          {id: 'ymsskc', name: '玉米实时库存', type: 'xs'},
          {id: 'yysr', name: '营业收入', type: 'cw'},
          {id: 'yylr', name: '营业利润', type: 'cw'},
          {id: 'cghtqysl', name: '采购合同签约数量', type: 'cw'},
          {id: 'xshtqysl', name: '销售合同签约数量', type: 'cw'},*/
        ],
        all:[
          {tilesId: 'cw', name: '财务类', panels:[
            {tilesId: 'bzssdfze', name: '本周实时待付总额',type: 'cw'},
            {tilesId: 'bzssyfze', name: '本周实时已付总额', type: 'cw'},
            {tilesId: 'yysr', name: '营业收入',type: 'cw'},
            {tilesId: 'yylr', name: '营业利润',type: 'cw'},
          ]},
            {tilesId: 'xs', name: '销售类', panels:[
            {tilesId: 'xswcl', name: '销售完成率',  type: 'xs'},
            {tilesId: 'ymsskc', name: '玉米实时库存', type: 'xs'},
            {tilesId: 'cghtqysl', name: '采购合同签约数量',type: 'xs'},
            {tilesId: 'xshtqysl', name: '销售合同签约数量',type: 'xs'},
          ]}
        ]
      },
      selectPanels: []
    }
  },
  components: {
    moduleTitle
  },
    methods:{
      mouseOver(index){
        this.apply.home[index].menuUrl = "";
      },
      mouseLeave(index){
        this.apply.home[index].menuUrl = "false";
        // alert(index)
      },
      //获取用户展示磁贴
      getpanpels() {
        let param = {userId: this.$store.state.user.user.username};
        getPanelListByUser(param).then(result => {
          this.apply.home = result;
          for( let i in this.apply.home){
            this.apply.home[i].icon ="iconfont"+"  "+this.apply.home[i].icon;
            this.apply.home[i].btnFlag = true;
          }
          for(let i in result){

            this.selectPanels.push(result[i].tilesId)
          }
        }).catch(() => {
        })
      },
      //获取所有磁贴
      getAllPanpel() {
        getPanelAllList().then(result => {
          let panelAll = result;
          //获取磁贴类型列表
          let arrType = [];
          let allPanelType = [];
          for(let i in panelAll){
            panelAll[i].icon ="iconfont"+"  "+panelAll[i].icon;
            if(arrType.indexOf(panelAll[i].classification)==-1){
              let panelTYpe = {};
              panelTYpe.name = panelAll[i].classification;
              panelTYpe.panels = [];
              allPanelType.push(panelTYpe);
              arrType.push(panelTYpe.name);
            }
          }
          for(let i in allPanelType){
            for(let j in panelAll){
              if(allPanelType[i].name == panelAll[j].classification){
                allPanelType[i].panels.push( panelAll[j])
              }
            }
          }
          this.apply.all = allPanelType
        }).catch(() => {
        })
      },
      handleClose(){
        this.dialogVisible = false
      },
      getPanelInfoFn(id, key){
        return getPanelInfo(id, key)
      },
      getIconFn(id){
        return getIcon(id);
      },
      deleteTop(item, index){
        this.apply.home.splice(index, 1)

        this.apply.all.map(items => {
          items.panels.map(it => {
            if (it.tilesId === item.tilesId) {
              it.select = 0
            }
            return it;
          })
          return items;
        })
      },
      deleteBottom(item) {
        item.select = 0
        const index = this.apply.home.findIndex(it => it.tilesId === item.tilesId)
        this.apply.home.splice(index, 1)
      },
      addPanel(item){
        if (this.apply.home.length >= 7) return this.$message.warning('最多可选择7个应用')
        item.select = 1
        this.apply.home.push(item)
      },
      submitAdminPanel(){
        let arr = [];
        for(let i in this.apply.home){
          this.apply.home[i].tilesOrder = (parseInt(i)+1);
          this.apply.home[i].userId = this.userId;
        }
        setChartData(this.apply.home).then(res => {
          this.dialogVisible = false
          this.reload();
        }).catch(function (response) {
          console.log('请求失败')
        })

      }


  }
}

</script>
<style rel="stylesheet/scss" lang="scss">
.addApply-box{
  .com-dialog-header{
    background: #ffffff;
    .left{
      color: #303133;
      font-weight: normal;
      font-size: 18px;
    }
    .close-icon{
      color: #303133;
    }
  }
  .addApply-content{
    /*background: #E7E9ED;*/
    padding: 10px;
    .addApply-module{
      background: #ffffff;
      overflow: hidden;
      padding-bottom: 10px;
      border-radius:5px;
      margin-bottom: 5px;
      width: 520px;
     .addApply-title{
       display: flex;
       justify-content: space-between;
       align-items: center;
       height: 30px;
       /*border-bottom: 1px solid #E7E9ED;*/
       padding: 0 3px;
       p{
         font-size:14px;
          /*font-weight:bold;*/
          color:rgba(50,50,50,1);
       }
     }
     .panel-box{
      //  width: 520px;
       margin: 15px auto;

       overflow: hidden;
       padding: 0;
       li{
         list-style:none
       }
       .item{
         width: 120px;
         height: 75px;
         /*border-bottom: 1px solid #E7E9ED;*/
         /*border-right: 1px solid #E7E9ED;*/
         /*border-top: 1px solid #E7E9ED;*/
         /*border-left: 1px solid #E7E9ED;*/
         margin-left: 1px;
         margin-bottom: 12px;
         margin-top: 12px;
         box-sizing: border-box;
         display: flex;
         flex-direction: column;
         justify-content: center;
         align-items: center;
         float: left;
         position: relative;
          .tpicon{
           width: 80px;
           height: 60px;
           display: flex;
           justify-content: center;
           align-items: center;
           border-radius:10px;
           i{
             font-size: 32px;
             opacity: 1;
           }
         }
         .name{
           font-size:12px;
           color:rgba(50,50,50,1);
           margin-top: 11px;
           width: 80px;
           overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-align: center;
         }
         .iconBtn{
           position: absolute;
           top: 0px;
           right: 2px;
           font-size: 16px;
           cursor: pointer;
         }
         .delete{
           color: #EB3D3C;
         }
         .select{
           color: #3CB7A2;
         }
         .noSelect{
            width:16px;
            height:16px;
            border: 1px solid #CCD1DB;
            border-radius: 50%;
        }
       }
     }
     .tip{
       font-size:12px;
       color:rgba(107,120,151,1);
       padding-left: 20px;
     }
      .btn-box{
        .addApply-title-btnbox{
          .btn{
            margin-left: 340px;
            margin-top: 10px;
            display: inline-block;
            width:70px;
            height:40px;
            font-size:14px;
            color:#46a6ff;
            line-height:40px;
            border-radius:3px;
            text-align: center;
            /*border: 1px solid rgba(6,73,154,1);*/
            cursor: pointer;
          }
          .subtn{
            background:#1890ff;
            color: #ffffff;
            margin-left: 5px;
          }
        }
      }
    }
    .classify-box{
      height: 250px;
      overflow-y: scroll;
    }
    .classify-title{
      font-size:14px;
      color:rgba(50,50,50,1);
      margin-top: 10px;
      padding-left: 5px;
    }
  }
}
</style>

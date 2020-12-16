<template>
   <el-row :gutter="20" class="panel-group-box">
     <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-for="(item, index) in panpels" :key="index">
       <div class="card-panel">
         <div class="card-panel-con">
           <div class="top-con">
           <div class="name">{{item.tilesDescribe}}</div>
           <div class="icon-box">
             <i class="iconfont icon-yidong"></i>
             <!--<i class="iconfont icon-zhexiantu1 " style="mix-blend-mode:lighten; background: url(http://wx4.sinaimg.cn/small/bd3d4fdcly1ftjwufyoxuj20e408cgls.jpg), linear-gradient(#f00, #f00);"></i>-->
             <i v-if="item.whetherCollect&type=='home'" style="color: #f4ea2a" class="iconfont icon-shoucang" ></i>
             <i v-if="!item.whetherCollect&type=='home'"  class="iconfont icon-shoucang" @click="collectCard(item)"></i>
             <i class="iconfont icon-wenti" @click="openInfoModal(item)"></i>
             <i v-if="type=='collect'" class="iconfont icon-jianqu" @click="deletePanel(item, index)"></i>
           </div>
         </div>
         <div class="bottom-con">
           <div class="left">
             <template v-if="(typeof item.numerical) == 'number'">
              <div class="left_top">
                <span class="val">{{item.numerical | utilNum}}</span>
                <span class="unit" :style="item.blod ? 'font-size: 24px' : ''">{{item.unit}}</span>
              </div>
             </template>
             <template v-else>
              <div class="left_top">
                <span class="val" v-if="item.numerical">{{item.numerical.NUMERICAL | utilNum}}</span>
                <span class="unit" :style="item.blod ? 'font-size: 24px' : ''">{{item.unit}}</span>
              </div>
              <div class="left_bottom">
                <span class="unit" v-if="item.numerical" style="font-weight: normal;">较昨日</span>
                <span class="val" v-if="item.numerical" style="font-size: 20px;color: #10aeb5">+{{item.numerical.NUMERICAL_ZL | utilNum}}</span>
              </div>
             </template>
             
           </div>
           <div class="right">
             <div class="tpicon" :style="{'background':item.back}" >
                <span  :style="{'color':item.color}">
                  <i :class="item.icon"></i>
                </span>
             </div>
           </div>
         </div>
         </div>
       </div>
    </el-col>
    <!--添加应用-->
     <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-if="!!add">
        <div class="card-panel">
          <div class="add-box">

            <div class="add-icon" @click="openAdd">
              <i class="el-icon-plus"></i>
              <!--<img src="../../assets/img/home/add.png" height="52" width="98"/>-->
            </div>
            <div class="ms">添加应用</div>
             <div class="tip-box">
               <i></i>有新应用上线
              </div>
          </div>
        </div>
     </el-col>
   </el-row>
</template>

<script>
import { getPanelInfo, getIcon,collectPanel,deletePanelByUser } from '@/utils/panel.js' //获取磁贴图标信息
export default {
  inject:['reload'],
  props:{
    panpels:{
      default:[]
    },
    type:'',
    add:{
      default: false
    }
  },
  // props: ['panpels'],
  data(){
    return {
      arr: this.panpels
    }
  },
  filters: {
    utilNum(val) {
      if (!val) {return 0}
      var reg=/\d{1,3}(?=(\d{3})+$)/g;   
      return (Math.round(val) + '').replace(reg, '$&,');
    }
  },
  methods:{
    //打开信息提示框
    openInfoModal(data){
      this.$emit('openInfoTip', data)
    },
    getPanelInfoFn(id, key){
      return getPanelInfo(id, key)
    },
    getIconFn(id){
      return getIcon(id);
    },
    //打开添加应用弹框
    openAdd(){
       this.$emit('openAdd', true)
    },
    //收藏磁贴
    collectCard(item){
      let param = {
        tilesOrder:1,
        userId:this.$store.state.user.user.username,
        whetherCollect:1,
        tilesId:item.tilesId
      };
      collectPanel(param).then(result => {
        item.whetherCollect = 1
        this.$message.success('收藏成功')
      })
    },
    deletePanel(item, index){
      let param = {
        userId:this.$store.state.user.user.username,
        tilesId: item.tilesId
      };
      
      deletePanelByUser(param).then(result => {
        this.panpels.splice(index,1);
      })
    }

  }
}

</script>
<style rel="stylesheet/scss" lang="scss" >
.panel-group-box{
   .card-panel-col{
    margin-bottom: 10px;
    .card-panel {
      height:117px;
      background:rgba(255,255,255,1);
      // box-shadow:0px 2px 4px 0px rgba(0,0,0,0.05);
      box-shadow:0px 5px 15px 0px rgba(7,26,122,0.06);
      border-radius:5px;
      cursor: pointer;
      .top-con{
        width: 100%;
        height: 35px;
        border-bottom: 1px solid rgba(232,233,237,1);
        box-sizing: border-box;
        padding: 0 20px 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .name{
          font-size:10px;
          font-family:MicrosoftYaHei;
          color:rgba(50,50,50,1);
        }
        .icon-box{
          i{
            font-size: 12px;
            color: #969696;
            cursor: pointer;
            margin-left: 4px;
          }
        }
      }
      .bottom-con{
        height: 80px;
        padding: 0 20px 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left{
          flex: 1;
          text-align: center;
          .val{
            font-size:24px;
            /*font-family:DINAlternate-Bold,DINAlternate;*/
            /*font-family:wf_standard-font_light;*/
            /*font-family:helvetica;*/
            /*font-family:arial;*/
            // font-family:sans-serif;
            /*font-weight:bold;*/
            color:rgba(50,50,50,1);
            font-family: wf_standard-font_light,helvetica,arial,sans-serif;
          }
          .unit{
            font-size:14px;
            // font-family:DINAlternate-Bold,DINAlternate;
            font-weight:bold;
            color:rgba(50,50,50,1);
            font-family: wf_standard-font_light,helvetica,arial,sans-serif;

          }
        }
        .right{
         .tpicon{
           width: 57px;
           height: 43px;
           display: flex;
           justify-content: center;
           align-items: center;
           border-radius:10px;
           i{
             font-size: 24px;
             opacity: 1;
             font-family: "iconfont" !important;
             font-style: normal;
           }
         }
        }
      }
      .add-box{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        .add-icon{
          width:40px;
          height:40px;
          margin: 32px auto 10px;
          line-height: 40px;
          text-align: center;
          border-radius:10px;
          border:1px dashed rgba(151,151,151,1);
          i{
            font-size: 24px;
            line-height: 40px;
            color: #999999;
          }
        }
        .ms{
            text-align: center;
            font-size:14px;
            font-family:MicrosoftYaHei;
            margin-left: 10px;
            margin-top: 5px;
            color:rgba(50,50,50,1);
          }
      }
      .tip-box{
        position: absolute;
        right: 0;
        top: 11px;
        width:110px;
        height:24px;
        line-height: 24px;
        text-align: center;
        background:rgba(216,86,86,0.1);
        border-radius:100px 0px 0px 100px;
        font-size:12px;
        color:rgba(211,66,66,1);
        i{
          display: inline-block;
          margin-right:5px;
          width:6px;
          height:6px;
          border-radius: 50%;
          background:rgba(211,66,66,1);
        }
      }
    }
  }
}
</style>

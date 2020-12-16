<!--信息提示弹框-->
<template>
  <el-dialog
   :visible.sync="dialogVisible"
   :width="width"
   :show-close="false"
   :append-to-body="true"
   :before-close="handleClose"
   class="infoTip-box com-dialog">
    <div class="com-dialog-header" style="background: #FFFFFF">
      <div class="left" style="color: #303133;font-weight: normal">
        <i class="iconfont icon-wenti"></i>
        {{titleHead ? titleHead : '信息提示框'}}
      </div>
      <i class="iconfont icon-jianqu close-icon"  style="color: #303133;" @click="handleClose"></i>
    </div>
    <div class="infoTip-con">
       <div class="name">{{title}}</div>
       <div v-html='getContent'></div>
       <div class="close-btn">
         <span @click="handleClose">知道了</span>
        </div>
    </div>
</el-dialog>
</template>

<script>
export default {
  props:{
    title:{
      default: ''
    },
    titleHead: {
      default: ''
    },
    content: {
      default: ''
    },
    width: {
      // 磁贴550px 表单大一点
      default: '600px'
    }
  },
  data(){
    return {
      dialogVisible: false
    }
  },
  computed: {
    getContent() {
      let Base64 = require('js-base64').Base64;
      return Base64.decode(this.content)
    }
  },
  methods:{
    handleClose(){
      this.dialogVisible = false
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" >
.infoTip-box{
  
  .infoTip-con{
    padding: 0 30px 20px;
    background: #ffffff;
    .name{
      font-size:18px;
      color:rgba(6,73,154,1);
      margin-bottom: 15px;
    }
    .ms{
      font-size:14px;
      color:rgba(50,58,77,1);
      line-height:19px;
      white-space: pre-line
    }
    .close-btn{
      text-align: right;
      margin-top: 20px;
      /*background: #1890ff;*/
      span{
        display: inline-block;
        width:70px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-radius:3px;
        /*border:1px solid rgba(6,73,154,1);*/
        color: rgba(6,73,154,1);
        font-size: 12px;
        cursor: pointer;
        background: #1890ff;
        color: #FFFFFF;
      }
    }
  }
}
</style>
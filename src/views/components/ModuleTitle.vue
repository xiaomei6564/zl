<!---
模块标题以及对应的图标工具栏
name： 标题名称
tools：图标工具
         el-icon-arrow-down 收缩
         icon-gongneng 功能
         icon-xiazai 下载
         icon-dayin 打印
         icon-duanxinfasong 定时任务
         el-icon-copy-document 收藏
         icon-wenti 信息
-->
<template>
  <div class="module-title">
    <div class="left-con">{{name}}</div>
    <div class="right-con">
      <span v-for="(item, index) in tools" :key="index"  :title="!colorBtm ? getTitle(item) : ''" >
          <!-- <i :class="['iconfont', item]" v-if="item=='icon-duanxinfasong'" @click="clickTools(item)" ></i> -->
          <!-- <i :class="['iconfont', item]" v-if="item=='icon-wenti'" @click="clickTools(item)" ></i>
          <template v-else-if="item=='icon-dayin'">
            <i :class="['iconfont', 'icon-dayin']" v-permission="['admin','lineInquiry:print']" v-print="print"></i>
          </template>

          <i :class="['iconfont', item]" v-permission="['admin',showObj[item]]" v-else @click="clickTools(item)" ></i> -->
          <template v-if='!colorBtm'>
            <template v-if="typeof item === 'string'">
              <template v-if="item !== 'icon-dayin'">
                <i :class="['iconfont', item]" @click="clickTools(item)"></i>
              </template>
              <template v-else>
                <i :class="['iconfont', item]" v-print="print"></i>
              </template>
            </template>
            <!-- 带权限控制 -->
            <template v-else>
              <template v-if="item.permission">
                <template v-if="item.name !== 'icon-dayin'">
                  <i :class="['iconfont', item.name]" v-permission="['admin', item.permission]" @click="clickTools(item.name)"></i>
                </template>
                <template v-else>
                  <i :class="['iconfont', item.name]" v-permission="['admin', item.permission]" v-print="print"></i>
                </template>
              </template>
              <template v-else>
                <template v-if="item.name !== 'icon-dayin'">
                  <i :class="['iconfont', item.name]" @click="clickTools(item.name)"></i>
                </template>
                <template v-else>
                  <i :class="['iconfont', item.name]" v-print="print"></i>
                </template>
              </template>
            </template>
          </template>
          <template v-else>
            <template v-if="typeof item === 'string'">
              <template v-if="item !== 'icon-dayin'">
                <!-- <i :class="['iconfont', item]" @click="clickTools(item)"></i> -->
                <el-button type="info" :icon="item" size="mini" plain @click="clickTools(item)">{{getTitle(item)}}</el-button>
              </template>
              <template v-else>
                <el-button type="info" :icon="item" size="mini" plain @click="clickTools(item)" v-print="print">{{getTitle(item)}}</el-button>
                <!-- <i :class="['iconfont', item]" v-print="print"></i> -->
              </template>
            </template>
            <!-- 带权限控制 -->
            <template v-else>
              <template v-if="item.permission">
                <!-- <template v-if="item.name !== 'icon-xiazai'"> -->
                  <el-button type="info" size="mini" :icon="item.name" plain v-permission="['admin', item.permission]" @click="clickTools(item.name)">{{getTitle(item)}}</el-button>
                  <!-- <i :class="['iconfont', item.name]" v-permission="['admin', item.permission]" @click="clickTools(item.name)"></i> -->
                <!-- </template> -->
                <!-- <template v-else> -->
                  <!-- <el-popover
                    v-permission="['admin', item.permission]"
                    ref="xiazaiRef"
                    placement="top"
                    width="300">
                    <p>系统准备下载当前查询范围内的全部数据，可能需要一点时间，确认吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs.xiazaiRef[0].doClose()">取消</el-button>
                      <el-button type="primary" size="mini" @click="subDelete('xiazaiRef', item.name)">确定</el-button>
                    </div>
                    
                  </el-popover> -->
                  <!-- <el-button type="info" size="mini" :icon="item.name" plain>{{getTitle(item)}}</el-button>  -->
                  <!-- <i :class="['iconfont', item.name]" v-permission="['admin', item.permission]" v-print="print"></i> -->
                <!-- </template> -->
              </template>
              <template v-else>
                <template v-if="item.name !== 'icon-dayin'">
                  <!-- <i :class="['iconfont', item.name]" @click="clickTools(item.name)"></i> -->
                  <el-button type="info" size="mini" :icon="item.name" plain @click="clickTools(item.name)">{{getTitle(item)}}</el-button>
                </template>
                <template v-else>
                  <el-button type="info" size="mini" :icon="item.name" plain v-print="print">{{getTitle(item)}}</el-button>
                  <!-- <i :class="['iconfont', item.name]" v-print="print"></i> -->
                </template>
              </template>
            </template>
          </template>
        <!--打印-->
      </span>
      <slot />
    </div>
  </div>
</template>

<script>
  // import checkPermission from '@/utils/permission'

  export default {
    props:{
      name:{
        default:''
      },
      tools:{
        default: () => {
          return []
        }
      },
      print:{ //打印表格id
        default: null
      },
      num: {
        default: ''
      },
      colorBtm: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        describeObj: {
          'el-icon-arrow-down': '收展',
          'icon-gongneng': '自定义表单设置',
          'icon-xiazai':'下载数据到本地Excel文件',
          'icon-dayin': '打印或导出PDF文件',
          'icon-duanxinfasong': '安排计划任务',
          'el-icon-copy-document': '收另存为副本藏',
          'icon-wenti':'查询帮助信息',
        },
        colorObj: {
          'el-icon-view': '详情',
          'icon-gongneng': '布局',
          'icon-xiazai':'下载',
          'icon-dayin': '打印',
          'icon-duanxinfasong': '计划',
          'el-icon-copy-document': '副本',
          'icon-wenti':'帮助'
        },
        showObj: {
          'icon-gongneng': 'viewcode:list',
          'icon-xiazai': 'onlineInquiry:export',
          'icon-dayin': 'onlineInquiry:print',
          'el-icon-copy-document': 'onlineInquiry:collection',
          'icon-duanxinfasong': 'onlineInquiry:snapshot',
          'icon-wenti': ''
        }
      }
    },
    mounted(){

    },
    methods:{
      subDelete(ref, name) {
        this.$refs.xiazaiRef[0].doClose()
        this.clickTools(name)
      },
      clickTools(key){
        this.$emit('clickTools', key, this.num)
      },
      getTitle(key){
        let newKey = '', tit = this.describeObj;
        if (typeof key !== 'string') newKey = key.name
        else newKey = key
        if (this.colorBtm) tit = this.colorObj;
        if(tit.hasOwnProperty(newKey)){
          return tit[newKey]
        }else{
          return ''
        }
      }
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss" >
  .module-title{
    width: 100%;
    height: 34px;
    padding: 0 18px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EAEAEA;
    &::before{
      content: '';
      position: absolute;
      top: 5px;
      left: 0px;
      width: 4px;
      height: 20px;
      background:rgba(6,73,154,1);
    }
    .left-con{
      font-size:12px;
      font-weight:bold;
      color:rgba(50,50,50,1);
    }
    .right-con{
      i.iconfont{
        font-size: 16px;
        color: #969696;
        margin-left: 7px;
        cursor: pointer;
      }
      .el-button{
        margin-left: 5px;
        i {
          font-family: "iconfont" !important;
          font-size: 12px;
          margin-right: 4px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        [class^="el-icon-"], [class*=" el-icon-"] {
          font-family: 'element-icons' !important;
          speak: none;
          font-style: normal;
          font-weight: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
          vertical-align: baseline;
          display: inline-block;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      } 
      .el-button--info.is-plain:active {
        background-color: #FFBA00;
        border-color: #FFBA00;
      }
      .el-button--info.is-plain:hover, .el-button--info.is-plain:focus {
        background-color: #FFBA00;
        border-color: #FFBA00;
      }
    }
  }
</style>

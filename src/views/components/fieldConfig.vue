<template>
<el-dialog 
  title="显示配置字段"
  custom-class="fieldConfig-dialog"
  :visible="dialogVisible"
  :append-to-body="true"
  width="800px"
  :before-close="closeDialog">
  <div class="switch-con">
    <el-tooltip :content="modeType==0?'切换专家模式':'切换普通模式'" placement="bottom">
      <el-switch
        v-model="modeType"
        active-color="#ff4949"
        inactive-color="#1791FF"
        active-value="1"
        inactive-value="0">
      </el-switch>
    </el-tooltip>
  </div>
  <div class="fieldConfig-box">
    <!--左侧未选框-->
    <div class="box left-box">
      <div class="box-tit">
       <span>未选字段</span>
       <span>{{leftSelect ? leftSelect : 0}}/{{data1.length}}</span>
      </div>
      <div class="box-title">
        <span :class="{active: leftSelect === data1.length, 'all-check':true}" @click="selectAll(data1)">字段名称</span>
      </div>
      <div @drop="dropPub($event, 2)" @dragover.prevent class="left">
        <div
          v-for="(item,index) in changeSourceData" :key="index"
          @drag="ondrag"
          @dragstart="dragstart($event, item)"
          @dragend="dragend"
          draggable="true"
          class="hover-color row"
          :class="{'active': item.isSelect }"
          v-on:click="hanldleClick(data1, item.filed)"
          >
          {{item.showName}}
        </div>
      </div>
    </div>
    <!--中间选择区域-->
    <div class="middle">
      <div @click="moveItem(data2,data1)" :class="{active: rightSelect > 0}"><i class="el-icon-arrow-left"></i></div>
      <div @click="moveItem(data1, data2)" :class="{active: leftSelect > 0}"><i class="el-icon-arrow-right"></i></div>
    </div>
    <!--右侧已选择框-->
    <div class="box  right-box">
       <div class="box-tit">
       <span>已选字段</span>
       <span>
         <i class="el-icon-bottom" style="font-weight: bold" @click="downOrUpMove(1)" />
         <i class="el-icon-top" style="font-weight: bold" @click="downOrUpMove(-1)" />
       </span>
       <span>{{rightSelect ? rightSelect : 0}}/{{data2.length}}</span>
      </div>
      <div class="box-title">
        <span :class="{active: rightSelect === data2.length, 'all-check':true}" 
          @click="selectAll(data2)"></span>
        <div>
          <span  class="right-box-colum" v-for="(item, index) in rightColumn" :key="index" 
            :style="{'width':item.width+'px'}" 
            v-show="modeType==1 || (modeType!=1 && index==0)"
          >{{item.name}}</span>
        </div>
      </div>
      <div @drop="dropPub($event, 1)" @dragover.prevent class="right">
        <div
        class="hover-color"
        @drag="ondrag"
        @dragstart="dragstart($event, item)"
        @dragend="dragend"
        draggable="true"
        v-for="(item,index) in changeTargetData"
        :key="index"
        :class="{'active': item.isSelect}"
        @click.stop="hanldleClick(data2, item.filed, 'right')"
      >
        <span class="right-box-colum" v-for="(list, k) in rightColumn" :key="k" 
          :style="{'width': list.width+'px',  'color': (selectIndex === index ? '#409eff' : '')}" 
          v-if="list.id !== 'AGGREGATE_TYPE'" 
          v-show="modeType==1 || (modeType!=1 && k==0)">{{item[list.id]}}</span>
        <el-select :disabled="item.AGGREGATE_TYPE!=='K'" size="small" v-model="item.selectType" 
          style="width: 70px;" 
          class="select-box" 
          placeholder="" 
          v-show="modeType==1">
          <el-option
            v-for="(sel, k) in selectType"
            :key="k"
            :label="sel.name"
            :value="sel.id">
          </el-option>
        </el-select>
       </div>
      </div>
    </div>
  </div>
  <div class='foot_instructions'><b>*</b>支持字段显示和顺序调整，以及在普通和专家模式之间切换，方便定制化表单.</div>
  <div slot="footer" class="dialog-footer">
    <el-button type="text" @click="closeDialog">取消</el-button>
    <el-button type="primary" @click="closeDialog">确认</el-button>
  </div>
</el-dialog>
</template>
<script>
export default {
props: {
  sourceLeft: { // 左侧数据
    type: Array
  },
  targetRight: { // 右侧数据
    type: Array
  },
  value: {
    type: Array,
    default: null
  }
},
data () {
  return {
    dialogVisible: false,
    data1: [], // 左侧数据
    data2:[],// 右侧数据
    target: {
      x: '',
      y: '',
      id: ''
    },
    sourceData: '',
    targetData: '',
    changeSourceData: [], // 左侧数据
    changeTargetData: [],// 右侧数据
    modeType:1, //0: 普通模式 1:专家模式
    rightColumn:[
      {id:'showName',name:'字段名称',width:'100'},
      {id:'filed',name:'技术名称',width:'80'},
      {id:'DATA_TYPE_NAME',name:'数据类型',width:'90'},
      {id:'LENGTH',name:'长度',width:'60'},
      {id:'AGGREGATE_TYPE',name:'聚合类型',width:'70'},
    ],
    selectType:[
      {id: '', name: '无'},
      {id: '1', name: '合计'},
      {id: '2', name: '平均值'},
      {id: '3', name: '最大'},
      {id: '4', name: '最小'}
    ],
    selectIndex: ''
  }
},
created () {
  this.sourceLeft.forEach(item => {
    this.data1.push(Object.assign({}, item, {
        isSelect: false
      })
    )
  })
  this.changeSourceData = this.data1
  this.changeTargetData = this.data2
},
mounted () {
  let empty = []
  if (this.targetRight.length > 0) {
    this.targetRight.forEach(item => {
      empty.push(Object.assign({}, item, {
          isSelect: false
        })
      )
    })
    this.data2 = empty
    this.changeTargetData = empty
  }
},
computed: {
  leftSelect () {
    if (this.data1.length === 0) return false
    let arr =  this.data1.filter(item=> {
      return item.isSelect == true
    })
    return arr.length
  },
  rightSelect () {
    if (this.data2.length == 0) return false
    let arr =  this.data2.filter(item=> {
      return item.isSelect == true
    })
    return arr.length
  }
},
watch: {
  sourceLeft () {
    this.sourceLeft.forEach(item => {
      this.data1.push(Object.assign({}, item, {
          isSelect: false
        })
      )
    })
    this.changeSourceData = this.data1
    this.changeTargetData = this.data2
  },
  value () {
    // 通过接口拿到已经存在的，然后遍历源数据，删除已经存在的
    if (this.value.length > 0) {
      this.value.forEach(item => {
        this.data1.forEach((v,i) => {
          if (item == v.filed) {
            this.data1.splice(i,1)
          }
        })
      })
    }
  },
  targetRight () {
    let empty = []
    if (this.targetRight.length > 0) {
      this.targetRight.forEach(item => {
        empty.push(Object.assign({}, item, {
            isSelect: false
          })
        )
      })
      this.data2 = empty
      this.changeTargetData = empty
    }
  },
  sourceData (val) {
    let emptyArr = []
    if (val) {
      for (let i = 0; i < this.data1.length; i++) {
        if (this.data1[i].value.indexOf(val) != -1) {
          emptyArr.push(this.data1[i])
        }
      }
      this.changeSourceData = emptyArr
    } else {
      this.changeSourceData = this.data1
    }
  },
  targetData (val) {
    let emptyArr = []
    if (val) {
      for (let i = 0; i < this.data2.length; i++) {
        if (this.data2[i].DATA_TYPE_NAME.indexOf(val) != -1) {
          emptyArr.push(this.data2[i])
        }
      }
      this.changeTargetData = emptyArr
    } else {
      this.changeTargetData = this.data2
    }
  }
},
methods: {
  downOrUpMove(num) {
    if (typeof this.selectIndex !== 'number') return false;
    if (num === -1 && !this.selectIndex) return false;
    if (num === 1 && this.data2.length - 1 === this.selectIndex) return false;
    let obj = {...this.data2[this.selectIndex]}
    this.data2.splice(this.selectIndex, 1)
    this.data2.splice(this.selectIndex + num, 0, obj)
    this.selectIndex = this.selectIndex + num
  },
  ondrag(event) {
    this.target.y = event.y
    this.target.x = event.x
  },
  dropPub (event, type) {
    if (type == 1) {
      this.drop(event,this.data1, this.data2, type)
    } else {
      this.drop(event,this.data2, this.data1, type)
    }
  },
  drop (event,handle, target, type) {
    // 被拖拽数据中的id值
    let id = event.dataTransfer.getData('filed')
    handle.forEach((item,index)=>{
      if (item.filed == id) {
        let temp = handle.splice(index,1)
        temp[0].isSelect = false
        target.push(temp[0])
      }
    })
    this.resort(event, target, type)
  },
  resort (event, target, type) {
    let eles = event.currentTarget.children
    let emptyArray = []
    // type=1 从左往右拖拽 type=2 从右往左拖拽
    if (type == 1) {
      target.forEach(item => {
        emptyArray.push(item.filed)
      })
      // v-model 可以监听这个input事件的触发
      this.$emit('input', emptyArray)
    }
    if (type == 2) {
      let tempId = event.dataTransfer.getData('filed')
      this.changeTargetData.forEach(item => {
        if (item.filed != tempId) {
          emptyArray.push(item.id)
        }
      })
      // v-model 可以监听这个input事件的触发
      this.$emit('input', emptyArray)
    }
    // 两个框拖拽数据
    for (let i = 0; i < target.length; i++) {
      if (target[i].filed == this.target.filed) {
        target[i].y = this.target.y
      } else {
        // 获取元素在页面上位置，纵坐标
        target[i].y = eles[i].getBoundingClientRect().y
      }
    }
    // 单个框中换位置
    for (let i = 0; i < target.length-1; i++) {
      for (let j = 0; j < target.length-i-1; j++) {
        if (target[j].y > target[j+1].y) {
          let swap = target[j]
          target[j] = target[j+1]
          target[j+1] = swap
        }
      }
    }
    // vue强制更新视图
    this.$forceUpdate()
  },
  dragstart (event,item) {
    this.target.filed = item.filed
    event.dataTransfer.setData('filed', item.filed)
  },
  dragend (event) {
    event.dataTransfer.clearData()
  },
  hanldleClick(data, id, name) {
    data.forEach((element, index) => {
      if (element.filed == id) {
        element.isSelect = !element.isSelect
        if (name) {
          this.selectIndex = index
        }
      }
    })
  },
  moveItem (handle, target) {
    let temp = handle.filter(item=> {
      return item.isSelect == true
    })
    if (temp.length <=0) return false
    temp.forEach(item=> {
      let index = handle.indexOf(item)
      handle.splice(index,1)
      item.isSelect = false
      target.push(item)
    })
  },
  selectAll (data) {
    let isSelectAll = data.every(item => {
      return item.isSelect == true
    })
    data.forEach(item=> {
      if (isSelectAll) {
        item.isSelect = false
      } else {
        item.isSelect = true
      }
    })
  },
  closeDialog(){
    this.$emit('changeValue', this.data2)
    this.dialogVisible = false
  }
}
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.fieldConfig-dialog{
    .el-dialog__body{
       position: relative;
       padding-top: 20px;
     }
     .switch-con{
       position: absolute;
       right: 45px;
       top: -35px;
     }
 }
  .fieldConfig-box {
    display: flex;
    align-items: center;
    .left-box{
      width: 215px;
    }
    .right-box{
      width: 510px;
      i {
        font-weight: bold;
        cursor: pointer;
      }
    }
    .box {
       border:1px solid rgba(231,233,237,1);
       padding: 0 10px ;
       &-tit{
         height: 30px;
         display: flex;
         justify-content: space-between;
         align-items: center;
       }
     }
    .box .box-title {
      font-size: 14px;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      height: 30px;
      line-height: 30px;
      background:rgba(247,247,248,1);
    }
    .box-tit span:first-child{
      font-size: 12px;
      font-weight: bold;
      color: #323232;
      display: flex;
      align-items: center;
      &:before {
        content: '';
        width: 4px;
        height: 15px;
        background: #06499a;
        margin-right: 5px;
      }
    }
    .box .box-title .all-check{
      display: inline-block;
      background: #f5f7fa;
      background-image: url(../../assets/img/home/check-box-outline-blank.png);
      background-repeat: no-repeat;
      background-position: 10px center;
      background-size: 20px 20px;
      padding-left: 35px;
      cursor: pointer;
    }
    .box .box-title .all-check.active {
      background-image: url(../../assets/img/home/check_box.png);
    }
    .left, .right {
      height: 250px;
      padding: 5px 0;
      box-sizing: border-box;
      overflow-y: scroll;
      overflow-x:hidden;
    }
    .left >div.hover-color , .right > div.hover-color {
      cursor: pointer;
      text-align: left;
      background-image: url(../../assets/img/home/check-box-outline-blank.png);
      background-repeat: no-repeat;
      background-position: 10px center;
      background-size: 20px 20px;
      font-size: 14px;
      padding-left: 35px;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 30px;
    }
    .left > div.active , .right > div.active {
      background-image: url(../../assets/img/home/check_box.png);
    }
    .left > div.hover-color:hover, .right > div.hover-color:hover {
      color: rgb(64, 158, 255);
    }
    .right .select-box{
       height: 25px;
       .el-input{
         height: 100%;
       }
       .el-input__inner{
         height: 100%;
         padding-left:5px;
         padding-right: 15px;
         text-align: center;
       }
       .el-input__suffix{
         width: 20px;
         right: 5px;
         line-height: 25px;
       }
       .el-input__icon{
         line-height: 15px;
       }
    }
    .right-box-colum{
      height: 30px;
      display: inline-block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      line-height: 30px;
    }
    .middle {
      margin:0 20px;
    }
    .middle > div {
      margin: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #dcdfe6;
      font-size: 12px;
      background-color: #f5f7fa;
      color: #c0c4cc;
      i{
        font-size: 14px;
      }
    }
    .middle > div.active {
      background-color: #409eff;
      border-color: #409eff;
      color: #ffffff;
    }
  }
  .foot_instructions {
    display: inline-block;
    width: 85%;
    text-align: left;
    font-size: 14px;
    margin-top: 20px;
    color: #909399;
    b {
      color: red;
      margin-right: 5px;
    }
  }
  .el-dialog__body {
    padding-bottom: 0;
  }
</style>

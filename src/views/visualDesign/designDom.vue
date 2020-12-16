<template>
  <div class="designDom">
    <template v-if="leftData.length">
      <ul ref="oul">
        <h3>
          {{leftData[0].dsName}} 
        </h3>
        <li v-for="(child, index) in leftData" :key="child.dsFieldCode" @mousedown="pressLeft(index, $event)" 
        @contextmenu.prevent="openMenu(child,$event, 'oul', index)" @mouseup="upliftLeft(index, $event)">
          <u>AB</u>
          <s></s>
          <div>
            <vue-splitpane :min-percent='30' :default-percent='40' split="vertical">
              <template slot="paneL">
                <b>{{child.dsFieldCode}}</b>
              </template>
              <template slot="paneR">
                <span>{{child.dsFieldName}}</span>
              </template>
            </vue-splitpane>
          </div>
          <!-- <i :class="child.filterValue ? 'el-icon-wind-power' : ''" :title="child.filterValue"></i> -->
          <i :class="filterState(child.dsFieldCode, 'lFilterData')" :title="filterState(child.dsFieldCode, 'lFilterData', 'tit')"></i>
        </li>
      </ul>
      <canvas ref="myCanvas" width="100" :height="canHeight"></canvas>
      <ul ref="oul2">
        <h3>{{rightData[0].dsName}}
        </h3>
        <li v-for="(child, index) in rightData" @contextmenu.prevent="openMenu(child,$event,'oul2', index)" 
        :key="child.dsFieldCode" @mousedown="pressRight(index, $event)" @mouseup="upliftRight(index, $event)">
          <u>AB</u>
          <s></s>
          <div>
            <vue-splitpane :min-percent='30' :default-percent='40' split="vertical">
              <template slot="paneL">
                <b>{{child.dsFieldCode}}</b>
              </template>
              <template slot="paneR">
                <span>{{child.dsFieldName}}</span>
              </template>
            </vue-splitpane>
          </div>
          <i :class="filterState(child.dsFieldCode, 'RFilterData')" :title="filterState(child.dsFieldCode, 'RFilterData', 'tit')"></i>
        </li>
      </ul>
    </template>
    <template v-else>
      请选择数据源
    </template>
    <ol v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="addOut">添加到输出</li>
      <li @click="filterAdd">添加（修改）过滤器</li>
      <li @click="filterClear" v-if="IsUserFilter">清除过滤器</li>
      <li @click="lineClear" v-if="IsUserLine">清除连接线</li>
      <li @click="dataDialog = true" v-if="IsUserLine">修改关联线</li>
    </ol>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :before-close="cancel" :visible.sync="dialog" title="限制条件" width="400px" top='40vh'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="操作符" prop="symbol" size='mini'>
          <el-select v-model="ruleForm.symbol" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in DS_ON_SYMBOL" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="值" prop="value1" size='mini'>
          <el-input v-model="ruleForm.value1"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button type="primary" size="mini" @click="doSubmit">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :visible.sync="dataDialog" title="数据源关联" width="400px" top='40vh'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="关联类型" size='mini'>
          <el-select v-model="pointTo" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in DS_JIONTYPE" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dataDialog = false">取消</el-button>
        <el-button type="primary" size="mini" @click="lineTypeChange">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vueSplitpane from 'vue-splitpane'
export default {
  props: {
    listLeft: {
      type: Array,
      default: () => {return []}
    },
    listRight: {
      type: Array,
      default: () => {return []}
    },
    DS_ON_SYMBOL: {
      type: Array,
      default: () => {return []}
    },
    DS_JIONTYPE: {
      type: Array,
      default: () => {return []}
    },
  },
  components: {vueSplitpane},
  data() {
    return {
      leftData: this.listLeft,
      rightData: this.listRight,
      myCanvas: null,
      startIndex: '',
      endIndex: '',
      canHeight: 0,
      //LeftJoin左 RightJoin右 InnerJoin内 FullJoin全
      pointTo: '',
      visible: false,
      left: 0,
      top: 0,
      selectTag: null,
      selectIndex: 0,
      selectSource: '',
      dataDialog: false,
      ruleForm: {
        id: '',
        reportCode: '',
        dsCode: '',
        dsFieldCode: '',
        dsFieldType: '',
        symbol: '',
        value1: ''
      },
      options: [],
      rules: {
        symbol: [{ required: true, message: '请选择', trigger: 'blur' }],
        value1: [{ required: true, message: '请输入', trigger: 'blur' }],
      },
      dialog: false
    }
  },
  computed: {
    filterState() {
      return (dsFieldCode, key, tit) => {
        const index = this.$store.state.visualDesign[key].findIndex(item => item.dsFieldCode === dsFieldCode)
        if (index !== -1) {
          if (tit) {
            const obj = this.$store.state.visualDesign[key][index]
            let tit = '';
            this.DS_ON_SYMBOL.map(item => {
              if (item.value === obj.symbol) {
                return tit = item.label
              }
            })
            return tit + ' ' + obj.value1
          } else {
            return 'el-icon-wind-power'
          }
        }
      }
    },
    IsUserLine() {
      if (!this.selectTag) {return false}
      const dsFieldCode = this.selectTag.dsFieldCode,
            dsLinks = this.$store.state.visualDesign.dsLinks;
      const index = dsLinks.findIndex(item => item.links[0].rightDsFieldCode === dsFieldCode || item.links[0].leftDsFieldCode === dsFieldCode)
      if (index !== -1) {
        return true
      }
    },
    IsUserFilter() {
      let fun = 'lFilterData'
      if (this.selectSource == 'rightData') {
        fun = 'RFilterData'
      }
      const index = this.$store.state.visualDesign[fun].findIndex(item => item.dsFieldCode === this.selectTag.dsFieldCode)
      if (index !== -1) {
        return true
      }
    }
  },
  mounted() {
    if (this.leftData.length) {
      this.init()
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    'listLeft.length'() {
      console.log(this.listLeft)
      this.init()
    }
  },
  methods: {
    lineTypeChange() {
      const dsLinks = this.$store.state.visualDesign.dsLinks;
      dsLinks.map(item => {
        item.joinType = this.pointTo
        return false
      })
      this.$store.commit('SET_DS_LINKS', dsLinks)
      this.myCanvas.clearRect(0, 0, 100, this.canHeight)
      this.$store.state.visualDesign.dsLinks.map(item => {
        this.settingOut(item)
      })
      this.dataDialog = false
    },
    cancel() {
      this.$refs['ruleForm'].resetFields()
      this.dialog = false
    },
    filterAdd() {
      let fun = 'lFilterData'
      if (this.selectSource == 'rightData') {
        fun = 'RFilterData'
      }
      const index = this.$store.state.visualDesign[fun].findIndex(item => item.dsFieldCode === this.selectTag.dsFieldCode)
      if (index !== -1) {
        this.ruleForm = JSON.parse(JSON.stringify(this.$store.state.visualDesign[fun][index]))
      } else {
        this.ruleForm = {
          id: '',
          reportCode: '',
          dsCode: '',
          dsFieldCode: '',
          dsFieldType: '',
          symbol: '',
          value1: ''
        }
      }
      this.dialog = true
    },
    filterClear() {
      let fun = 'lFilterData'
      if (this.selectSource == 'rightData') {
        fun = 'RFilterData'
      }
      this.$store.commit('CLEAR_FILTER_DATA', fun, this.selectTag.dsFieldCode)
    },
    lineClear() {
      const dsFieldCode = this.selectTag.dsFieldCode,
            dsLinks = this.$store.state.visualDesign.dsLinks;
      let leftCode, rightCode, delIndex;
      dsLinks.findIndex((item, index) => {
        if (item.links[0].leftDsFieldCode === dsFieldCode) {
          leftCode = dsFieldCode
          rightCode = item.links[0].rightDsFieldCode
          this.pointTo = item.joinType
          delIndex = index
          return false;
        }
        if (item.links[0].rightDsFieldCode === dsFieldCode) {
          rightCode = dsFieldCode
          leftCode = item.links[0].leftDsFieldCode
          this.pointTo = item.joinType
          delIndex = index
          return false;
        }
      })
      this.startIndex = this.leftData.findIndex(item => item.dsFieldCode === leftCode)
      this.endIndex = this.rightData.findIndex(item => item.dsFieldCode === rightCode)
      this.$store.commit('DEL_DS_LINKS', delIndex)
      this.myCanvas.clearRect(0, 0, 100, this.canHeight)
      this.$store.state.visualDesign.dsLinks.map(item => {
        this.settingOut(item)
      })
    },
    doSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const form = {
            id: this.selectTag.id,
            reportCode: this.selectTag.reportCode,
            dsCode: this.selectTag.dsCode,
            dsFieldCode: this.selectTag.dsFieldCode,
            dsFieldType: this.selectTag.dsFieldType,
            symbol: this.ruleForm.symbol,
            value1: this.ruleForm.value1
          }
          let fun = 'ADD_FILTER_DATA_L'
          if (this.selectSource == 'rightData') {
            fun = 'ADD_FILTER_DATA_R'
          }
          this.$store.commit(fun, form)
          this.cancel()
        }
      })
    },
    addOut() {
      this.$store.commit('ADD_OUTPUT', this.selectTag)
    },
    init() {
      this.leftData = this.listLeft
      this.rightData = this.listRight
      this.$nextTick(() => {
        this.canHeight = this.$refs.oul.clientHeight
        this.myCanvas = this.$refs.myCanvas.getContext("2d");
      })
    },
    closeMenu() {
      this.visible = false
    },
    openMenu(tag, e, refDom, index) {
      // const menuMinWidth = 105
      // const offsetLeft = this.$refs[refDom].getBoundingClientRect().left // container margin left
      // const offsetWidth = this.$refs[refDom].offsetWidth // container width
      // const maxLeft = offsetWidth - menuMinWidth // left boundary
      // const left = e.clientX - offsetLeft + 30 // 15: margin right

      // if (left > maxLeft) {
      //   this.left = maxLeft
      // } else {
      //   this.left = left
      // }
      this.left = e.pageX - 180
      this.top = e.screenY - 160

      this.selectTag = tag
      this.selectSource = refDom === 'oul' ? 'leftData' : 'rightData'
      this.selectIndex = index
      this.visible = true

    },
    pressLeft(index, e) {
      // button 0 1 2 左中右键
      if (e.button == 2) return false
      if (this.pointTo == 'RightJoin') return false
      this.startIndex = index
    },
    pressRight(index, e) {
      // 如果左连接不执行
      if (e.button == 2) return false
      if (this.pointTo == 'LeftJoin') return false
      this.startIndex = index
    },
    upliftLeft(index, e) {
      if (e.button == 2) return false
      if (this.pointTo == 'LeftJoin') return false
      this.endIndex = index
      if (!this.pointTo.length) {
        this.pointTo = 'RightJoin'
      }
      this.saveData().then(obj => {
        if (obj) {
          this.settingOut(obj)
        }
      })
    },
    upliftRight(index, e) {
      if (e.button == 2) return false
      if (this.pointTo == 'RightJoin') return false
      this.endIndex = index
      if (!this.pointTo.length) {
        this.pointTo = 'LeftJoin'
      }
      this.saveData().then(obj => {
        if (obj) {
          this.settingOut(obj)
        }
      })
    },
    settingOut(obj) {
      const joinType = obj.joinType
      this.myCanvas.beginPath();
      let startIndex, endIndex;
      // 线样式
      this.myCanvas.strokeStyle = '#959597';
      this.myCanvas.lineWidth = 1;
      const titleHeight = 50, itemHeight = 30, canvasWidth = 100, config = {fill: 0};
      if (joinType == 'LeftJoin') { // 左 → 右
        config.xL = 0
        config.xR = 100
        config.ps = 15
        config.fPs = 85
        config.c = 20
        config.line = 25
        startIndex = this.leftData.findIndex(item => item.dsFieldCode === obj.links[0].leftDsFieldCode)
        endIndex = this.rightData.findIndex(item => item.dsFieldCode === obj.links[0].rightDsFieldCode)
      } else if (joinType == 'RightJoin') { // 左 ← 右
        config.xR = 0
        config.xL = 100
        config.ps = 85
        config.fPs = 15
        config.c = 80
        config.line = 75
        endIndex = this.leftData.findIndex(item => item.dsFieldCode === obj.links[0].leftDsFieldCode)
        startIndex = this.rightData.findIndex(item => item.dsFieldCode === obj.links[0].rightDsFieldCode)
      } else if (joinType == 'InnerJoin') {
        config.xL = 0
        config.xR = 100
        config.ps = 15
        config.fPs = 85
        config.c = 20
        config.line = 15
        //内连接
        startIndex = this.leftData.findIndex(item => item.dsFieldCode === obj.links[0].leftDsFieldCode)
        endIndex = this.rightData.findIndex(item => item.dsFieldCode === obj.links[0].rightDsFieldCode)
      } else if (joinType == 'FullJoin') {
        config.xL = 0
        config.xR = 100
        config.ps = 15
        config.fPs = 85
        config.c = 20
        config.c2 = 80
        config.line = 25
        config.fill = -10
        //全连接
        startIndex = this.leftData.findIndex(item => item.dsFieldCode === obj.links[0].leftDsFieldCode)
        endIndex = this.rightData.findIndex(item => item.dsFieldCode === obj.links[0].rightDsFieldCode)
      }
      // 两边三角
      this.myCanvas.moveTo(config.xL, titleHeight + startIndex * itemHeight)
      this.myCanvas.lineTo(config.ps, titleHeight + startIndex * itemHeight + itemHeight / 2)
      this.myCanvas.lineTo(config.xL, titleHeight + (startIndex + 1) * itemHeight);
      this.myCanvas.closePath();
      this.myCanvas.stroke();

      // 反三角
      this.myCanvas.moveTo(config.xR, titleHeight + endIndex * itemHeight); 
      this.myCanvas.lineTo(config.fPs, titleHeight + endIndex * itemHeight + itemHeight / 2); 
      this.myCanvas.lineTo(config.xR, titleHeight + (endIndex + 1) * itemHeight);
      this.myCanvas.closePath();
      this.myCanvas.stroke();
      // 圆 内不加
      if (joinType !== 'InnerJoin') {
        this.myCanvas.beginPath();
        this.myCanvas.arc(config.c, titleHeight + startIndex * itemHeight + itemHeight / 2, 5, 0, 2*Math.PI);
        this.myCanvas.stroke();
      }

      if (joinType == 'FullJoin') {
        this.myCanvas.beginPath();
        this.myCanvas.arc(config.c2, titleHeight + endIndex * itemHeight + itemHeight / 2, 5, 0, 2*Math.PI);
        this.myCanvas.stroke();
      }
      
      // 连线
      this.myCanvas.moveTo(config.line, titleHeight + startIndex * itemHeight + itemHeight / 2);
      this.myCanvas.lineTo(config.fPs + config.fill, titleHeight + endIndex * itemHeight + itemHeight / 2); // 0 + 17  50 + 17
      this.myCanvas.closePath();
      this.myCanvas.stroke();
      // this.myCanvas.save()
      
    },
    saveData() {
      return new Promise(resovle => {
        if (typeof this.endIndex == 'number' && typeof this.startIndex == 'number') {
          let storeData = {};
          if (this.pointTo == 'LeftJoin') { // 左 → 右
            storeData.startIndex = this.startIndex
            storeData.endIndex = this.endIndex
          } else {
            storeData.startIndex = this.endIndex
            storeData.endIndex = this.startIndex
          }
          // 先保存数据
          let obj = {
            id: '',
            reportCode: '',
            leftDsCode: this.leftData[storeData.startIndex].dsCode,
            joinType: this.pointTo,
            rightDsCode: this.rightData[storeData.endIndex].dsCode,
            remark: '',
            links: [{
              id: '',
              tableLinkId: '',
              leftDsCode: this.leftData[storeData.startIndex].dsCode,
              leftDsFieldCode: this.leftData[storeData.startIndex].dsFieldCode,
              symbol: 'eq',
              rightDsCode: this.rightData[storeData.endIndex].dsCode,
              rightDsFieldCode: this.rightData[storeData.endIndex].dsFieldCode
            }]
          }
          const dsLinks = this.$store.state.visualDesign.dsLinks
          
          const index = dsLinks.findIndex(item => item.links[0].leftDsFieldCode === obj.links[0].leftDsFieldCode || item.links[0].rightDsFieldCode === obj.links[0].rightDsFieldCode)
          if (index === -1) {
            this.$store.commit('SET_DS_LINKS', obj)
            resovle(obj)
          } else {
            this.startIndex = ''
            this.endIndex = ''
            resovle(false)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .designDom {
    display: flex;
    justify-content: center;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
    ul {
      width: 40%;
      h3 {
        text-align: center;
        background-color: #1b2d3e;
        height: 50px;
        line-height: 50px;
        color: #fff;
        margin: 0;
        font-size: 12px;
        font-weight: normal;

      }
      li {
        display: flex;
        align-items: center;
        padding: 0 10px;
        line-height: 30px;
        height: 30px;
        font-size: 12px;
        background-color: #e7e9ed;
        border-bottom: 1px solid #dadce1;
        &:hover{
          background-color: #e8f4ff;
          cursor: pointer;
        }
        i {
          color: #ffc833;
          width: 20px;
          font-size: 14px;
        }
        u {
          color: #86b8e6;
          text-decoration: none;
        }
        s {
          background-color: #ff8b00;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin: 0 7px;
        }
        div {
          flex: 5;
          height: 100%;
          & /deep/ .splitter-pane-resizer {
            background-color: #aa9f9f;
          }
          b {
          font-size: 14px;
          width: 40%;
          }
          b, span {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
          }
          span {
            color: #959597;
            width: 60%;
          }
        }
      }
    }
    
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>
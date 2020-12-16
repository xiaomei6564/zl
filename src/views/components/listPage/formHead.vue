<!--业务单位弹框---->
<template>
  <el-dialog title="更改字段配置" 
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-loading='loading'
    width="80%">
    <div class="content" ref="contnetBox">
      <div class="left">
        <el-input v-model="params.filedNames" placeholder="请输入字段名" size="mini" style="width: 200px;margin: 5px 0" @keyup.enter.native="searchData"  />
        <el-button size="mini" type="success" icon="el-icon-search" @click="searchData">搜索</el-button>
        <el-button size="mini" type="primary" icon="el-icon-add" @click="moveData('left')">添加</el-button>
        <module-title name="未选字段"></module-title>
        <el-table ref="multipleTableLeft" size='mini' border :data="leftShowData" tooltip-effect="dark" style="width: 100%" @selection-change="leftSelectionChange">
          <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip label="字段" prop="filed"></el-table-column>
          <el-table-column show-overflow-tooltip label="字段名">
            <template slot-scope="scope">
              {{scope.row.filedNames || scope.row.showName}}
            </template>
          </el-table-column>
          <!-- <el-table-column show-overflow-tooltip label="长度" prop="filedLength"></el-table-column> -->
          <el-table-column show-overflow-tooltip label="维度指标标识">
            <template slot-scope="scope">
              {{scope.row.dimensionIndicatorIdentification == 'K' ? '指标' : '维度'}}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="total"
          :current-page="params.page" 
          style="margin-top: 8px;"
          layout="total, prev, pager, next"
          @current-change="pageChange"/>
      </div>
      <div class="right">
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="moveData('right')">移除</el-button>
        <module-title name="已选字段"></module-title>
        <el-table ref="multipleTableRight" id="righttuozhuai" highlight-current-row row-key='id' border size='mini' :data="rightData" tooltip-effect="dark" style="width: 100%" @selection-change="rightSelectionChange">
          <el-table-column show-overflow-tooltip type="selection" width="55"></el-table-column>
          <el-table-column show-overflow-tooltip label="字段" prop="filed"></el-table-column>
          <el-table-column show-overflow-tooltip label="字段名" prop="filedNames"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip label="长度" prop="filedLength"></el-table-column> -->
          <el-table-column show-overflow-tooltip label="维度指标标识">
            <template slot-scope="scope">
              {{scope.row.dimensionIndicatorIdentification == 'K' ? '指标' : '维度'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="聚合">
            <template slot-scope="scope">
              <el-select v-model="scope.row.type" clearable placeholder="请选择" size="mini" :disabled="scope.row.dimensionIndicatorIdentification != 'K'">
                <el-option v-for="item in dicts" :key="item.id" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :total="rightData.length"
          style="margin-top: 8px;"
          layout="total" />
        <div class="huise">* 支持对已选字段进行拖拽移动，来调整查询表格的显示顺序。</div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import initDict from '@/mixins/initDict'
import Sortable from 'sortablejs'
import moduleTitle from '@/views/components/ModuleTitle.vue'; //模块标题

export default {
  mixins: [initDict],
  components: {moduleTitle},
  data(){
    return{
      dialogVisible: false,
      leftAllData: [],
      leftShowData: [],
      loading: false,
      total: 0,
      params: {
        page: 1,
        size: 10,
        filedNames: ''
      },
      selectLeftData: [],
      rightData: [],
      selectRightData: [],
      initState: false,
    }
  },
  watch: {
    leftAllData() {
      this.formatDate()
      if (!this.initState) {
        this.initState = true
        this.$nextTick(() => {
          this.rowDrop()
        })
      }
    }
  },
  created() {
    this.getDict('FIELD_AGGRATATION')
  },
  methods:{
    formatDate(searchData) {
      let allData = searchData ? searchData : JSON.parse(JSON.stringify(this.leftAllData))
      let startNum = this.params.size * (this.params.page - 1), endNum = this.params.size * (this.params.page);
      this.leftShowData = allData.slice(startNum, endNum)
      this.total = allData.length
    },
    searchData() {
      if (this.params.filedNames) {
        let allDate = JSON.parse(JSON.stringify(this.leftAllData))
        let data = allDate.filter(item => (item.filedNames || item.showName).indexOf(this.params.filedNames) !== -1)
        this.params.page = 1
        this.formatDate(data)
      } else {
        this.params.page = 1
        this.formatDate()
      }
    },
    moveData(name) {
      let selectKey = 'selectRightData', data = 'leftAllData', reverseData = 'rightData';
      if (name === 'left') {
        selectKey = 'selectLeftData'
        data = 'rightData'
        reverseData = 'leftAllData'
      }
      if (this[selectKey].length) {
        this[data] = [...this[data], ...this[selectKey]]

        for(let i = 0; i < this[reverseData].length; i++) {
          const index = this[selectKey].findIndex(it => this[reverseData][i].filed === it.filed)
          if (index !== -1) {
            this[reverseData].splice(i, 1)
            i--;
          }
        }
        this.$refs.multipleTableLeft.clearSelection();
        this.$refs.multipleTableRight.clearSelection();
      } else {
        this.$message.warning('请选择一行！')
      }
    },
    del() {
      if (this.selectRightData.length) {
        
        this.$refs.multipleTableRight.clearSelection();
      } else {
        this.$message.warning('请选择一行！')
      }
    },
    pageChange(val) {
      this.params.page = val
      this.selectLeftData = []
      this.formatDate()
    },
    leftSelectionChange(val) {
      this.selectLeftData = val
    },
    rightSelectionChange(val) {
      this.selectRightData = val
    },
    showDialog(data){
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible = false;
    },
    // 确定
    doSubmit(){
      if (!this.rightData.length) return this.$message.warning('请选择展示数据！')
      // 数组里有三个字段分别是： filed 字段、dimensionIndicatorIdentification 维度指标、type 聚合类型
      let aggregation = []
      const typeindex = this.rightData.findIndex(item => item.type)
      if (typeindex !== -1) {
        this.$confirm('系统准备按预设的条件进行动态聚合运算，可能需要一点时间，确认吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          aggregation = this.rightData.map(item => {
            return {
              filed: item.filed,
              dimensionIndicatorIdentification: item.dimensionIndicatorIdentification,
              type: item.type || ''
            }
          })
          this.$emit('changeValue', this.rightData, aggregation)
          this.closeDialog()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
        
      } else {
        this.$emit('changeValue', this.rightData, aggregation)
        this.closeDialog()
      }
      
    },
    // 行拖拽
    rowDrop () {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector('#righttuozhuai .el-table__body-wrapper tbody');
      const _this = this;
      Sortable.create(tbody, {
      //  指定父元素下可被拖拽的子元素
        draggable: ".el-table__row",
        onEnd ({ newIndex, oldIndex }) {
          const currRow = _this.rightData.splice(oldIndex, 1)[0];
          _this.rightData.splice(newIndex, 0, currRow);
        }
      });
      this.$refs.contnetBox.ondrop = function (event) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }
}

</script>
<style scoped lang='scss'>
  .content {
    display: flex;
    justify-content: space-between;
    .left, .right{ 
      width: 48%;
    }
  }
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
  .huise {
    color: #968e8e;
    font-size: 12px;
    font-style: italic;
  }
</style>
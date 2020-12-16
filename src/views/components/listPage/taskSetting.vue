<template>
  <el-dialog 
  title="任务设定"
  custom-class="taskSetting-dialog hasModuler-dialog"
  :visible.sync="dialogVisible"
  :append-to-body="true"
  width="600px"
  top='5vh'
  :before-close="closeDialog">
  <div class="dialog-module"> 
    <div class="dialog-module-title">
      <span class="ms">业务查询条件</span>
      <div class="more-btn" @click="moreFn">
         更多查询条件
         <i :class="!moreSearch?'el-icon-arrow-down':'el-icon-arrow-up'"></i>
      </div>
    </div>
    <div class="dialog-module-search">
      <!-- <searchFormModule ref="searchForm" :showSearch="showSearch" type="dialog"></searchFormModule> -->
    </div>
  </div>
  <div class="dialog-module"> 
    <div class="dialog-module-title">
      <span class="ms">快照任务设定</span>
    </div>
     <el-form class="com-search-form" label-position="top">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item  label="任务设定表单" required>
              <el-input placeholder="输入表单名称" v-model="snapJobFrom.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="任务名称" required>
              <el-input placeholder="输入任务名称"  v-model="snapJobFrom.task"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item  label="类型" required>
              <el-radio-group v-model="snapJobFrom.type">
                <el-radio :label="1">周期重复</el-radio>
                <el-radio :label="2">仅此一次</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="snapJobFrom.type==1">
            <el-form-item  label="周期" required>
              <el-select   v-model="snapJobFrom.cycle" placeholder="请选择周期">
                <el-option v-for="(item, index) in selectObj.cycle"  :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
           <el-col :span="16" v-if="snapJobFrom.type==1">
            <el-form-item  label="时间" required>
              <!--周-->
              <el-select v-if="snapJobFrom.cycle==2"  v-model="snapJobFrom.week" placeholder="请选择周" style="width:45%;margin-right: 10px">
                <el-option v-for="(item, index) in selectObj.week"  :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <!--月-->
              <el-select v-if="snapJobFrom.cycle==3"  v-model="snapJobFrom.month" placeholder="请选择日" style="width:45%;margin-right: 10px">
                <el-option v-for="(item, index) in selectObj.month"  :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <!--时间-->
             <el-time-picker
                v-model="snapJobFrom.time"
                placeholder="任意时间点"
                style="width:45%">
              </el-time-picker>
            </el-form-item>
          </el-col>
           <el-col :span="8" v-if="snapJobFrom.type==1">
             <el-form-item  label="到期终止时间" required>
               <el-date-picker
                  v-model="snapJobFrom.endTime"
                  align="right"
                  type="date"
                  placeholder="选择日期">
                  </el-date-picker>
             </el-form-item> 
           </el-col> 
           <el-col :span="24" >
             <el-form-item  label="描述" required>
               <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="snapJobFrom.describe">
                </el-input>
             </el-form-item>
           </el-col>  
        </el-row>
     </el-form>
  </div>   
  <div slot="footer" class="dialog-footer">
    <el-button size="small" type="text" @click="closeDialog">取消</el-button>
    <el-button size="small" type="primary" @click="closeDialog">确认</el-button>
  </div>
  </el-dialog>
</template>

<script>
// import searchFormModule from './searchForm' 
export default {
  props:{
   
  },
  data(){
    return {
      dialogVisible: false,
      showSearch: true, //搜索区域展示隐藏
      moreSearch: false,
      snapJobFrom:{ //快照任务设定
       name: '',
       task:'',
       type: 1,
       cycle: 3, 
       week:'', //周
       time:'', //点
       month:'', //月
       endTime:'' ,//到期终止时间
       describe: '', //描述
      },
      selectObj:{
        cycle:[
          {id: 1, name: '每日'},
          {id: 2, name: '每周'},
          {id: 3, name: '每月'}
        ],
        week:[
          {id: 1, name: '周日'},
          {id: 2, name: '周一'},
          {id: 3, name: '周二'},
          {id: 4, name: '周三'},
          {id: 5, name: '周四'},
          {id: 6, name: '周五'},
          {id: 7, name: '周六'},
        ],
        month:[
          {id: 1, name: '1'},
          {id: 2, name: '2'},
          {id: 3, name: '3'},
          {id: 4, name: '4'},
          {id: 5, name: '5'},
          {id: 6, name: '6'},
        ]
      }
    }
  },
  components:{
    // searchFormModule
  },
  methods:{
    showDialog(){
     this.dialogVisible = true
    },
    closeDialog(){
     this.dialogVisible = false
    },
    moreFn(){
      this.moreSearch = !this.moreSearch;
      this.$refs.searchForm.moreFn()
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" >
.taskSetting-dialog{
 
}
</style>
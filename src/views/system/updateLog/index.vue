<template>
  <div class="updateLog" style="padding: 20px" v-loading='loading'>
    <div class="head-container" v-if='btn'>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
    </div>
    <el-card class="box" v-for="item in data" :key="item.id">
      <module-title :class='active === item.id ? "active" : ""' :name="item.subordinateVersion" @click.native="selectTab(item.id)">
        <span class="tit">发布时间：{{parseDate(item.updateTime, '-')}}</span>
      </module-title>
      <el-table :data="item.list" size="small" stripe style="width: 100%" v-if="active === item.id">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="problemType" label="类型" width="180"></el-table-column>
        <el-table-column prop="problemDesc" label="内容"></el-table-column>
        <el-table-column label="操作" width="180px" align="center" v-if='btn'>
          <template slot-scope="scope">
            <el-button size="mini" style="margin-right: 3px;"  type="primary" icon="el-icon-edit" @click="edit(scope.row, item.subordinateVersion)">编辑</el-button>
            <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id][0].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <e-form :is-add='isAdd' ref="form" :type-list='selectObj.PROBLEM_TYPE' :version-list='selectObj.SUBORDINATE_VERSION' />
  </div>
</template>
<script>
import { parseDate, downloadFile } from '@/utils/index'
import moduleTitle from '@/views/components/ModuleTitle.vue' //模块标题
import { initData } from '@/api/data'
import { del, downloadSystemUpdateLog } from '@/api/systemUpdateLog'
import initDict from '@/mixins/initDict'
import eForm from './form'
export default {
  props: {
    btn: {
      type: Boolean,
      default: true
    }
  },
  mixins: [initDict],
  data() {
    return {
      loading: false,
      data: [],
      active: 0,
      delLoading: false,
      downloadLoading: false,
      isAdd: false,
      selectObj: {}
    }
  },
  components: {moduleTitle, eForm},
  created() {
    this.init()
    if (this.btn) {
      this.getDictMap('PROBLEM_TYPE,SUBORDINATE_VERSION').then(res => {
        this.selectObj = res
      })
    }
  },
  methods: {
    parseDate,
    add() {
      this.isAdd = true
      const _this = this.$refs.form
      _this.dialog = true
    },
    edit(data, subordinateVersion) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        problemType: data.problemType,
        problemDesc: data.problemDesc,
        subordinateVersion
      }
      _this.dialog = true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id][0].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          offset: 100,
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id][0].doClose()
        console.log(err.response.data.message)
      })
    },
    selectTab(id) {
      this.active = id
    },
    init() {
      this.loading = true
      initData('api/systemUpdateLog', {sort: 'id,desc'}).then(res => {

        this.data = res.reverse()
        this.active = this.data[0].id
        this.loading = false
      })
    },
    download() {
      this.init()
      this.downloadLoading = true
      downloadSystemUpdateLog(this.params).then(result => {
        downloadFile(result, '列表', 'xlsx')
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
    }
  }
}
</script>
<style scoped lang='scss'>
  .updateLog {
    .box {
      margin-bottom: 20px;
      .active {
        background: #ffc833;
      }
      .tit {
        font-size: 12px;
        color: #929292;
      } 
    }
    
  }
  
</style>
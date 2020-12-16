<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
    <div v-if="$store.state.settings.showFooter" id="el-main-footer">
      <span>{{msg.plateNumber}} {{msg.fullName}} {{msg.abbreviation}} </span>
      <a style="text-decoration: underline;cursor: pointer;margin: 0 5px" @click="dialogVisible = true">{{msg.currentVersion}}</a>
      <a style="text-decoration: underline;cursor: pointer;" @click='$router.push("/userUpdateLog")'>了解系统更新日志</a>
      <!-- <a href="http://www.beian.miit.gov.cn" target="_blank">{{ $store.state.settings.caseNumber }}</a> -->
    </div>
    <el-dialog title="版本组件" :visible.sync="dialogVisible" width="600px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false">
      <el-table :data="gridData" stripe style="width: calc(100% - 40px)">
        <el-table-column property="component" label="组件"></el-table-column>
        <el-table-column property="currentVersion" label="版本"></el-table-column>
        <el-table-column label="发布日期" property="releaseDate">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { getMsg } from '@/api/basicProductInformation'
import { list } from '@/api/componentInformation'
import { parseTime } from '@/utils/index'

export default {
  name: 'AppMain',
  data() {
    return {
      msg: {},
      dialogVisible: false,
      gridData: []
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  },
  methods: {
    parseTime
  },
  created() {
    getMsg().then(res => {
      this.msg = res.content[0]
      list().then(res1 => {
        this.gridData = res1.content
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    z-index: 88;
    /*84 = navbar + tags-view = 50 +34 */
    min-height: calc(100vh - 84px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      min-height: calc(100vh - 84px);
    }

    .fixed-header+.app-main {
      padding-top: 85px;
    }
  }
</style>


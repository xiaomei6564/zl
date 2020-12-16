<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon"/>
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <i :class=" 'iconfont '+item" style="height: 30px;width: 16px;" ></i>
        <!--<svg-icon :icon-class="item" style="height: 30px;width: 16px;" />-->
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import icons from './requireIcons'
export default {
  name: 'PanleIconSelect',
  data() {
    return {
      name: '',
      iconList: [
        'icon-zhexiantu1',
        'icon-shanxingtu',
        'icon-bar',
        'icon-zhuxingtu',
        'icon-61',
        'icon-zhexiantu',
        'icon-area-chart',
        'icon-heilongjiangtubiao09',
        'icon-iocnsandiantu',
        'icon-shujutu-copy-copy',
        'icon-shujutu4',
        'icon-shujutu3',
        'icon-shujutu2',
        'icon-shujutu1',
        'icon-shujutu',
        'icon-yidong1'
      ]
    }
  },
  methods: {
    filterIcons() {
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name))
      } else {
        this.iconList =  this.iconList
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = this.iconList
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
      height: 200px;
      overflow-y: scroll;
      div {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 50%;
        float: left;
      }
      span {
        display: inline-block;
        vertical-align: -0.55em;
        fill: currentColor;
        overflow: hidden;
      }
    }
  }
</style>

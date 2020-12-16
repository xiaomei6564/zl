<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <!-- background-color="#304156" -->
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="$store.state.settings.uniqueOpened"
      mode="vertical"
      
      background-color="#595959"
      text-color="#bfcbd9"
      active-text-color="#bfcbd9"
    >
      <Logo :is-collapse="isCollapse"/>
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-menu-item.is-active {
    background-color: #000!important;
    border-left: 4px solid #ed7d31;
    padding-left: -4px!important;
  }
  /deep/ .el-menu-item {
    text-align: center;
    font-size: 16px;
    height: 60px;
    line-height: 60px;
    padding-left: 0!important;
  }
</style>

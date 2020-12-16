<template>
  <div class="treeNode">
    <div v-for="(item) in treeData" :key="item.id" class="treeNode_item">
      <div class="content" @click="selectItem(item)">
        <span>
          <i :class="item.open ? 'el-icon-plus' : 'el-icon-minus'"></i>
          <svg t="1590984038279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10941" width="16" height="16"><path d="M958.473611 844.240917c0 0 0-509.912455 0-560.039109 0-68.029396-61.916165-61.654198-61.916165-61.654198s-369.837186 0.436952-350.275665 0c-21.221324 0.436952-31.699979-11.090593-31.699979-11.090593s-14.758122-25.325805-41.218774-65.408709c-27.770484-42.004673-59.907415-35.106566-59.907415-35.106566L140.9021 110.941741c-75.53944 0-76.41232 72.65781-76.41232 72.65781s0 604.576465 0 656.886855c0 81.040734 61.217247 70.998007 61.217247 70.998007s730.330564 0 776.439718 0C967.643458 911.48339 958.473611 844.240917 958.473611 844.240917L958.473611 844.240917z" p-id="10942" fill="#f7c939"></path></svg>
          <b>{{item.description}}</b>
        </span>
        <span>{{item.id}}</span>
      </div>
      <template v-if="showOrHide(item)">
        <div v-for="(it, i) in item.children" :key="it.id" class="treeNode_item">
          <div :class="activeItemStyle(it, i)" @click="selectItem(it, i)">
            <span style="padding-left: 30px;">
              <i :class="it.open ? 'el-icon-plus' : 'el-icon-minus'" v-if="it.children && it.children.length"></i>
              <svg v-if="it.children && it.children.length" t="1590984038279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10941" width="16" height="16"><path d="M958.473611 844.240917c0 0 0-509.912455 0-560.039109 0-68.029396-61.916165-61.654198-61.916165-61.654198s-369.837186 0.436952-350.275665 0c-21.221324 0.436952-31.699979-11.090593-31.699979-11.090593s-14.758122-25.325805-41.218774-65.408709c-27.770484-42.004673-59.907415-35.106566-59.907415-35.106566L140.9021 110.941741c-75.53944 0-76.41232 72.65781-76.41232 72.65781s0 604.576465 0 656.886855c0 81.040734 61.217247 70.998007 61.217247 70.998007s730.330564 0 776.439718 0C967.643458 911.48339 958.473611 844.240917 958.473611 844.240917L958.473611 844.240917z" p-id="10942" fill="#f7c939"></path></svg>
              <svg v-else t="1591066675546" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3101" width="14" height="14"><path d="M36.197719 837.475285a186.768061 186.768061 0 0 0 186.524714 186.524715h578.555134a186.646388 186.646388 0 0 0 186.524714-186.524715v-650.95057A186.646388 186.646388 0 0 0 801.277567 0H222.722433A186.768061 186.768061 0 0 0 36.197719 186.524715z m83.832699 0v-650.95057a102.813688 102.813688 0 0 1 102.692015-102.692015h578.555134a102.935361 102.935361 0 0 1 102.813688 102.692015v650.95057a102.935361 102.935361 0 0 1-102.813688 102.692015H222.722433a102.813688 102.813688 0 0 1-102.692015-102.692015z" fill="#1296db" p-id="3102"></path><path d="M222.722433 306.737643H812.471483a41.855513 41.855513 0 0 0 0-83.711027H222.722433a41.855513 41.855513 0 0 0 0 83.711027zM222.722433 565.657795H812.471483a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327zM222.722433 824.577947h597.171103a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327z" fill="#1296db" p-id="3103"></path></svg>
              <b>{{it.dsFieldCode || it.description}}</b>
            </span>
            <span>{{it.id}}</span>
          </div>
          <template v-if="showOrHide(it)">
            <div v-for="(its) in it.children" :key="its.id" class="treeNode_item">
              <div :class="activeItemStyle(its)" @click="selectItem(its)">
                <span style="padding-left: 50px;">
                  <i :class="its.open ? 'el-icon-plus' : 'el-icon-minus'" v-if="its.children.length"></i>
                  <svg v-if="its.children.length" t="1590984038279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10941" width="16" height="16"><path d="M958.473611 844.240917c0 0 0-509.912455 0-560.039109 0-68.029396-61.916165-61.654198-61.916165-61.654198s-369.837186 0.436952-350.275665 0c-21.221324 0.436952-31.699979-11.090593-31.699979-11.090593s-14.758122-25.325805-41.218774-65.408709c-27.770484-42.004673-59.907415-35.106566-59.907415-35.106566L140.9021 110.941741c-75.53944 0-76.41232 72.65781-76.41232 72.65781s0 604.576465 0 656.886855c0 81.040734 61.217247 70.998007 61.217247 70.998007s730.330564 0 776.439718 0C967.643458 911.48339 958.473611 844.240917 958.473611 844.240917L958.473611 844.240917z" p-id="10942" fill="#f7c939"></path></svg>
                  <svg v-else t="1591066675546" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3101" width="14" height="14"><path d="M36.197719 837.475285a186.768061 186.768061 0 0 0 186.524714 186.524715h578.555134a186.646388 186.646388 0 0 0 186.524714-186.524715v-650.95057A186.646388 186.646388 0 0 0 801.277567 0H222.722433A186.768061 186.768061 0 0 0 36.197719 186.524715z m83.832699 0v-650.95057a102.813688 102.813688 0 0 1 102.692015-102.692015h578.555134a102.935361 102.935361 0 0 1 102.813688 102.692015v650.95057a102.935361 102.935361 0 0 1-102.813688 102.692015H222.722433a102.813688 102.813688 0 0 1-102.692015-102.692015z" fill="#1296db" p-id="3102"></path><path d="M222.722433 306.737643H812.471483a41.855513 41.855513 0 0 0 0-83.711027H222.722433a41.855513 41.855513 0 0 0 0 83.711027zM222.722433 565.657795H812.471483a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327zM222.722433 824.577947h597.171103a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327z" fill="#1296db" p-id="3103"></path></svg>
                  <b>{{its.dsFieldCode || its.description}}</b>
                </span>
                <span>{{its.id}}</span>
              </div>
              <template v-if="showOrHide(its)">
                <div v-for="(child) in its.children" :key="child.id" class="treeNode_item">
                  <div :class="activeItemStyle(child)" @click="selectItem(child)">
                    <span style="padding-left: 66px;">
                      <i :class="child.open ? 'el-icon-plus' : 'el-icon-minus'" v-if="child.children.length"></i>
                      <svg v-if="child.children.length" t="1590984038279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10941" width="16" height="16"><path d="M958.473611 844.240917c0 0 0-509.912455 0-560.039109 0-68.029396-61.916165-61.654198-61.916165-61.654198s-369.837186 0.436952-350.275665 0c-21.221324 0.436952-31.699979-11.090593-31.699979-11.090593s-14.758122-25.325805-41.218774-65.408709c-27.770484-42.004673-59.907415-35.106566-59.907415-35.106566L140.9021 110.941741c-75.53944 0-76.41232 72.65781-76.41232 72.65781s0 604.576465 0 656.886855c0 81.040734 61.217247 70.998007 61.217247 70.998007s730.330564 0 776.439718 0C967.643458 911.48339 958.473611 844.240917 958.473611 844.240917L958.473611 844.240917z" p-id="10942" fill="#f7c939"></path></svg>
                      <svg v-else t="1591066675546" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3101" width="14" height="14"><path d="M36.197719 837.475285a186.768061 186.768061 0 0 0 186.524714 186.524715h578.555134a186.646388 186.646388 0 0 0 186.524714-186.524715v-650.95057A186.646388 186.646388 0 0 0 801.277567 0H222.722433A186.768061 186.768061 0 0 0 36.197719 186.524715z m83.832699 0v-650.95057a102.813688 102.813688 0 0 1 102.692015-102.692015h578.555134a102.935361 102.935361 0 0 1 102.813688 102.692015v650.95057a102.935361 102.935361 0 0 1-102.813688 102.692015H222.722433a102.813688 102.813688 0 0 1-102.692015-102.692015z" fill="#1296db" p-id="3102"></path><path d="M222.722433 306.737643H812.471483a41.855513 41.855513 0 0 0 0-83.711027H222.722433a41.855513 41.855513 0 0 0 0 83.711027zM222.722433 565.657795H812.471483a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327zM222.722433 824.577947h597.171103a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327z" fill="#1296db" p-id="3103"></path></svg>
                      <b>{{child.dsFieldCode || child.description}}</b>
                    </span>
                    <span>{{child.id}}</span>
                  </div>
                  <template v-if="showOrHide(child)">
                    <div v-for="(childs) in child.children" :key="childs.id" class="treeNode_item">
                      <div :class="activeItemStyle(childs)" @click="selectItem(childs)">
                        <span style="padding-left: 82px;">
                          <!-- <i :class="childs.open ? 'el-icon-plus' : 'el-icon-minus'" v-if="childs.children.length"></i> -->
                          <svg v-if="childs.children.length" t="1590984038279" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10941" width="16" height="16"><path d="M958.473611 844.240917c0 0 0-509.912455 0-560.039109 0-68.029396-61.916165-61.654198-61.916165-61.654198s-369.837186 0.436952-350.275665 0c-21.221324 0.436952-31.699979-11.090593-31.699979-11.090593s-14.758122-25.325805-41.218774-65.408709c-27.770484-42.004673-59.907415-35.106566-59.907415-35.106566L140.9021 110.941741c-75.53944 0-76.41232 72.65781-76.41232 72.65781s0 604.576465 0 656.886855c0 81.040734 61.217247 70.998007 61.217247 70.998007s730.330564 0 776.439718 0C967.643458 911.48339 958.473611 844.240917 958.473611 844.240917L958.473611 844.240917z" p-id="10942" fill="#f7c939"></path></svg>
                          <svg v-else t="1591066675546" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3101" width="14" height="14"><path d="M36.197719 837.475285a186.768061 186.768061 0 0 0 186.524714 186.524715h578.555134a186.646388 186.646388 0 0 0 186.524714-186.524715v-650.95057A186.646388 186.646388 0 0 0 801.277567 0H222.722433A186.768061 186.768061 0 0 0 36.197719 186.524715z m83.832699 0v-650.95057a102.813688 102.813688 0 0 1 102.692015-102.692015h578.555134a102.935361 102.935361 0 0 1 102.813688 102.692015v650.95057a102.935361 102.935361 0 0 1-102.813688 102.692015H222.722433a102.813688 102.813688 0 0 1-102.692015-102.692015z" fill="#1296db" p-id="3102"></path><path d="M222.722433 306.737643H812.471483a41.855513 41.855513 0 0 0 0-83.711027H222.722433a41.855513 41.855513 0 0 0 0 83.711027zM222.722433 565.657795H812.471483a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327zM222.722433 824.577947h597.171103a41.977186 41.977186 0 0 0 0-83.8327H222.722433a41.977186 41.977186 0 0 0 0 83.8327z" fill="#1296db" p-id="3103"></path></svg>
                          <b>{{childs.dsFieldCode || childs.description}}</b> 
                        </span>
                        <span>{{childs.id}}</span>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>
      
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {return []}
    },
    moreSelect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeItem: '',
      selectData: [],
      treeData: this.data,
    }
  },
  watch: {
    data() {
      this.treeData = this.data
    }
  },
  computed: {
    showOrHide() {
      return (item) => {
        if (!item.open) {
          if (item.children) {
            return true
          }
        }
      }
    },
    activeItemStyle() {
      return (row, i) => {
        if (!this.moreSelect) {
          const index = this.selectData.findIndex(item => item.id == row.id)
          if (index !== -1) {
            return 'active content'
          } else {
            return 'content'
          }
        } else {
          if (i == this.$store.state.visualDesign.propertyIndex) {
            return 'active content'
          } else {
            return 'content'
          }
        }
      }
    },
    
  },
  created() {
    if (!this.moreSelect) {
      this.setSelect()
    }
  },
  methods: {
    setSelect() {
      this.selectData = this.$store.state.visualDesign.sourceData
    },
    selectItem(item, i) {
      if (item.children && item.children.length) {
        item.open = !!!item.open
        this.$forceUpdate()
      } else {
        if (!this.moreSelect) {
          // this.activeItem = item.id
          this.$store.dispatch('changeSourceData', item)
          this.setSelect()
        } else {
          this.$store.commit('SELECT_PROPERTY_INDEX', i)
        }
      }
    }
  }
}
</script>
<style scoped lang='scss'>
  .treeNode {
    font-size: 12px;
    color: #909399;
    .treeNode_item {
      .content {
        padding: 6px 0;
        display: flex;
        cursor: pointer;
        &:hover, &:active {
          background-color: #f5f7fa;
        }
        span {
          display: flex;
          align-items: center;
          padding: 0 10px;
          &:first-child {
            width: 50%;
          }
          &:last-child {
            flex: 1
          }
          i {
            margin-right: 3px;
            &:first-child {
              border: 1px solid #909399;
              font-size: 10px;
            }
          }
          b {
            margin-left: 3px;
            font-weight: normal;
          }
        }
      }
      .active {
        background-color: #4daaff30;
      }
    }
  }
</style>
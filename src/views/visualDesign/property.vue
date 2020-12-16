<template>
  <div class="property">
    <el-tabs v-model="active" type="border-card" size='mini' v-loading='loading'>
      <el-tab-pane label="Genera" name="Genera">
        <div class="property_box" v-if='data.dsFieldCode'>
          <div class="property_item" v-for="(item, key) in keyValue" :key="key">
            <template>
              <div class="property_box_left">
                {{item}}
              </div>
              <div class="property_box_right">
                <template v-if="!dataState[key]">
                  {{data[key]}}
                </template>
                <template v-else>
                  <el-input size="mini" v-if="key != 'orderSort'" :type="typeInput(key)" v-model="data[key]"></el-input>
                  <el-select size="mini" v-else v-model="data[key]" placeholder="请选择">
                    <el-option v-for="item in FIELD_ORDER" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </div>
              <div class="property_box_caozuo">
                <template v-if="caozuo(key)">
                  <el-button type="primary" v-if="!dataState[key]" @click="tabState(key, true)" size="mini" icon="el-icon-edit" circle></el-button>
                  <el-button type="success" v-else size="mini" @click="save(key, data[key])" icon="el-icon-check" circle></el-button>
                </template>
                
              </div>
            </template>
          </div>
        </div>
        
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: {
    FIELD_ORDER: {
      type: Array,
      default: () => {return []}
    }
  },
  data() {
    return {
      active: 'Genera',
      data: {},
      loading: false,
      dataState: {},
      keyValue: {
        dsAlias: '表别名',
        dsSql: '数据源sql',
        dsType: '数据源类型',
        dsCode: '表编码',
        dsName: '表名称',
        hanaTechcode: '技术名称',
        dsFieldCode: '字段',
        dsFieldName: '字段名称',
        dsFieldType: '字段类型',
        reportCode: '报表编码',
        label: '自定义显示名称',
        length: '字段长度',
        scale: '保留小数位',
        zsginFieldType: '指标维度',
        zsignIsDate: '是否日期',
        position: '显示位置',
        groupIndex: '分组下标',
        aggratation: '函数名称',
        orderIndex: '排序位置',
        orderSort: '排序方向',
        visable: '是否可见',
        remark: '报表备注',
        help: '报表帮助',
        fieldProp: '字段附属信息'
      }
    }
  },
  computed: {
    showPorperty() {
      return (key) => {
        return false
      }
    },
    typeInput() {
      return (key) => {
        if (key == 'groupIndex' || key == 'position' || key == 'orderIndex') {
          return 'number'
        } 
        return 'text'
      }
    },
    caozuo() {
      return (key) => {
        if (key == 'position' || key == 'groupIndex' || key == 'label' || key == 'aggratation' || key == 'orderIndex' || key == 'orderSort' || key == 'visable') {
          return true
        }
      }
    },
  },
  methods: {
    tabState(key, val) {
      this.$set(this.dataState, key, val)
      this.$forceUpdate()
    },
    save(key, val) {
      this.$store.commit('CHANGE_OUTPUT', {[key]: val})
      this.tabState(key, false)
    }
  },
  watch: {
    '$store.state.visualDesign.propertyIndex'(val) {
      this.data = this.$store.state.visualDesign.output[val]
    }
  }
}
</script>
<style lang="scss" scoped>
  .property {
    /deep/ .el-tabs__content {
      padding: 0;
    }
    .property_item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #dfe6ec;
      font-size: 12px;
      color: #606266;
      line-height: 28px;
      .property_box_left {
        flex: 1;
        border-right: 1px solid #dfe6ec;
      }
      .property_box_right {
        flex: 3
      }
      .property_box_caozuo {
        width: 30px;
        .el-button--mini.is-circle {
          padding: 4px;
        }
      }
      .property_box_left, .property_box_right {
        padding: 6px 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
  
</style>
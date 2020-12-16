<template>
  <div class="xsdcBox">
    <div class="labelBox flex">
      <span class="labelOne pointer" :class="{'selLabelOne':selLabelOne=='玉米'}" @click="selLabelOne='玉米'">玉米</span>
      <span class="labelOne pointer" :class="{'selLabelOne':selLabelOne=='小麦'}" @click="selLabelOne='小麦'">小麦</span>
    </div>
    <div class="xsdc_conBox flexJB">
      <div class="xsdc_conL">
        <div class="titleBox flexAC">
          <span class="line_yellow"></span>
          <span>销售达成全国视图</span>
          <img class="pointer" src="../../assets/zl/help.png" alt="">
        </div>
      </div>
      <div class="xsdc_conR">
        <div class="xsdc_tab flex">
          <div :class="{'xsdc_tab_selDiv':xsdc_tab_selDiv=='日常销售动态'}">日常销售动态</div>
          <div :class="{'xsdc_tab_selDiv':xsdc_tab_selDiv=='月度销售回顾'}">月度销售回顾</div>
        </div>
        <div class="xsdc_con_Child">
          <div class="titleBox flexAC">
            <span class="line_yellow"></span>
            <span>中粮贸易 - 当日实时对外销售表现</span>
            <img class="pointer" src="../../assets/zl/help.png" alt="">
          </div>
        </div>
        <div class="xsdc_con_Child xsdc_con_Child_m">
          <div class="titleBox flexAC">
            <span class="line_yellow"></span>
            <span>中粮贸易 - 累计对外销售达成进度</span>
            <img class="pointer" src="../../assets/zl/help.png" alt="">
          </div>
        </div>
        <div class="xsdc_con_Child">
          <div class="titleBox flexAC">
            <span class="line_yellow"></span>
            <span>中粮贸易 - 整体对外销售趋势</span>
            <img class="pointer" src="../../assets/zl/help.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data () {
    return {
      xsdc_tab_selDiv: '日常销售动态',
      selLabelOne: '玉米',
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {}
}
</script>
<style lang="scss">
.xsdcBox {
  padding: 10px;
  padding-top: 3px;
  padding-right: 10px;
  box-sizing: border-box;
  height: 100%;
  .labelBox {
    height: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #bbbbbb;
    align-items: flex-end;
    .labelOne {
      font-size: 15px;
      background: #7f7f7f;
      border-radius: 6px 6px 0 0;
      padding: 7px 20px;
      color: #fff;
      font-weight: 600;
      margin-right: 5px;
      margin-bottom: -1px;
    }
    .selLabelOne {
      background: #ed7d31;
    }
  }
  .xsdc_conBox {
    height: calc(100% - #{43px});
    padding-top: 10px;
    .titleBox {
      border-bottom: 1px solid #ebebeb;
      box-sizing: border-box;
      height: 40px;
      .line_yellow {
        width: 4px;
        height: 16px;
        background: #f4a015;
        margin-left: 10px;
        margin-right: 10px;
      }
      span {
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        font-weight: 600;
        margin-right: 5px;
      }
    }
    .xsdc_conL {
      background: #fff;
      width: calc(55% - #{5px});
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    .xsdc_conR {
      width: calc(45% - #{5px});
      .xsdc_tab {
        & > div {
          width: 50%;
          text-align: center;
          background: #7f7f7f;
          font-size: 15px;
          color: #fff;
          height: 30px;
          line-height: 30px;
          border-top-right-radius: 6px;
          border-top-left-radius: 6px;
          font-weight: 600;
        }
        .xsdc_tab_selDiv {
          background: #ed7d31;
        }
      }
      .xsdc_con_Child {
        height: 100%;
        background: #fff;
        height: calc((100% - #{50px}) / 3);
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
      .xsdc_con_Child_m {
        margin-top: 10px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>

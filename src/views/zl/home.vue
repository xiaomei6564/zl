<template>
  <div class="homeZL flexJB">
    <div class="navList">

      <div v-for="nav in navList" class="navBox pointer">
        <div class="navOne flexAC pore" :class="{navOneSel:selNav.parent==nav.name}">
          <span class="selYellow poab" v-if="selNav.parent==nav.name"></span>
          <span class="navOneName" :class="{navOneNameSel:selNav.parent==nav.name}">{{ nav.name }}</span>
          <span class="xialaImgSpan poab"><img :class="{rotate180:selNav.parent==nav.name,selNav:selNav.parent==nav.name}" class="xialaImg" src="../../assets/zl/xiala.png" alt=""></span>
        </div>
        <div v-for="navChild in nav.child" v-if="nav.child" class="navChildBox">
          <div class="flexAC pore navNameChildBox">
            <img class="selnavPoint" src="../../assets/zl/selNav.png" alt="" v-if="selNav.parent==nav.name&&selNav.child==navChild.name">
            <img v-else class="navPoint" src="../../assets/zl/pointer.png" alt="">
            <span class="navName" :class="{navNameSel:selNav.parent==nav.name&&selNav.child==navChild.name}">{{ navChild.name }}</span>
            <span class="xialaImgSpan poab" style="opacity: 0;"><img class="xialaImg" src="../../assets/zl/xiala.png" alt=""></span>
          </div>

        </div>
      </div>

    </div>
    <div class="container">
      <div class="topBox flexJB flexAC">
        <span class="flexAC">
          <svg :class="{'is-active':isActive}" class="openORclose" t="1492500959545" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" version="1.1" p-id="1691" width="64" height="64" @click="isActive=!isActive">
            <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />
          </svg>
          <span class="titleBox flexAC">
            <span>{{ title[0] }}</span>
            <span>/</span>
            <span>{{ title[1] }}</span>
          </span>
        </span>
        <span class="flexAC">
          <span class="dyTxt">欢迎数据视窗演示，当前账号授权数据范围：{{ path }}</span>
          <img class="tpImg" src="../../assets/zl/tp.png" alt="">
          <svg class="qpImg" t="1508738709248" viewBox="0 0 1024 1024" version="1.1" xmlns="" p-id="2069" width="32" height="32">
            <path d="M333.493443 428.647617 428.322206 333.832158 262.572184 168.045297 366.707916 64.444754 64.09683 64.444754 63.853283 366.570793 167.283957 262.460644Z" p-id="2070" />
            <path d="M854.845439 760.133334 688.61037 593.95864 593.805144 688.764889 759.554142 854.56096 655.44604 958.161503 958.055079 958.161503 958.274066 656.035464Z" p-id="2071" />
            <path d="M688.535669 428.550403 854.31025 262.801405 957.935352 366.921787 957.935352 64.34754 655.809313 64.081481 759.919463 167.535691 593.70793 333.731874Z" p-id="2072" />
            <path d="M333.590658 594.033341 167.8171 759.804852 64.218604 655.67219 64.218604 958.270996 366.342596 958.502263 262.234493 855.071589 428.421466 688.86108Z" p-id="2073" />
          </svg>
          <img class="userImg" src="../../assets/avatar/avatar.png" alt="">
          <span class="userTxt">
            <span>{{ user }}</span>
            <i class="el-icon-caret-bottom" />
          </span>

        </span>

      </div>
      <div class="conBox">
        <router-view/></router-view>
      </div>
      <div class="footer">SAP HANA提供实时计算服务</div>
    </div>
  </div>
</template>

<script>

export default {
  components: {},
  props: [],
  data () {
    return {
      selNav: {},
      navList: [
        { name: '业绩表现' },
        { name: '客户洞察' },
        { name: '销售达成' },
        { name: '粮源保障' },
        { name: '库存分布' },
        { name: '智能物流' },
        { name: '市场研判' }
      ],
      title: ['销售达成', '玉米'],
      path: '中粮贸易/数据分析',
      user: '用户名',
      isActive: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.selNav = { parent: '销售达成' }
  },
  mounted () { },
  methods: {}
}
</script>
<style lang="scss">
@import '~@/styles/common.scss';
.homeZL {
  height: 100%;
  width: 100%;
  .navList {
    width: 11%;
    height: 100%;
    overflow: auto;
    background: #373f52;
    padding-top: 50px;
    .navBox {
      .navOne {
        min-height: 54px;
        font-size: 16px;
        color: #ffffff;
        line-height: 14px;
        .navOneName {
          opacity: 0.65;
        }
        .navOneNameSel {
          opacity: 1;
        }
        .xialaImgSpan {
          img {
            opacity: 0.65;
          }
          .selNav {
            opacity: 1;
          }
        }
      }
      .navOneSel {
        background: #212838;
      }
      .navOneName {
        margin-left: 27%;
      }
    }
    .xialaImgSpan {
      padding-right: 5px;
      right: 5px;
    }
    .xialaImg {
      width: 14px;
    }
    .selYellow {
      display: inline-block;
      height: 54px;
      width: 4px;
      background: #f4a015;
    }
    .selnavPoint {
      width: 8px;
      margin-right: 9px;
    }
    .navPoint {
      margin-right: 5px;
      width: 12px;
    }
    .navChildBox {
      background: #0b1121;
      font-size: 16px;
      color: #ffffff;
      .navNameChildBox {
        padding-left: 27%;
      }
      .navName {
        opacity: 0.6;
      }
      .navNameSel {
        opacity: 1;
      }
      div {
        min-height: 54px;
      }
    }
  }
  .container {
    width: 89%;
    height: 100%;
    .topBox {
      box-sizing: border-box;
      padding-left: 15px;
      padding-right: 20px;
      width: 100%;
      height: 50px;
      .openORclose {
        display: inline-block;
        cursor: pointer;
        width: 24px;
        height: 24px;
        transition: 0.38s;
        transform-origin: 50% 50%;
        background: #f2f2f2;
        border-radius: 2px;
        padding: 2px;
      }
      .titleBox {
        span:first-child {
          font-size: 14px;
          color: #999999;
          margin-left: 30px;
        }
        span:nth-child(2) {
          color: #333333;
          font-size: 18px;
          margin-left: 8px;
          margin-right: 8px;
        }
        span:last-child {
          font-size: 14px;
          color: #333333;
        }
      }
      .is-active {
        transform: rotate(180deg);
      }
      .userImg {
        width: 30px;
      }
      .userTxt {
        color: rgba(0, 0, 0, 0.65);
        span {
          font-size: 14px;
          margin-left: 8px;
          margin-right: 5px;
        }
        i {
          color: rgba(0, 0, 0, 0.65);
          font-size: 12px;
        }
      }
      .tpImg,
      .qpImg {
        width: 18px;
        margin-right: 15px;
      }
      .dyTxt {
        font-size: 14px;
        color: #999999;
        margin-right: 20px;
      }
    }
    .conBox {
      width: 100%;
      height: calc(100% - #{82px});
      background: #f3f6f8;
    }
    .footer {
      height: 32px;
      background: #fff;
      text-align: center;
      line-height: 32px;
      font-size: 12px;
      color: #b9b9b9;
    }
  }
}
</style>

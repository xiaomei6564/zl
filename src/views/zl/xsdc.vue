<template>
  <div class="xsdcBox">
    <div class="xsdc-title">
        <ul class="tab-ul">
          <li class="active">日销售达成</li>
          <li>月度销售回顾</li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {}
}
</script>
<style lang="scss">
.xsdcBox {
  padding: 8px 12px;
  .xsdc-title{
    width:100%;
    height:40px;
    background-color:#fff;
    overflow:hidden;
    box-shadow: 0 2px 4px 0 rgba(57,89,183,0.10);
    .tab-ul{
      width:auto;
      height:100%;
      overflow:hidden;
      li{
        width:140px;
        height:40px;
        overflow:hidden;
        float:left;
        line-height:40px;
        text-align:center;
        color:#333;
        font-family: PingFangSC-Regular;
      }
      li.active{
        background-color:rgba(244,160,21,0.1);
        color: #F4A015;
      }
    }
  }
}
</style>

<template>
  <div class="designDom">
    <ul v-if="list.left.length">
      <h3 @click="active = 0" :style="!active ? 'background: #ff8b00' : ''"><b></b><span>{{list.left[0].dsName}}</span> <i></i></h3>
      <div v-if="!active">
        <li v-for="(child, index) in list.left" :key="index">
          <i></i>
          <b>{{child.dsFieldName}}</b>
          <span>{{child.dsFieldCode}}</span>
        </li>
      </div>
    </ul>
    <ul v-if="list.right.length">
      <h3 @click="active = 1" :style="active ? 'background: #ff8b00' : ''"><b></b><span>{{list.right[0].dsName}}</span> <i></i></h3>
      <div v-if="active">
        <li v-for="(child, key) in list.right" :key="key">
          <i></i>
          <b>{{child.dsFieldName}}</b>
          <span>{{child.dsFieldCode}}</span>
        </li>
      </div>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: {
        left: [],
        right: []
      },
      active: 0
    }
  },
  watch: {
    '$store.state.visualDesign.reqSourceData.left.length'() {
      this.list = this.$store.state.visualDesign.reqSourceData
    }
  },
  mounted() {
   
  },
  methods: {
    
  }
}
</script>
<style lang="scss" scoped>
  .designDom {
    display: flex;
    justify-content: center;
    flex-direction: column;
    moz-user-select: -moz-none;
    -moz-user-select: none;
    -o-user-select:none;
    -khtml-user-select:none;
    -webkit-user-select:none;
    -ms-user-select:none;
    user-select:none;
    ul {
      width: 100%;
      div {
        overflow-y: scroll;
        height: calc(100vh - 446px);
      }
      h3 {
        text-align: center;
        background-color: #3f5163;
        cursor: pointer;
        height: 50px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #fff;
        margin: 0;
        font-size: 12px;
        font-weight: normal;
        i {
          margin-top: 7px;
          border: 7px solid transparent;
          border-top-color: #fff;
        }
      }
      li {
        display: flex;
        align-items: center;
        padding: 0 10px;
        line-height: 30px;
        height: 30px;
        font-size: 12px;
        background-color: #e7e9ed;
        border-bottom: 1px solid #dadce1;
        u {
          color: #86b8e6;
          text-decoration: none;
        }
        i {
          background-color: #ff8b00;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 7px;
        }
        b {
          font-size: 14px;
          flex: 2;
        }
        span {
          color: #959597;
          flex: 3;
        }
      }
    }
    
  }
</style>
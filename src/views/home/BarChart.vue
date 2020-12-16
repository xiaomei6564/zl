<template>
  <div class="echartsDom">
    <div :class="className"  ref="echartsDom" :style="{height:height,width:width}"/>
    <div class="tip" v-show='tipState' :style="position">{{tipCon}}</div>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    color: {
      type: String,
      default: '#2f4554'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '220px'
    },
    titleRotate: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null,
      x:[],
      y:[],
      tipState: false,
      position: {
        left: 0,
        top: 0
      },
      tipCon: '',
      showState: false
    }
  },
  mounted() {
    // initDataPost("/homepage/trendChart", {viewCode: 'Analytic_001'}).then(result => {
    //   this.x = result.data.x;
    //   for(let i in result.data.y){
    //     result.data.y[i] = Number(result.data.y[i]).toFixed(0);
    //   }
    //   this.y = result.data.y;

    //   this.initChart()
    // })
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  created(){
  },
  methods: {
    initChart() {
      if (!this.showState) {
        this.chart = echarts.init(this.$refs.echartsDom, 'macarons')
      }
      this.chart.setOption({
        color: [this.color],
        background: '#ffff',
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 20,
          left: 20,
          right: 20,
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.x,
          axisTick: {
            show: false
          },
          axisLine:{
            lineStyle:{
              color: '#E8E9ED'
            }
          },
          triggerEvent: true,
          axisLabel:{
            color: '#646464',
            rotate: this.titleRotate,
            formatter: function(value) {//只显示4个字 其余省略号
              return value.length > 4 ? value.substring(0, 4) + '...' : value;
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          splitArea: {
              show: false
          },
          axisLabel:{
            color: '#646464'
          },
          axisLine:{
            show: false,
            lineStyle:{
              color: '#ACACAC'
            }
          }
        }],
        series: [{
          name: '签约量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '40%',
          data: this.y,
          animationDuration,
          itemStyle: {
            normal: {
              label : {
                color:'#646464',
                show: true,
                position: 'top'
              }
            }
          }
        }]
      })
      if (!this.showState) {
        this.showState = true
        let that = this
        this.chart.on('mouseover', function (params) {
          if( params.componentType == 'xAxis' ){
            if (params.value.length > 4) {
              that.position = {
                left: params.event.event.x+10 + 'px',
                top:  params.event.event.y+20 + 'px'
              }
              that.tipCon = params.value
              that.tipState = true
            }
            
          }

        });
        this.chart.on('mouseout', function (params) {
          that.tipState = false
        })
        this.chart.on('click', function (params) {
          that.$emit('tabData', params.name)
        });
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scope>
  .chart-box{
    height: 360px;
  }
  .echartsDom .tip {
    position: fixed;
    background: rgba(0,0,0,.7);
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 12px;
    color: #fff;
  }
</style>

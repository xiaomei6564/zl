<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { initData } from '@/api/data.js'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '220px'
    }
  },
  data() {
    return {
      chart: null,
      chardate:[],
      // data:[{"name":"国产玉米","value":3643035.168},{"name":"国产小麦","value":2270618.558},{"name":"进口小麦","value":873320.334},{"name":"稻谷","value":869926.447},{"name":"进口玉米","value":628235.039},{"name":"其它","value":753310.884}]
    }
  },
  created(){
    // this.getPieChatData();
  },
  mounted() {
    initData("/homepage/realTimeTrendChartByBreed").then(result => {
      // this.data = result;
      this.chardate = result;
      // console.log(this.data)
      this.initChart()
    })

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
  methods: {
    /*getPieChatData(){

    },*/
    initChart() {
      // this.getPieChatData();
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        color:[ '#FFCB6D', '#F19431', '#F56E49', '#69DCAF', '#5DA2F6'],
        legend: {
          bottom: 10,
          show:false
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} 吨'
        },
        calculable: true,
        series: [
          {
            name: '库存',
            type: 'pie',
            radius : '55%',
            center: ['50%', '45%'],
            data:this.chardate,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,

          }
        ]
      })
    }
  }
}
</script>

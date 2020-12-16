<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'


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
    color: {
      type: String,
      default: '#F9852E'
    },
    height: {
      type: String,
      default: '220px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null,
      chartData: {
        visitsData: [],
        ipData: []
      },
      weekDays: []
    }
  },
  mounted() {
    
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({ visitsData, ipData } = {}) {
      this.chart.setOption({
        color: [this.color],
        xAxis: {
          data: this.weekDays,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 20,
          right: 20,
          bottom: 20,
          top: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer:{
            lineStyle:{
              color: '#A8A8A8'
            }
          }
        },
        xAxis: {
          type: 'category',
           axisLine:{
            lineStyle:{
              color: '#E8E9ED'
            }
          },
          axisLabel:{
            color: '#646464'
          },
          axisTick: {
            show: false
          },
           data: visitsData,
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLine:{
            lineStyle:{
              color: '#E8E9ED'
            }
          },
          axisLabel:{
            color: '#646464'
          },
           splitArea: {
                show: false
            }
        },
        series: [
        {
          name: '签约量',
          smooth: false,
          symbol: 'rect',
          symbolSize:10,
          type: 'line',
          itemStyle: {
            normal: {
              // color: '#F9852E',
              lineStyle: {
                // color: '#F19431',
                width: 2
              },
              label : {
                color:'#646464',
                show: true
              }
            }
          },
          data: ipData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>

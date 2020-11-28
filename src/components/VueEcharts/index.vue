<template>
  <div class="echarts" :ref="refName"></div>
</template>

<script>
import { ref, watch, onMounted, getCurrentInstance } from 'vue'
import Echarts from 'echarts'

export default {
  name: 'VueEcharts',
  props: {
    theme: {
      type: [String, Object],
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  setup(ctx) {
    const refName = 'vueEcharts'
    let chart

    const initChart = () => {
      if (!chart) {
        const context = getCurrentInstance().ctx
        const dom = context.$refs[refName]
        dom && (chart = Echarts.init(dom, ctx.theme))
      }
      if (ctx.options) {
        chart.setOption(ctx.options)
      }
    }

    watch(() => ctx.options, () => {
      initChart()
    })

    onMounted(() => {
      initChart()
    })

    return {
      refName
    }
  }
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
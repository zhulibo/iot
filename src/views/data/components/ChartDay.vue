<script setup lang="ts">
import {reactive, watch} from "vue";
import {useEcharts} from '@/hooks/useEcharts'

const props = defineProps({
  logList: {
    type: Array,
    required: true
  }
})
const {initChart, setOption} = useEcharts()

const chartOption = reactive({
  title: {
    text: '分钟',
    left: 'center'
  },
  legend: {
    top: 0,
    left: 'right',
    textStyle: {
      fontSize: 12
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 20,
    right: 20,
    bottom: 20,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: "CO",
      data: [],
      type: 'bar',
      barWidth: '20%',
      label: {
        show: true
      }
    },
    {
      name: "CO2",
      data: [],
      type: 'bar',
      barWidth: '20%',
      label: {
        show: true
      }
    }
  ]
})

watch(() => props.logList, logList => {
  chartOption.xAxis.data = []
  chartOption.series[0].data = []
  chartOption.series[1].data = []
  logList.forEach(item => {
    chartOption.xAxis.data.push(item.timestamp)
    chartOption.series[0].data.push(item.values.CO)
    chartOption.series[1].data.push(item.values.CO2)
  })
  chartOption.xAxis.data.splice(0, chartOption.xAxis.data.length - 14)
  chartOption.series[0].data.splice(0, chartOption.series[0].data.length - 14)
  chartOption.series[1].data.splice(0, chartOption.series[1].data.length - 14)
  initChart('chart-day')
  setOption(chartOption)
}, {deep: true})

</script>

<template>
  <div id="chart-day"></div>
</template>

<style lang="pcss" scoped>
#chart-day{
  width: 100%;
  height: 300px;
}
</style>

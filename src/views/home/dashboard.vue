<script setup>
import {useUserStore} from "@/stores/user";
import {onMounted, onUnmounted, ref, reactive} from "vue";
import Socket from "@/utils/socket";
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
import { debounce } from 'js-fragment'
import {convertData, data} from "./components/data";

const userStore = useUserStore()

let msgList = ref([])
let socket = new Socket({
  url: `/apiws/home?authorization=${userStore.getUserInfo.token}`,
  onmessage: (res) => {
    console.log(res)
    msgList.value.push(res)
  }
})
socket.send({
  userName: userStore.getUserInfo.userName,
})

onUnmounted(() => {
  socket.send({
    userNameClose: userStore.getUserInfo.userName,
  })
  socket.destroy()
})

const chartMapOption = reactive({
  title: {
    text: '环境监测平台',
    subtext: '副标题',
    sublink: 'http://www.pm25.in',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      return params.name + '<br/>' +
        'co: ' + params.data.value[2] + '<br/>' +
        'co2: ' + params.data.value2[2];
    }
  },
  bmap: {
    center: [110, 35],
    zoom: 5.5,
    roam: true,
    mapStyle: {
      styleJson: [
        {
          featureType: 'water',
          elementType: 'all',
          stylers: {
            color: '#d1d1d1'
          }
        },
        {
          featureType: 'land',
          elementType: 'all',
          stylers: {
            color: '#f3f3f3'
          }
        },
        {
          featureType: 'railway',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'highway',
          elementType: 'all',
          stylers: {
            color: '#fdfdfd'
          }
        },
        {
          featureType: 'highway',
          elementType: 'labels',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'geometry',
          stylers: {
            color: '#fefefe'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'geometry.fill',
          stylers: {
            color: '#fefefe'
          }
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'green',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'subway',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'manmade',
          elementType: 'all',
          stylers: {
            color: '#d1d1d1'
          }
        },
        {
          featureType: 'local',
          elementType: 'all',
          stylers: {
            color: '#d1d1d1'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'labels',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'boundary',
          elementType: 'all',
          stylers: {
            color: '#fefefe'
          }
        },
        {
          featureType: 'building',
          elementType: 'all',
          stylers: {
            color: '#d1d1d1'
          }
        },
        {
          featureType: 'label',
          elementType: 'labels.text.fill',
          stylers: {
            color: '#999999'
          }
        }
      ]
    }
  },
  series: [
    {
      name: '设备数据',
      type: 'scatter',
      coordinateSystem: 'bmap',
      data: convertData(data),
      symbolSize: function () {
        return 14
      },
      // symbolSize: function (val) {
      //   return val[2] / 10;
      // },
      encode: {
        value: 2
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: true
      },
      itemStyle: {
        color: '#2a8dff',
        shadowBlur: 10,
        shadowColor: '#666'
      },
      emphasis: {
        label: {
          show: true
        }
      }
    },
  ]
})
let chartMap
let debounceLine

onMounted(() => {
  debounceLine = debounce(() => {
    if(chartMap){
      chartMap.resize()
    }
  }, 200)
  setTimeout(() => {
    initChartLine()
  }, 200)
})

// 初始化图表
const initChartLine = () => {
  if (!chartMap) {
    chartMap = echarts.init(document.getElementById('chart-map'))
    window.addEventListener('resize', debounceLine)
  }
  chartMap.setOption(chartMapOption)
}
</script>

<template>
  <div class="wrapper">
    <div id="chart-map"></div>
  </div>
</template>
<style lang="pcss" scoped>
#chart-map{
  width: 100%;
  height: calc(100vh - 103px);
}
</style>

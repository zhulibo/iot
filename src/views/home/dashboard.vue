<script setup>
import {useUserStore} from "@/stores/user";
import {onMounted, onUnmounted, ref, reactive} from "vue";
import Socket from "@/utils/socket";
import * as echarts from 'echarts';
import { debounce } from 'js-fragment'
import {convertData, data} from "./components/data";
import 'echarts/extension/bmap/bmap';

const userInfo = useUserStore()
const token = userInfo.getUserInfo.token
const userName = userInfo.getUserInfo.userName

// let msgList = ref([])
// let socket = new Socket({
//   url: `ws://${import.meta.env.VITE_APP_SERVER_IP}:8080/home?authorization=${token}`,
//   onmessage: (res) => {
//     console.log(res)
//     msgList.value.push(res)
//   }
// })
// socket.send({
//   userName: userName,
// })
//
// onUnmounted(() => {
//   socket.send({
//     userNameClose: userName,
//   })
//   socket.destroy()
// })

const chartMapOption = reactive({
  title: {
    text: '全国主要城市空气质量 - 百度地图',
    subtext: 'data from PM25.in',
    sublink: 'http://www.pm25.in',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  bmap: {
    center: [104.114129, 37.550339],
    zoom: 5,
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
      name: 'pm2.5',
      type: 'scatter',
      coordinateSystem: 'bmap',
      data: convertData(data),
      symbolSize: function (val) {
        return val[2] / 10;
      },
      encode: {
        value: 2
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: false
      },
      emphasis: {
        label: {
          show: true
        }
      }
    },
    {
      name: 'Top 5',
      type: 'effectScatter',
      coordinateSystem: 'bmap',
      data: convertData(
        data
          .sort(function (a, b) {
            return b.value - a.value;
          })
          .slice(0, 6)
      ),
      symbolSize: function (val) {
        return val[2] / 10;
      },
      encode: {
        value: 2
      },
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke'
      },
      label: {
        formatter: '{b}',
        position: 'right',
        show: true
      },
      itemStyle: {
        shadowBlur: 10,
        shadowColor: '#333'
      },
      emphasis: {
        scale: true
      },
      zlevel: 1
    }
  ]
})

let chartMap
let debounceLine

// onMounted(() => {
//   debounceLine = debounce(() => {
//     if(chartMap){
//       chartMap.resize()
//     }
//   }, 200)
//   setTimeout(() => {
//     initChartLine()
//   }, 200)
// })

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
  width: 1000px;
  height: 800px;
}
</style>

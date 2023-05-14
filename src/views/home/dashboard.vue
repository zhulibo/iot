<script setup>
import {useUserStore} from "@/stores/user";
import {onUnmounted, ref, reactive} from "vue";
import Socket from "@/utils/socket";
import * as echarts from 'echarts';
import 'echarts/extension/bmap/bmap';
import {debounce} from 'js-fragment'
import {getHomeDeviceInfo} from "@/api/home/home";

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
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: function (params) {
      let data = {}
      if(params.data.value[2]) {
        data = params.data.value[2]
      }
      let msg = params.name + '<br/>'
      // eslint-disable-next-line no-prototype-builtins
      if(data.hasOwnProperty('CO')) {
        msg += 'CO:' + data.CO.replace(/^0+/, '') + '<br/>'
      }
      // eslint-disable-next-line no-prototype-builtins
      if(data.hasOwnProperty('CO2')) {
        msg += 'CO2:' + data.CO2.replace(/^0+/, '') + '<br/>'
      }
      return msg
    }
  },
  bmap: {
    center: [110, 34],
    zoom: 6.8,
    roam: true,
    mapStyle: {
      styleJson:
        [{
          featureType: "road",
          elementType: "labels",
          stylers: {
            visibility: "off"
          }
        }, {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: {
            opacity: "4f"
          }
        }, {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: {
            opacity: "4f"
          }
        }]
    }
  },
  series: [
    {
      name: '设备数据',
      type: 'scatter',
      coordinateSystem: 'bmap',
      data: [],
      symbolSize: function () {
        return 12
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
        color: '#1fec4a',
        shadowBlur: 6,
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
let debounceLine = debounce(() => {
  if (chartMap) {
    chartMap.resize()
  }
}, 200)

// 初始化图表
const initChartLine = () => {
  if (!chartMap) {
    chartMap = echarts.init(document.getElementById('chart-map'))
    window.addEventListener('resize', debounceLine)
  }
  chartMap.setOption(chartMapOption)
}

const deviceInfo = ref({})
getHomeDeviceInfo({userName: userStore.getUserInfo.userName})
  .then(res => {
    const {devicesinfo, devicesdatainfo} = res.data
    deviceInfo.value = res.data
    let data = devicesinfo.map(item => {
      return {
        id: item.id,
        name: item.title,
        value: [item.longitude, item.latitude],
      }
    })
    data.forEach(item => {
      devicesdatainfo.forEach(item2 => {
        if (item.id === item2.deviceId) {
          item.value.push(JSON.parse(item2.values))
        }
      })
    })
    chartMapOption.series[0].data = data
    initChartLine()
  })
</script>

<template>
  <div class="wrapper">
    <div id="chart-map"></div>
  </div>
</template>
<style lang="pcss" scoped>
#chart-map {
  width: 100%;
  height: calc(100vh - 103px);
}
</style>

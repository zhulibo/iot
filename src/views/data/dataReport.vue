<script setup>
import {ref, onUnmounted, reactive} from "vue";
import {ElMessage} from "element-plus";
import {getDeviceList} from "@/api/device/device";
import {useUserStore} from "@/stores/user";
import Socket from "@/utils/socket";
import ChartMinute from "@/views/data/components/ChartMinute.vue";
import ChartHour from "@/views/data/components/ChartHour.vue";
import ChartDay from "@/views/data/components/ChartDay.vue";
import {getDataReport} from "@/api/data/data";
const userStore = useUserStore()


let deviceList = ref([])
const totalDevice = ref(0)
let schForm = reactive({
  userName: userStore.getUserInfo.userName,
  page: 1,
  size: 10,
})
const getDeviceListHandle = () => {
  getDeviceList(schForm)
    .then(res => {
      deviceList.value = res.results
      totalDevice.value = res.count
    })
}
getDeviceListHandle()

let deviceItem = ref({})
let logList = ref([])

let socket = new Socket({
  url: `/apiws/deviceLog?authorization=${userStore.getUserInfo.token}`,
  onmessage: (res) => {
    res.CO = res.CO.replace(/^0+/, '')
    res.CO2 = res.CO2.replace(/^0+/, '')
    let data = {
      timestamp: res.timestamp,
      values: res
    }
    logList.value.push(data)
    logList.value.shift()
  }
})

const changeDevice = (item) => {
  if(item.status === 'UNACTIVE') {
    return ElMessage.warning('该设备未激活')
  }
  if(item.topicStatus === 'UNSUBSCRIBED') {
    return ElMessage.warning('该设备未订阅')
  }
  logList.value = []
  let data = {
    userName: userStore.getUserInfo.userName,
    oldDeviceId: deviceItem.value.id,
    newDeviceId: item.id
  }
  if(data.oldDeviceId === '') delete data.oldDeviceId
  socket.send(data)
  deviceItem.value = item
  getDataReportHandle()
}

onUnmounted(() => {
  socket.send({
    userName: userStore.getUserInfo.userName,
    oldDeviceId: deviceItem.value.id,
  })
  socket.destroy()
})

const getDataReportHandle = () => {
  getDataReport({
    userName: userStore.getUserInfo.userName,
    deviceId: deviceItem.value.id,
  })
    .then(res => {
      let data = res.data.devicesdatainfo
      data.forEach(item => {
        item.values = JSON.parse(item.values)
        item.values.CO = item.values.CO.replace(/^0+/, '')
        item.values.CO2 = item.values.CO2.replace(/^0+/, '')
      })
      data.reverse()
      logList.value = data
    })
}


</script>

<template>
  <div class="wrapper log-wrapper">
    <div class="device-list">
      <div class="tt">设备列表</div>
      <ul>
        <li v-for="item in deviceList" :key="item.deviceId" @click="changeDevice(item)" :class="{active: item.id === deviceItem.id}">
          <span>{{item.title}}</span>
          <el-button v-if="item.status === 'UNACTIVE'" type="info" link>未激活</el-button>
          <el-button v-else-if="item.topicStatus === 'UNSUBSCRIBED'" type="warning" link>未订阅</el-button>
          <el-button v-else-if="item.topicStatus === 'SUBSCRIBED'" type="success" link>已订阅</el-button>
        </li>
      </ul>
      <!-- 分页 -->
      <el-pagination small layout="prev, pager, next" v-model:currentPage="schForm.page" :total="totalDevice"  @current-change="getDeviceListHandle"/>
    </div>
    <div class="log">
      <template v-if="deviceItem.id">
        <div class="tt">
          {{deviceItem.title}} 的运行日志
        </div>
        <div class="log-ct">
          <ChartMinute :logList="logList"></ChartMinute>
          <ChartHour :logList="logList"></ChartHour>
          <ChartDay :logList="logList"></ChartDay>
        </div>
      </template>
      <div v-else class="tt">
        请先选择设备
      </div>
    </div>
  </div>
</template>

<style lang="pcss" scoped>
.log-wrapper{
  display: flex;
  & .device-list{
    width: 300px;
    .tt{
      margin-bottom: 10px;
      font-size: 16px;
    }
    & li{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding: 5px;
      background-color: #f5f5f5;
      cursor: pointer;
      &.active{
        color: #fff;
        background-color: #308efc;
      }
    }
  }
  & .log{
    margin-left: 20px;
    flex: 1;
    & .tt{
      margin-bottom: 10px;
      font-size: 16px;
    }
  }
}
.log-ct{
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
}
</style>

<script setup>
import {onUnmounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {getDeviceList} from "@/api/device/device";
import {useUserStore} from "@/stores/user";
import Socket from "@/utils/socket";

const userStore = useUserStore()

let deviceList = ref([])

const getDeviceListHandle = () => {
  let data = {
    userName: userStore.getUserInfo.userName,
    size: 999,
    page: 1,
  }
  getDeviceList(data)
    .then(res => {
      deviceList.value = res.results
    })
}
getDeviceListHandle()

let deviceItem = ref({})
let logList = ref([])

let socket = new Socket({
  url: `/apiws/deviceLog?authorization=${userStore.getUserInfo.token}`,
  onmessage: (res) => {
    logList.value.push(res)
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
}

onUnmounted(() => {
  socket.send({
    userName: userStore.getUserInfo.userName,
    oldDeviceId: deviceItem.value.id,
  })
  socket.destroy()
})
</script>

<template>
  <div class="wrapper log-wrapper">
    <div class="device-list">
      <div class="tt">设备列表</div>
      <ul>
        <li v-for="item in deviceList" :key="item.deviceId" @click="changeDevice(item)" :class="{active: item.id === deviceItem.id}">
          <span>{{item.title}}</span>
          <el-button v-if="item.status === '1'" type="info" link>未激活</el-button>
          <el-button v-else-if="item.status === '2'" type="warning" link>离线</el-button>
          <el-button v-else-if="item.status === '3'" type="success" link>在线</el-button>
        </li>
      </ul>
    </div>
    <div class="log">
      <div v-if="deviceItem.title" class="tt">
        {{deviceItem.title}} 的运行日志
      </div>
      <!--      <div v-if="deviceItem.deviceId" class="tt">-->
      <!--        {{deviceItem.deviceId}} 的运行日志-->
      <!--      </div>-->
      <div v-else class="tt">
        请选择设备后查看日志
      </div>
      <div class="log-ct">
        <div v-for="item in logList" :key="item.uuid" class="log-item">
          <span class="s1">{{item.timestamp}}</span>
          <span class="s2">CO: {{item.CO}}</span>
          <span class="s3">CO2: {{item.CO2}}</span>
          <span class="s4">status: {{item.STATUS}}</span>
          <span class="s5">deviceId: {{item.deviceId}}</span>
          <span class="s6">uuid: {{item.uuid}}</span>
        </div>
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
.log-item{
  margin-bottom: 10px;
  &>span{
    display: inline-block;
    margin-right: 10px;
    &.s1{
      color: #777;
    }
  }
}
</style>

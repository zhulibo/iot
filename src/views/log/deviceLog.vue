<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRoute} from "vue-router";
import {getDeviceList} from "@/api/device/device";
import {useUserStore} from "@/stores/user";

const route = useRoute()
const userStore = useUserStore()
const deviceId = route.query.deviceId

let deviceList = ref([])

const getDeviceListHandle = () => {
  let data = {
    token: userStore.getUserInfo.token,
    userName: userStore.getUserInfo.userName
  }
  getDeviceList(data)
    .then(res => {
      deviceList.value = res.data
    })
}
getDeviceListHandle()

let deviceItem = ref({})
const changeDevice = (item) => {
  // if(item.status === '1') {
  //   return ElMessage.warning('该设备未激活')
  // }
  logList.value = []
  deviceItem.value = item
  if(socket){
    socket.close()
  }
  getLogList()
}

let socket
let logList = ref([])
const getLogList = () => {
  socket = new WebSocket(`ws://${import.meta.env.VITE_APP_SERVER_IP}:8080/room/123?authorization=eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6Imxhb2JhbiIsImV4cCI6MTY4MDQxMzM0OH0.Jus2G2fyzcG4liKeIY056iOWTO4eXp7by4sj-Cp4MG4`)
  socket.onopen = (res) => {
    console.log('onopen', res)
  }
  socket.onmessage = (res) => {
    console.log('onmessage', res)
    if(res.data) {
      logList.value.push(JSON.parse(res.data))
    }
  }
}
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
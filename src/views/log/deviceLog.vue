<script setup>
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {getDeviceList} from "@/api/device/device";
import {useUserStore} from "@/stores/user";
import {getDeviceLog} from "@/api/log/log";

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

const loading = ref(false)
let logList = ref([])
const total = ref(0)
let logForm = reactive({
  deviceId: '',
  deviceTopic: '/INFO/data',
  page: 1,
  size: 10,
})

const changeDevice = (item) => {
  if(item.status === 'UNACTIVE') {
    return ElMessage.warning('该设备未激活')
  }
  if(item.topicStatus === 'UNSUBSCRIBED') {
    return ElMessage.warning('该设备未订阅')
  }
  logForm.title = item.title
  logForm.deviceId = item.id
  getDeviceLogHandle()
}
const getDeviceLogHandle = () => {
  loading.value = true
  getDeviceLog(logForm)
    .then(res => {
      total.value = res.count
      logList.value = res.results
    })
    .finally(() => {
      loading.value = false
    })
}
const tabChange = () => {
  logForm.page = 1
  getDeviceLogHandle()
}
</script>

<template>
  <div class="wrapper log-wrapper">
    <div class="device-list">
      <div class="tt">设备列表</div>
      <ul>
        <li v-for="item in deviceList" :key="item.deviceId" @click="changeDevice(item)" :class="{active: item.id === logForm.deviceId}">
          <span>{{item.title}}</span>
          <el-button v-if="item.status === 'UNACTIVE'" type="info" link>未激活</el-button>
          <el-button v-else-if="item.topicStatus === 'UNSUBSCRIBED'" type="warning" link>未订阅</el-button>
          <el-button v-else-if="item.topicStatus === 'SUBSCRIBED'" type="success" link>已订阅</el-button>
        </li>
      </ul>
    </div>
    <div class="log">
      <div v-if="logForm.title" class="tt">
        {{logForm.title}} 的运行日志
      </div>
      <div v-else class="tt">
        请选择设备后查看日志
      </div>
      <div class="log-ct" v-loading="loading">
        <el-tabs v-model="logForm.deviceTopic" class="demo-tabs" @tab-change="tabChange">
<!--          <el-tab-pane label="全部" name=""></el-tab-pane>-->
          <el-tab-pane label="/INFO/data" name="/INFO/data" :disabled="!logForm.deviceId"></el-tab-pane>
          <el-tab-pane label="/ERROR/selftest" name="/ERROR/selftest" :disabled="!logForm.deviceId"></el-tab-pane>
          <el-tab-pane label="/LOG/selflog" name="/LOG/selflog" :disabled="!logForm.deviceId"></el-tab-pane>
          <el-tab-pane label="/CMD/controled" name="/CMD/controled" :disabled="!logForm.deviceId"></el-tab-pane>
          <el-tab-pane label="/CMD/updated" name="/CMD/updated" :disabled="!logForm.deviceId"></el-tab-pane>
          <el-tab-pane label="/CMD/control" name="/CMD/control" :disabled="!logForm.deviceId"></el-tab-pane>
        </el-tabs>
        <div v-for="item in logList" :key="item.uuid" class="log-item">
          <span class="s1">{{item.timestamp}}</span>
          <span class="s2">deviceId: {{item.deviceId}}</span>
          <span class="s3">values: {{item.values}}</span>
        </div>
      </div>
      <Page v-if="logForm.deviceId" v-model:currentPage="logForm.page" :total="total" @getList="getDeviceLogHandle"></Page>
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
  padding-left: 20px;
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
    &.s2{
      color: #777;
    }
  }
}
</style>

<script setup>
import {reactive, ref} from "vue";
import {createTopic, getDeviceList} from "@/api/device/device";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

const schForm = reactive({
  userName: userStore.getUserInfo.userName,
  title: '',
  deviceType: '',
  status: '',
  topicStatus: '',
  onOffLineStatus: '',
  page: 1,
  size: 2000,
})

let deviceList = reactive([])
// 获取设备列表
const getDeviceListHandle = () => {
  getDeviceList(schForm)
    .then(res => {
      deviceList.value = res.results
    })
}
getDeviceListHandle()

const userName = userStore.getUserInfo.userName
// 激活
const createTopicHandle = (row) => {
  return new Promise((resolve, reject) => {
    let data = {
      userName,
      deviceid: row.id,
    }
    createTopic(data)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

const flag = ref(true)
const start = () => {
  async function test () {
    for (let i = 0; i < deviceList.value.length; i++) {
      if (!flag.value) {
        break
      }
      const  res = await createTopicHandle(deviceList.value[i])
      if(res.code !== 0) {
        console.log(res)
        break
      }
    }
  }
  test()
}
const stop = () => {
  flag.value = false
}
</script>

<template>
  <div style="padding: 20px;">
    <h1>激活</h1>
    <el-button @click="start">开始</el-button>
    <el-button @click="stop">停止</el-button>
  </div>
</template>

<style lang="pcss" scoped>
</style>

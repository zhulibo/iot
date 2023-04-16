<script setup>
import {useUserStore} from "@/stores/user";
import {onUnmounted, ref} from "vue";
import Socket from "@/utils/socket";

const userInfo = useUserStore()
const token = userInfo.getUserInfo.token
const userName = userInfo.getUserInfo.userName

let msgList = ref([])
let socket = new Socket({
  url: `ws://${import.meta.env.VITE_APP_SERVER_IP}:8080/home?authorization=${token}`,
  onmessage: (res) => {
    console.log(res)
    msgList.value.push(res)
  }
})
socket.send({
  userName: userName,
})

onUnmounted(() => {
  socket.send({
    userNameClose: userName,
  })
  socket.destroy()
})
</script>

<template>
  <div class="wrapper">
    <div v-for="item in msgList" :key="item">
      devType: {{item.devType}}
      deviceId: {{item.deviceId}}
      status: {{item.status}}
      timestamp: {{item.timestamp}}
      uuid: {{item.uuid}}
      version: {{item.version}}
    </div>
  </div>
</template>
<style lang="pcss" scoped>
</style>

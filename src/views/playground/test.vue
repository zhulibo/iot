<script setup>
import {onMounted, onUnmounted, ref} from "vue";

let socket = new WebSocket(`ws://${import.meta.env.VITE_APP_SERVER_IP}:8080/room/123`)

let msgList = ref([])

socket.onopen = (res) => {
  console.log('onopen', res)
}
socket.onmessage = (res) => {
  console.log('onmessage', res)
  if(res.data) {
    msgList.value.push(res.data)
  }
}
socket.onerror = (res) => {
  console.log('onerror', res)
}
socket.onclose = (res) => {
  console.log('onclose', res)
}

let msg = ref('')
const sendMsg = () => {
  socket.send(msg.value)
  msg.value = ''
}

onUnmounted(() => {
  socket.close()
  socket = null
  console.log('已关闭socket')
})
</script>

<template>
  <el-input v-model="msg"></el-input>
  <el-button @click="sendMsg">发送信息</el-button>
  <ul>
    <li v-for="item in msgList">{{item}}</li>
  </ul>
</template>

<style lang="pcss" scoped>
</style>

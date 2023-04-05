<script setup>
import {onUnmounted, ref} from "vue";
import Socket from "@/utils/socket";

let msgList = ref([])
const receiveMsg = (res) => {
  if(res.data) {
    msgList.value.push(res.data)
  }
}

let ws = new Socket({
  url: `ws://${import.meta.env.VITE_APP_SERVER_IP}:8080/room/123`,
  onopen: () => {
    console.log('连接已打开')
  },
  onmessage: (res) => {
    console.log('收到消息了', res)
    receiveMsg(res)
  },
  onerror: () => {
    console.log('出现错误了')
  },
  onclose: () => {
    console.log('关闭了')
  },
})

let msg = ref()
const sendMsg = () => {
  ws.send(msg.value)
  msg.value = ''
}

const doOnerror = () => {
  let onerror = new Event('mousedown')
  document.dispatchEvent(onerror)
}

onUnmounted(() => {
  ws.destroy()
  ws = null
})
</script>

<template>
  <el-input v-model="msg"></el-input>
  <el-button @click="sendMsg">发送信息</el-button>
  <ul>
    <li v-for="item in msgList">{{item}}</li>
  </ul>
  <el-button @click="doOnerror">主动调起连接错误</el-button>
</template>

<style lang="pcss" scoped>
</style>


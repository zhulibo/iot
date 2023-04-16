import {ElMessage} from "element-plus";

export default class Socket {
  constructor(options) {
    if(!('WebSocket' in window)) {
      return ElMessage.warning('浏览器不支持websocket')
    }

    this.options = options
    this.init()
  }

  socket = null
  heartbeatTimer = null // 心跳timer
  heartbeatInterval = 10000 // 心跳发送间隔
  maxErrorCount = 5 // 最大onerror连续发生的次数
  errorCount = 0 // onerror连续发生的次数

  init() {

    if (this.socket) {
      return
    }

    this.socket = new WebSocket(this.options.url)
    // 把WebSocket的回调事件赋给Socket类
    this.socket.onopen = this.onopen.bind(this)
    this.socket.onmessage = this.onmessage.bind(this)
    this.socket.onerror = this.onerror.bind(this)
    this.socket.onclose = this.onclose.bind(this)
  }
  onopen(res) {
    this.options.onopen && this.options.onopen(res)
    this.resetHeartbeat()
  }
  resetHeartbeat() {
    // clearInterval(this.heartbeatTimer)
    // this.errorCount = 0
    // this.heartbeat()
  }
  heartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send(JSON.stringify({data: 'ping'}))
    }, this.heartbeatInterval)
  }
  onmessage(res) {
    this.resetHeartbeat()
    if(res.type && res.type === 'pong') {
      return
    }
    this.options.onmessage && this.options.onmessage(JSON.parse(res.data))
  }
  send(data, cb) {
    // OPEN状态直接发送
    if(this.socket.readyState === this.socket.OPEN) {
      this.socket.send(JSON.stringify(data))
      // 回调
      if(cb) cb()
    }
    // CONNECTING
    else if(this.socket.readyState === this.socket.CONNECTING) {
      console.log('readyState: CONNECTING, reSend 1s later', data)
      setTimeout(() => {
        this.send(data, cb)
      }, 1000)
    }
    // CLOSING、CLOSED
    else {
      this.init()
      console.log('readyState: CLOSING、CLOSED, reSend 1s later', data)
      setTimeout(() => {
        this.send(data, cb)
      }, 1000)
    }
  }
  onerror(res) {
    console.log('onerror', res)
    this.options.onerror && this.options.onerror(res)
    this.errorCount++
    // 超多maxErrorCount，自动重连
    if(this.errorCount >= this.maxErrorCount) {
      this.reconnect()
    }
  }
  onclose(res) {
    console.log('onclose', res)
    this.options.onclose && this.options.onclose(res)
  }
  destroy() {
    clearInterval(this.heartbeatTimer)
    this.errorCount = 0
    this.socket.close()
  }
  // 重新连接
  reconnect() {
    console.log('重新发起连接', this.socket.errorCount)
    if(this.socket) {
      this.socket.destroy()
    }
    this.socket.init()
  }
}

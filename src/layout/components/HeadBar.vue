<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInfo = userStore.getUserInfo
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  // 跳转并刷新，清除vuex中的数据
  location.reload()
}
</script>

<template>
  <div class="head-bar">
    <div class="user-info">
      <div class="user-name">{{ userInfo.userName }}</div>
      <div class="user-logout" @click="logout">退出</div>
    </div>
  </div>
</template>

<style lang="pcss" scoped>
.head-bar{
  position: absolute;
  z-index: 200;
  top: 0;
  left: 200px;
  right: 0;
  height: 50px;
  background-color: #fff;
}
.user-info{
  float: right;
  & .user-name{
    padding: 0 20px;
    min-width: 2em;
    line-height: 50px;
    cursor: pointer;
  }
  & .user-logout{
    display: none;
    padding: 10px 20px;
    background-color: #fff;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, .2);
  }
  &:hover{
    & .user-logout{
      display: block;
    }
  }
}
</style>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

let localUserInfo = localStorage.getItem('userInfo')

if (localUserInfo){
  const userInfo = JSON.parse(localUserInfo)
  userStore.updateUserInfo(userInfo)
  // 加载缓存数据
  // getDictAreaList()
}
</script>

<template>
  <RouterView />
</template>

<style lang="pcss">
/* 定义css级联层 */
@layer base;
@layer common;
@layer element;
@layer element-customize;

@import url(./assets/css/base.pcss) layer(base);
@import url(./assets/css/common.pcss) layer(common);
@import url(element-plus/dist/index.css) layer(element);
@import url(./assets/css/element-customize.pcss) layer(element-customize);

#app{
  height: 100%;
}
</style>

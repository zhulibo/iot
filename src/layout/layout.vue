<script setup>
import {computed} from "vue";
import {useVisitedPagesStore} from "@/stores/visitedPage";
import HeadBar from './components/HeadBar.vue'
import HeadTab from './components/HeadTab.vue'
import SideNav from './components/SideNav.vue'

const visitedPagesStore = useVisitedPagesStore()

const cachePages = computed(() =>{
  const visitedPages = visitedPagesStore.getVisitedPages
  const res = []
  for (let i = 0; i < visitedPages.length; i++) {
    if(visitedPages[i].meta.cache) {
      res.push(visitedPages[i].name)
    }
  }
  return res
})
</script>

<template>
  <HeadBar></HeadBar>
  <HeadTab></HeadTab>
  <SideNav></SideNav>
  <div class="main-ct">
    <router-view v-slot="{ Component }">
      <keep-alive :max="10" :include="cachePages">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style lang="pcss" scoped>
.main-ct{
  position: absolute;
  top: 81px;
  bottom: 0;
  left: 200px;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

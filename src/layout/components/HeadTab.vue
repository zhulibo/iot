<script setup>
import {computed, watch} from "vue";
import { useVisitedPagesStore } from '@/stores/visitedPage'
import {useRoute} from "vue-router";

const visitedPagesStore = useVisitedPagesStore()
const route = useRoute()

const visitedPages = computed(() => {
  return visitedPagesStore.getVisitedPages
})

watch(() => route.path, () => {
  visitedPagesStore.addVisitedPage({
    name: route.name,
    path: route.path,
    meta: route.meta
  })
}, {immediate: true})
</script>

<template>
  <div class="head-tab">
    <router-link
      class="tab-item"
      v-for="item in visitedPages"
      :key="item.path"
      :to="{path: item.path, query: item.query}"
    >
      <span :class="{active: item.path === route.path}">{{item.meta.title}}</span>
    </router-link>
  </div>
</template>

<style lang="pcss" scoped>
.head-tab{
  position: absolute;
  z-index: 100;
  top: 50px;
  left: 200px;
  right: 0;
  height: 30px;
  border-top: 1px solid #eee;
  background-color: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, .1);
}
.tab-item{
  display: inline-block;
  & span{
    box-sizing: border-box;
    display: inline-block;
    margin-left: 10px;
    padding-left: 10px;
    padding-right: 10px;
    min-width: 60px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    text-align: center;
    background-color: #f1f1f1;
    &.active{
      color: #fff;
      background-color: var(--mainColor);
    }
  }
}
</style>

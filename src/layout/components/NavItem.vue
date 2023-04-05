<script setup>
import path from 'path-browserify'
import { ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    required: true
  },
})

const submenuList = (props.item.children ?? []).filter((item) => { // 子菜单数组
  return !item.meta.hidden
})

const hasSubmenu = ref(submenuList.length > 0) // 有下一级菜单

const resolvePath = (routePath) => {
  return path.resolve(props.basePath, routePath)
}
</script>

<template>
  <el-sub-menu v-if="hasSubmenu" :index="item.path">
    <template #title>
      <icon :name="item.meta.icon" />
      <span>{{ item.meta.title }}</span>
    </template>
    <navItem v-for="child in item.children" :key="child.path" :item="child" :basePath="resolvePath(child.path)"></navItem>
  </el-sub-menu>
  <el-menu-item v-else-if="!item.meta.hidden" :index="basePath">
    <icon :name="item.meta.icon" />
    <span>{{ item.meta.title }}</span>
  </el-menu-item>
</template>


<style lang="pcss" scoped>
.icon{
  margin-right: 3px;
  font-size: 16px;
}
</style>

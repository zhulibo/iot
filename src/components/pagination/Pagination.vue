<script setup>
import { computed } from "vue";

const prop = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})
const emit = defineEmits([
  'getList',
  'update:currentPage'
])

const page = computed({
  get() {
    return prop.currentPage
  },
  set(val) {
    emit('update:currentPage', val)
    emit('getList')
  }
})
</script>

<template>
  <el-pagination
    layout="prev, pager, next, jumper"
    v-model:current-page="page"
    :total="total"
    background
  />
</template>

<style lang="pcss" scoped>
.el-pagination{
  margin-top: 10px;
  justify-content: center;
}
</style>

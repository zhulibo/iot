<script setup>
import {watch, ref} from "vue";
import {useUserStore} from "@/stores/user";

const userStore = useUserStore()

const headers = {
  token: userStore.getUserInfo.token
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
})
const emit = defineEmits([
  'update:modelValue'
])

const valList = ref()
watch(() => props.modelValue, (val) => {
  if(!val) return
  let list = [{
    name: val,
    url: val
  }]
  valList.value = list
}, {immediate: true})

const handleSuccess = (res, file, fileList) => {
  emit('update:modelValue', res.data.usersInfo.file)
}
</script>

<template>
  <el-upload
    :file-list="valList"
    :headers="headers"
    action="/api/device/deviceupgrade"
    :limit="1"
    :on-success="handleSuccess"
  >
    <el-button type="primary">选择文件</el-button>
    <template #tip>
      <div class="el-upload__tip">
        文件格式支持xxx
      </div>
    </template>
  </el-upload>
</template>

<style lang="pcss" scoped>
</style>

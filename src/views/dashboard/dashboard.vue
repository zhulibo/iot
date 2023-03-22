<script setup>
import {getDeviceMeasurement} from "@/api/device/device";
import {useUserStore} from "@/stores/user";
import {reactive, ref} from "vue";

const userInfo = useUserStore()
const token = userInfo.getUserInfo.token

const channelList = [
  '5ce0e9a5-5ffa-654b-cee0-1238041fb31a',
  '5ce0e9a5-5ffa-654b-cee0-1238041fb31b'
]

const deviceForm = reactive({
  datachannel: '',
})
const deviceRule = reactive({
  datachannel: [{ required: true, message: '请输入', trigger: 'blur' }],
})
const deviceFormRef = ref()

const deviceList = ref([])

const getDeviceMeasurementHandle = () => {
  deviceFormRef.value.validate(valid => {
    if(valid) {
      getDeviceMeasurement({
        datachannel: deviceForm.datachannel,
        token: token
      })
        .then(res => {
          deviceList.value = res.data
        })
    }
  })
}

</script>

<template>
  <div class="wrapper">
    <div class="device-form">
      <el-form ref="deviceFormRef" :model="deviceForm" :rules="deviceRule" :inline="true">
        <el-form-item label="datachannel">
          <el-select v-model="deviceForm.datachannel" placeholder="请选择" style="width: 340px;">
            <el-option v-for="item in channelList" :label="item" :value="item" :key="item"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeviceMeasurementHandle" style="width: 4em;">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="device-list">
      <el-table :data="deviceList" style="width: 100%">
        <el-table-column prop="timestamp" label="timestamp" min-width="300" />
        <el-table-column prop="datachannel" label="datachannel" min-width="300" />
        <el-table-column prop="value" label="value" min-width="200" />
      </el-table>
    </div>
  </div>
</template>

<style lang="pcss" scoped>
.device-form{
  margin-top: 20px;
  margin-left: 20px;
}
.device-list{
  margin-top: 30px;
  width: 800px;
}
</style>

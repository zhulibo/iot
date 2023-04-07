<script setup>
import {nextTick, reactive, ref} from "vue";
import {getDeviceList, addDevice, editDevice, delDevice} from "@/api/device/device";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user";

const router = useRouter()
const userStore = useUserStore()

const schForm = reactive({
  token: userStore.getUserInfo.token,
  userName: userStore.getUserInfo.userName,
  deviceId: '',
  startTime: '',
  endTime: '',
  status: '',
  isSub: '',
  page: 1,
  size: 1,
})

const loading = ref(true)
const deviceList = ref([])
const total = ref(0)
const tableRef = ref()

// 获取设备列表
const getDeviceListHandle = () => {
  loading.value = true
  getDeviceList(schForm)
    .then(res => {
      total.value = res.count
      deviceList.value = res.results
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
getDeviceListHandle()

const schFormRef = ref()

// 重置搜索条件
const resetForm = () => {
  schFormRef.value.resetFields()
  getListHandle()
}

// 刷新设备
const getListHandle = () => {
  tableRef.value.clearSort() // 重置排序
  schForm.page = 1
  getDeviceListHandle()
}

let multipleSelection = ref([])
// 多选
const handleSelectionChange = (val) => {
  console.log(val)
  multipleSelection.value = val
}
// 多选删除
const multiDel = () => {
  let data = multipleSelection.value.map(item => {
    return item.deviceId
  })
  data = data.join()
  ElMessageBox.confirm('确定删除', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delDevice({
        deviceId: data
      })
        .then(res => {
          ElMessage.success(res.msg)
          getDeviceListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

// 删除设备
const delDeviceHandle = (row) => {
  ElMessageBox.confirm('确定删除 ' + row.deviceId, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delDevice({
        deviceId: row.deviceId
      })
        .then(res => {
          ElMessage.success(res.msg)
          getDeviceListHandle()
        })
    })
    .catch(e => {
      console.log(e)
    })
}

const dialogEditVisible = ref(false)
const deviceFormRef = ref()

// 切换订阅状态
const switchStatus = (row) => {
  loading.value = true
  const data = {
    deviceId: row.deviceId,
    isSub: row.isSub,
  }
  editDevice(data).then(res => {
    ElMessage.success(res.msg)
    getDeviceListHandle()
  }).catch(() => {
    getDeviceListHandle()
  })
}

// 新增设备
const addDeviceHandle = async() => {
  dialogEditVisible.value = true
  await nextTick()
  resetDeviceForm()
}

// 编辑设备
const editDeviceHandle = async(row) => {
  dialogEditVisible.value = true
  await nextTick()
  resetDeviceForm()
  for (const key in deviceForm) {
    deviceForm[key] = row[key]
  }
  deviceForm.deviceId = row.deviceId
}

// 重置设备表单
const resetDeviceForm = () => {
  deviceFormRef.value.resetFields()
  delete deviceForm.deviceId
}

const deviceForm = reactive({
  deviceId: '',
})

const deviceRules = reactive({
  deviceId: [{ required: true, message: '请输入', trigger: 'blur' }],
})

// 提交设备表单
const submitDeviceForm = () => {
  deviceFormRef.value.validate(valid => {
    if(valid) {
      if(deviceForm.deviceId) {
        editDevice(deviceForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getDeviceListHandle()
          })
      }else{
        addDevice(deviceForm)
          .then(res => {
            ElMessage.success(res.msg)
            dialogEditVisible.value = false
            getDeviceListHandle()
          })
      }
    }
  })
}
const sub = (row) => {
  console.log('sub')
}
const unSub = (row) => {
  console.log('unSub')
}
const upgrade = (row) => {
  console.log('upgrade')
}
const toLog = (row) => {
  router.push({ path: '/login', query: {deviceId: row.deviceId}})
}
</script>

<template>
  <div class="wrapper">
    <div class="table-head">
      <div class="sch">
        <el-form ref="schFormRef" :inline="true" :model="schForm">
          <el-form-item label="设备id" prop="deviceId">
            <el-input v-model="schForm.deviceId" placeholder="请输入" style="width: 200px;" clearable @change="getListHandle" />
          </el-form-item>
          <el-form-item label="创建时间" prop="startTime">
            <el-date-picker v-model="schForm.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="起" style="width: 200px;" @change="getListHandle"></el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="endTime">
            <el-date-picker v-model="schForm.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="至" style="width: 200px;" @change="getListHandle"></el-date-picker>
          </el-form-item>
          <el-form-item label="设备状态" prop="status">
            <el-radio-group v-model="schForm.status" @change="getListHandle">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="0">未激活</el-radio-button>
              <el-radio-button :label="1">离线</el-radio-button>
              <el-radio-button :label="2">在线</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订阅状态" prop="isSub">
            <el-radio-group v-model="schForm.isSub" @change="getListHandle">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button :label="0">已订阅</el-radio-button>
              <el-radio-button :label="1">未订阅</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" plain @click="getListHandle">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="new-item">
        <el-button type="primary" @click="addDeviceHandle"><icon name="add" />新增</el-button>
      </div>
    </div>
    <el-table ref="tableRef" :data="deviceList" v-loading="loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" />
      <el-table-column prop="created" label="创建时间" align="center" width="200" sortable></el-table-column>
      <el-table-column prop="deviceId" label="设备id" min-width="140" sortable></el-table-column>
      <el-table-column prop="title" label="title" min-width="140" sortable></el-table-column>
      <el-table-column prop="status" label="设备状态" min-width="140" sortable>
        <template #default="scope">
          <el-button v-if="scope.row.status === '1'" type="info" link>未激活</el-button>
          <el-button v-else-if="scope.row.status === '2'" type="warning" link>离线</el-button>
          <el-button v-else-if="scope.row.status === '3'" type="success" link>在线</el-button>
        </template>
      </el-table-column>
<!--      <el-table-column prop="isSub" label="订阅状态" min-width="140" sortable>-->
<!--        <template #default="scope">-->
<!--          <el-switch-->
<!--            v-model="scope.row.isSub"-->
<!--            :active-value="1"-->
<!--            :inactive-value="0"-->
<!--            @change="switchStatus(scope.row)"-->
<!--          >-->
<!--          </el-switch>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="操作" align="right" width="260" fixed="right" class-name="manage-td">
        <template #default="scope">
          <el-button type="primary" link v-if="scope.row.isSub === 1" @click="upgrade(scope.row)"><icon name="edit" />升级</el-button>
          <el-button type="primary" link @click="toLog(scope.row)"><icon name="deviceLog" />日志</el-button>
          <el-button type="primary" link @click="editDeviceHandle(scope.row)"><icon name="edit" />修改</el-button>
          <el-button type="warning" link @click="delDeviceHandle(scope.row)"><icon name="del" />删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <el-button type="danger" plain style="margin-left: 10px;" @click="multiDel" :disabled="multipleSelection.length === 0"><icon name="del" />删除</el-button>
    </div>
    <Page v-model:currentPage="schForm.page" :total="total" @getList="getDeviceListHandle"></Page>
    <el-dialog v-model="dialogEditVisible" title="编辑设备" width="800px">
      <el-form ref="deviceFormRef" :model="deviceForm" :rules="deviceRules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备id" prop="deviceId">
              <el-input v-model="deviceForm.deviceId" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDeviceForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="pcss" scoped>
</style>
